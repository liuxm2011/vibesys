# VibeCoding 教学实践平台 — 开发指南

> GSD工作流驱动的开发流程

## 项目概述

学生自主式软件开发实践平台。学生通过选题 → AI生成PRD → AI生成技术文档 → 外部AI编码工具开发的完整流程。

## 技术栈

- **Frontend:** Vue 3 + TypeScript + Vite + Element Plus + Pinia + Tailwind CSS
- **Backend:** Node.js + Express + MySQL + Prisma + JWT
- **AI:** Codex/OpenAI API
- **Deploy:** 阿里云/腾讯云

## 工作流程

遵循 `.planning/ROADMAP.md` 定义的阶段顺序：

1. **Phase 1:** 认证与用户基础
2. **Phase 2:** 选题管理与学生端
3. **Phase 3:** 文档生成与AI服务
4. **Phase 4:** 文档导出功能
5. **Phase 5:** 管理后台

每个阶段：
- `/gsd-discuss-phase N` — 收集上下文，澄清方案
- `/gsd-plan-phase N` — 创建详细计划
- `/gsd-execute-phase N` — 执行计划
- `/gsd-verify-work N` — 验证完成度

## 本地开发环境

| 服务 | 端口 | 说明 |
|------|------|------|
| 后端 (Express) | **3001** | `.env` 中 `PORT=3001`，Vite 代理必须指向此端口 |
| 前端 (Vite) | **5173** | `vite.config.ts` 中配置 |
| MySQL | **3306** | Docker 容器运行 |
| Redis | **6379** | 本地运行 |

> ⚠️ 端口 3000 常被 Docker 或其他服务占用，后端不使用此端口。Vite 代理 `/api` 目标为 `http://127.0.0.1:3001`。

## 生产部署环境（腾讯云 VPS）

当前项目已经部署到腾讯云公网服务器，后续新 session 不需要重新摸排服务器状态，直接按本节执行维护和更新。

### 服务器与域名

| 项目 | 当前值 |
|------|--------|
| 云服务器公网 IP | `101.43.175.201` |
| SSH 用户 | `ubuntu` |
| SSH 本机别名 | `vibecoding-vps` |
| SSH 私钥 | `~/.ssh/vibecoding_vps_ed25519` |
| 操作系统 | Ubuntu 24.04 LTS |
| 主域名 | `https://miaofu.work` |
| Cloudflare | `miaofu.work` 和 `www.miaofu.work` 已开启代理访问 |
| 大模型子域 | `https://llm.miaofu.work/v1`，不要随项目部署改动 |

注意：
- `miaofu.work` / `www.miaofu.work` 用于本教学平台。
- `llm.miaofu.work` 连接独立的大模型服务，DNS 与反代配置不要删除、覆盖或改指向本项目。
- Cloudflare 代理已可正常访问主站；如果排查源站，可用 `curl --resolve miaofu.work:443:101.43.175.201 https://miaofu.work` 绕过 Cloudflare 直连源站验证。
- 不要把 SSH 密码、数据库密码、JWT secret、AI key 写入 Git 或本文档。真实生产环境变量保存在服务器 `/opt/vibecoding/backend/.env`。

### SSH 密钥连接方式

这台开发电脑已经为生产 VPS 配置专用 SSH 密钥，后续维护优先使用密钥登录，不再使用密码或 `sshpass`：

```bash
ssh vibecoding-vps
```

本机 SSH 配置位于 `~/.ssh/config`，核心条目如下：

```sshconfig
Host vibecoding-vps
  HostName 101.43.175.201
  User ubuntu
  Port 22
  IdentityFile ~/.ssh/vibecoding_vps_ed25519
  IdentitiesOnly yes
  IPQoS none
  ServerAliveInterval 30
  ServerAliveCountMax 3
  StrictHostKeyChecking accept-new
```

密钥指纹：

```text
SHA256:/eK3WRKNV5NV7xEyJuSc3Jgy5FrpaY8+xlDk7xA7upc vibecoding-vps-ubuntu@101.43.175.201
```

连接验证命令：

