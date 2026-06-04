# 学生作品归档部署设计文档

**日期：** 2026-06-05  
**状态：** 已确认，待实现  
**目标：** 学生在 vibesys 提交 Git 仓库，系统自动部署到校内服务器（Coolify），永久保留可交互的完整全栈作品，供教师内部存档与评分。

---

## 背景与问题

学生将作品部署在自购云服务器上，服务器到期后作品无法访问。教师需要一种永久可访问、功能完整的存档方式，不依赖学生续费。

---

## 方案：Coolify + vibesys 轻量集成

在校内服务器部署 Coolify（开源自托管 PaaS），vibesys 调用其 REST API 触发构建与部署，每个学生项目在独立 Docker 容器中运行，互不冲突。

---

## 架构

```
┌─────────────────────────────────────────────┐
│           校内服务器                         │
│                                             │
│  ┌──────────┐   Coolify API   ┌──────────┐  │
│  │ vibesys  │ ──────────────► │ Coolify  │  │
│  │(CF Worker│ ◄────────────── │  PaaS    │  │
│  │  后端)   │   build status  └────┬─────┘  │
│  └──────────┘                     │         │
│                              Traefik 反代    │
│                         ┌────────┴──────┐   │
│                         │每个项目独立容器│   │
│                         │ projectA.x.com│   │
│                         │ projectB.x.com│   │
│                         └───────────────┘   │
└─────────────────────────────────────────────┘
```

**隔离保证：**
- 数据库：每个项目有独立 MySQL/Postgres/Redis 容器，数据互不可见
- 技术栈：各自容器内运行，JVM 版本、Node 版本互不干扰
- 网络：Traefik 反代，每个项目分配独立子域名
- 环境变量：每个项目独立配置，不跨项目共享
- 资源：Coolify 支持对每个应用设 CPU / 内存上限

---

## 学生操作流程

```
项目详情页 / 毕设页
  └─ "归档部署" 区块
       ├─ [未部署] → 按钮"提交归档"
       │     └─ 弹窗：填写 Git 仓库地址 + 环境变量（key=value）
       │              ↓ 提交
       │           后端调 Coolify API → 返回 appId
       │           前端每 5 秒轮询构建状态
       │
       ├─ [构建中] → 进度提示 "正在构建..."
       │
       ├─ [运行中] → 显示永久访问地址（可点击）
       │
       └─ [失败]   → 显示错误原因 + 重试按钮
```

**轮询说明：** Git 代码仅在部署触发时拉取一次，存档固定为提交时版本。前端轮询仅是每 5 秒查询 Coolify 的构建状态（building / running / failed），不重复拉取代码。

---

## 数据模型变更

`Project` 和 `ThesisProject` 各新增三个字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `archiveUrl` | `String?` | Coolify 分配的永久访问地址 |
| `archiveStatus` | `String?` | `pending / building / running / failed` |
| `coolifyAppId` | `String?` | Coolify 内部 app UUID |

**注意：** 学生填写的环境变量直接透传给 Coolify，不存入 D1，避免敏感信息落库。

---

## 后端 API

| 路由 | 说明 |
|------|------|
| `POST /api/projects/:id/archive` | 触发归档部署（接收 gitUrl + envVars） |
| `GET /api/projects/:id/archive/status` | 查询构建状态（前端轮询） |
| `POST /api/thesis/project/archive` | 毕设归档部署 |
| `GET /api/thesis/project/archive/status` | 毕设构建状态查询 |

### 部署触发逻辑

```typescript
async function deployToArchive(projectId, gitUrl, envVars) {
  // 1. 创建 Coolify 应用
  const app = await coolify.post('/applications', {
    type: 'public',
    git_repository: gitUrl,
    git_branch: 'main',
    build_pack: 'nixpacks',       // 自动识别 Node/Java/Python
    environment_name: 'production',
    server_uuid: COOLIFY_SERVER_UUID,
    project_uuid: COOLIFY_PROJECT_UUID,
  })

  // 2. 注入环境变量
  for (const [key, value] of Object.entries(envVars)) {
    await coolify.post(`/applications/${app.uuid}/envs`, { key, value })
  }

  // 3. 触发构建
  await coolify.post(`/applications/${app.uuid}/deploy`)

  // 4. 写入 D1
  await updateProject(projectId, {
    coolifyAppId: app.uuid,
    archiveStatus: 'building',
  })
}
```

### 状态查询逻辑

```typescript
async function checkStatus(projectId) {
  const { coolifyAppId } = await getProject(projectId)
  const app = await coolify.get(`/applications/${coolifyAppId}`)

  const statusMap = {
    running: 'running',
    exited: 'failed',
    starting: 'building',
  }
  const status = statusMap[app.status] ?? 'building'

  if (status === 'running') {
    await updateProject(projectId, {
      archiveUrl: app.fqdn,
      archiveStatus: 'running',
    })
  }
  return { status, archiveUrl: app.fqdn }
}
```

---

## Coolify 校内服务器配置（一次性）

```bash
# 1. 安装 Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 2. 访问 http://校内服务器IP:8000 完成初始化
# 3. 创建专用 Project，命名为 "vibesys-archive"
# 4. 生成 API Token
```

在 vibesys 后端环境变量中配置：

```
COOLIFY_BASE_URL=http://校内服务器IP:8000
COOLIFY_API_TOKEN=xxx
COOLIFY_SERVER_UUID=xxx
COOLIFY_PROJECT_UUID=xxx
```

---

## Nixpacks 自动识别（无需 Dockerfile）

| 技术栈 | 识别依据 | 启动方式 |
|--------|----------|----------|
| Node.js | `package.json` | `npm install && npm start` |
| Spring Boot | `pom.xml` | `mvn build && java -jar` |
| Python | `requirements.txt` | `pip install && python app.py` |

90% 的标准项目无需学生修改代码。需要学生注意的唯一事项：**数据库连接地址等配置必须通过环境变量传入**，不能硬编码为旧服务器 IP。vibesys 在部署弹窗中需给出提示。

---

## 管理员视图

Coolify 自带完整 Web UI（`http://校内服务器IP:8000`），管理员可：
- 查看所有已部署项目的运行状态、日志
- 手动重启 / 停止某个项目
- 查看资源占用，对高消耗项目设置限额

---

## 范围约束

- **不实现：** 自动检测学生原服务器到期提醒（学生主动提交）
- **不实现：** 从 Coolify 恢复环境变量展示给学生（安全）
- **不实现：** 版本历史 / 回滚（存档只保留最新提交版本）