```bash
ssh -o BatchMode=yes -o PreferredAuthentications=publickey vibecoding-vps 'echo key-login-ok && hostname && whoami'
```

上传文件使用别名：

```bash
scp /tmp/vibecoding-src.tar.gz vibecoding-vps:/tmp/vibecoding-src.tar.gz
```

### 服务器上的应用布局

| 用途 | 路径 / 服务 |
|------|-------------|
| 应用源码 | `/opt/vibecoding` |
| 后端目录 | `/opt/vibecoding/backend` |
| 前端目录 | `/opt/vibecoding/frontend` |
| 前端静态发布目录 | `/var/www/vibecoding` |
| 后端 systemd 服务 | `vibecoding-backend.service` |
| 后端监听端口 | `127.0.0.1:3001`（Nginx 反代 `/api`） |
| Nginx 站点配置 | `/etc/nginx/sites-available/vibecoding.conf` |
| Nginx 启用链接 | `/etc/nginx/sites-enabled/vibecoding.conf` |
| MySQL 数据库 | `vibecoding` |
| MySQL 应用用户 | `vibecoding` |

当前运行方式：
- Nginx 对外监听 `80/443`。
- `/` 由 `/var/www/vibecoding` 提供 Vue 静态文件。
- `/api/` 反代到 `http://127.0.0.1:3001`。
- `/api/ai/generate/stream` 已在 Nginx 中单独关闭 buffering，支持 SSE 流式返回。
- 后端由 `systemd` 托管，服务名为 `vibecoding-backend.service`。
- 旧 `ruoyi` 服务已停用，原 `8080` Java 服务不再作为本项目依赖。

### 服务器常用检查命令

```bash
sudo systemctl status vibecoding-backend --no-pager -l
sudo systemctl status nginx --no-pager -l
sudo journalctl -u vibecoding-backend -n 120 --no-pager
curl -fsS http://127.0.0.1:3001/api/health
curl -k --resolve miaofu.work:443:101.43.175.201 https://miaofu.work/api/health
```

线上健康状态应满足：
- `vibecoding-backend` 为 `active (running)`。
- `nginx -t` 通过。
- `/api/health` 返回 `{"status":"ok", ...}`。
- `https://miaofu.work` 能打开登录页。

### 数据库与 Prisma 注意事项

生产数据库使用 MySQL。当前首次部署使用的是：

```bash
cd /opt/vibecoding/backend
pnpm exec prisma generate
pnpm exec prisma db push
pnpm run db:seed
```

注意：
- 当前仓库已有历史 migration 文件并不完全匹配 MySQL 方言；未来在整理迁移链之前，不要直接在生产环境运行 `prisma migrate deploy`。
- 如果只是同步当前 schema，继续使用 `prisma db push`。
- `pnpm run db:seed` 会创建默认管理员；如果管理员已存在，脚本会跳过。
- 默认管理员是 `admin / admin123`，上线后应尽快在后台修改密码。

## 生产代码更新流程（方案一：本地打包上传）

后续本地修改代码后，采用“本地打包上传到服务器”的方式同步，不要求服务器能访问 Gitee，也不需要在服务器配置 Gitee 凭据。

推荐流程：

1. 本地完成代码修改。
2. 本地验证：
   ```bash
   cd backend && pnpm exec tsc --noEmit
   cd ../frontend && pnpm run build
   ```
3. 提交并推送远程仓库：
   ```bash
   git status --short
   git add <需要提交的文件>
   git commit
   git push origin main
   ```
4. 从本地当前 Git 版本生成源码包并上传：
   ```bash
   git archive --format=tar.gz -o /tmp/vibecoding-src.tar.gz HEAD
   scp /tmp/vibecoding-src.tar.gz vibecoding-vps:/tmp/vibecoding-src.tar.gz
   ```
5. 在服务器解包并更新：
   ```bash
   ssh vibecoding-vps

   APP_DIR=/opt/vibecoding
   WEB_DIR=/var/www/vibecoding

   cp "$APP_DIR/backend/.env" /tmp/vibecoding-backend.env
   sudo rm -rf "$APP_DIR"
   sudo mkdir -p "$APP_DIR"
   sudo chown -R ubuntu:ubuntu "$APP_DIR"
   tar -xzf /tmp/vibecoding-src.tar.gz -C "$APP_DIR"
   cp /tmp/vibecoding-backend.env "$APP_DIR/backend/.env"
   chmod 600 "$APP_DIR/backend/.env"

   cd "$APP_DIR/backend"
   pnpm install --frozen-lockfile
   pnpm exec prisma generate
   pnpm exec prisma db push
   sudo systemctl restart vibecoding-backend

   cd "$APP_DIR/frontend"
   pnpm install --frozen-lockfile
   pnpm run build
   sudo rsync -a --delete dist/ "$WEB_DIR/"
   sudo chown -R www-data:www-data "$WEB_DIR"

   sudo nginx -t
   sudo systemctl reload nginx
   curl -fsS http://127.0.0.1:3001/api/health
   ```

如果需要单独执行环境文件保护，规则是先备份生产 `.env`，再删除旧目录：

```bash
sudo cp /opt/vibecoding/backend/.env /tmp/vibecoding-backend.env
sudo rm -rf /opt/vibecoding
sudo mkdir -p /opt/vibecoding
sudo chown -R ubuntu:ubuntu /opt/vibecoding
tar -xzf /tmp/vibecoding-src.tar.gz -C /opt/vibecoding
cp /tmp/vibecoding-backend.env /opt/vibecoding/backend/.env
chmod 600 /opt/vibecoding/backend/.env
```

部署后必须验证：

```bash
curl -fsS http://127.0.0.1:3001/api/health
curl -k --resolve miaofu.work:443:101.43.175.201 https://miaofu.work/api/health
curl -I https://miaofu.work
```

### 更新流程约束

- 不要提交真实 `.env` 文件；只提交 `.env.example`。
- 不要覆盖服务器 `/opt/vibecoding/backend/.env`，其中包含生产数据库、JWT、AI 配置。
- 不要修改 `llm.miaofu.work` 的 Cloudflare DNS 或服务器侧 `llm-miaofu.conf`，除非任务明确要求维护大模型服务。
- 不要重新启用 `ruoyi.service`。
- 如果 SSH 连接频繁断开，避免并发开多个 SSH；使用单连接或等待 fail2ban/MaxStartups 限制恢复。

## 关键约束

- 认证必须对接学校SSO（CAS/OAuth）
- AI API调用需限额控制（Redis计数）
- 文档模板需领域特定（软件工程/大数据）

## 规划文档

| 文档 | 位置 |
|------|------|
| 项目定义 | `.planning/PROJECT.md` |
| 需求列表 | `.planning/REQUIREMENTS.md` |
| 路线图 | `.planning/ROADMAP.md` |
| 当前状态 | `.planning/STATE.md` |
| 研究报告 | `.planning/research/` |

---

*Generated by GSD — 2026-04-18*

<claude-mem-context>
# Memory Context

# [学生项目构建-cc] recent context, 2026-04-27 7:58pm GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (4,181t read) | 646,816t work | 99% savings

### Apr 23, 2026
S18 Implement read/edit mode toggle for all document tabs (Apr 23 at 8:14 PM)
S1 Add a switch button to toggle between reading mode and editing mode for all seven generated documents (Apr 23 at 8:14 PM)
S24 查看文档生成的超时设定 (Apr 23 at 8:28 PM)
S27 调试启动专家团审核偶尔出现network error的情况 (Apr 23 at 9:12 PM)
S28 用户询问是否将代码同步到服务器可解决生产环境的文档生成超时问题 (Apr 23 at 9:31 PM)
S29 调试专家团审核偶尔出现network error的情况，Claude指导配置Nginx长超时 (Apr 23 at 10:01 PM)
S50 修改毕设文档UI序列，删除中期检查①，调整第四、第六项标签 (Apr 23 at 10:02 PM)
### Apr 25, 2026
S87 重启项目前后端 (Apr 25 at 1:21 AM)
90 1:35a 🟣 毕设文档API路由设计
91 " 🟣 毕设文档开发任务清单
92 " ✅ 毕设文档Prisma数据库模型设计
93 1:36a 🟣 毕设文档后端模块设计启动
95 " 🟣 毕设文档数据库模型设计完成
96 " ✅ Project模型关联关系更新
97 1:37a 🔵 Prisma项目结构检查
98 " 🟣 毕设文档数据库设计完成
### Apr 26, 2026
101 9:27p 🔵 文档生成重启问题的潜在原因分析
102 9:28p 🔵 文档生成提示词与流式输出处理分析
103 9:33p 🔵 文档生成时重复输出的原因调查
104 9:34p 🔴 修复技术文档生成时重复输出的问题
105 9:35p 🔴 优化技术文档提示词和模板，进一步避免重复输出
106 " 🔵 测试发现 getNovelSuffix() 方法重叠检测存在问题
107 " 🔴 修复 getNovelSuffix() 方法重叠检测问题
108 9:36p 🔴 优化 getNovelSuffix() 方法的重叠检测精度
109 " 🔴 技术文档生成时重复输出问题已完全修复
110 " 🔴 技术文档生成时重复输出问题的全面修复
111 9:37p 🔴 修复技术文档生成时重复输出的问题
112 9:38p ✅ 技术文档生成重复问题修复完成
113 " ✅ 修复文档生成重复问题的提交
114 " 🔴 技术文档生成重复问题修复已完成
115 " ✅ 源代码归档文件已传输到远程服务器
116 9:39p ✅ 开始部署修复后的项目到生产服务器
117 " ✅ 项目部署进展：依赖安装和数据库同步完成
118 9:40p ✅ 项目部署进展：前端正在构建中
119 " ✅ 前端构建进展：正在进行模块转换
120 " 🔴 技术文档生成重复问题修复部署完成
121 9:41p 🔴 技术文档生成重复问题修复验证完成
122 " 🔴 技术文档生成重复问题修复和部署总结
154 10:13p 🔴 前端文档重复生成问题
156 " 🔵 文档生成相关的Git变更
158 " 🔵 AI服务中文档去重逻辑分析
160 " 🔴 修复前端文档重复生成问题
162 10:14p 🔴 修复前端文档重复生成问题
164 " 🔴 修复前端文档重复生成问题并推送
165 10:15p ✅ 准备部署修复到远程服务器
167 " ✅ 执行远程部署脚本
169 " ✅ 部署过程正在进行中
170 " ✅ 前端构建进行中
171 " ✅ 部署完成
173 10:16p ✅ 部署验证完成
174 " ✅ 部署后状态检查
180 10:22p 🔵 检查文档生成逻辑一致性
184 " ✅ 同步最新变更到远程仓库
189 10:38p 🔵 项目结构探索：校园招聘系统
190 " 🟣 项目前后端服务启动
191 " 🟣 校园招聘系统前后端服务成功启动
S86 重启项目前后端 (Apr 26 at 10:38 PM)
192 10:40p 🔵 项目文档生成架构探索
193 10:41p 🔵 文档生成系统架构深入分析
S88 探索VibeCoding平台文档生成系统与启动项目服务 (Apr 26 at 10:41 PM)
**Investigated**: 项目前后端服务启动、文档生成系统架构、PRD生成机制、提示词管理

**Learned**: 1. 项目前后端服务成功启动：前端运行在http://127.0.0.1:5173/，后端运行在端口3001
    2. 文档生成系统采用严格的顺序依赖链：PRD → FRONTEND → BACKEND → API → TASK → CONTEXT_STATE → AGENTS
    3. PRD生成有领域特定模板，支持软件工程(SE)和大数据(BD)两个领域
    4. 文档验证系统可检查PRD与前端/后端文档的一致性
    5. 后端包含专门的提示词模板目录：backend/src/prompts/，包含11个不同的文档类型模板

**Completed**: 1. 成功启动前后端开发服务器
    2. 深入分析了文档生成系统架构
    3. 详细研究了PRD生成的系统提示词和结构模板
    4. 探索了后端的提示词管理和文档验证机制

**Next Steps**: 继续探索项目的其他功能模块，或对特定功能进行更深入的分析


Access 647k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
