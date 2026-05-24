<template>
  <div class="graduation-dashboard">
    <el-header class="dashboard-header" height="72px">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-box">
            <div class="logo-mini">VB</div>
            <div class="logo-text">
              <h1 class="platform-name">VibeCoding</h1>
              <span class="platform-tag">毕业设计</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <el-button plain @click="switchMode">
            <el-icon><Refresh /></el-icon>切换模式
          </el-button>
          <el-button type="success" @click="router.push('/graduation/topics')">
            <el-icon><Collection /></el-icon>选题管理
          </el-button>
          <el-divider direction="vertical" />
          <el-dropdown trigger="click">
            <div class="user-info-trigger">
              <el-avatar :size="36">{{ user?.name?.charAt(0) }}</el-avatar>
              <div class="user-meta">
                <span class="user-name">{{ user?.name }}</span>
                <span class="user-role">学生用户</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="passwordDialogVisible = true">
                  <el-icon><Key /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <main class="dashboard-main">
      <div v-if="loading" class="loading-state" v-loading="true" style="min-height: 400px" />

      <div v-else-if="!thesisProject" class="empty-state">
        <el-empty description="您还未选择毕业设计题目" :image-size="120">
          <el-button type="success" size="large" @click="router.push('/graduation/topics')">
            <el-icon><Plus /></el-icon>去选择题目
          </el-button>
        </el-empty>
      </div>

      <div v-else class="project-card">
        <div class="project-header">
          <div>
            <el-tag type="success" size="large">已选题</el-tag>
            <h2 class="project-title">{{ thesisProject.topic.title }}</h2>
          </div>
          <el-popconfirm
            title="放弃选题后，该题目将重新开放给其他同学。确定放弃吗？"
            confirm-button-text="确定放弃"
            cancel-button-text="取消"
            @confirm="handleRelease"
          >
            <template #reference>
              <el-button type="warning" plain :loading="releasing">放弃选题</el-button>
            </template>
          </el-popconfirm>
        </div>

        <el-descriptions :column="2" border class="project-descriptions">
          <el-descriptions-item label="数据集">{{ thesisProject.topic.datasetName }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ thesisProject.topic.category }}</el-descriptions-item>
          <el-descriptions-item label="数据集大小">{{ thesisProject.topic.datasetSize }}</el-descriptions-item>
          <el-descriptions-item label="选题时间">{{ formatDate(thesisProject.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="项目资料" :span="2">
            <div class="project-links">
              <el-link
                type="primary"
                @click="router.push(`/graduation/dataset?url=${encodeURIComponent(thesisProject.topic.datasetUrl)}`)"
              >
                查看数据集
              </el-link>
              <el-link type="primary" @click="openUrlDialog('repo')">
                {{ thesisProject.repoUrl ? '仓库地址' : '填写仓库地址' }}
              </el-link>
              <el-link type="primary" @click="openUrlDialog('deploy')">
                {{ thesisProject.deployUrl ? '项目部署地址' : '填写部署地址' }}
              </el-link>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <el-dialog
          v-model="urlDialogVisible"
          :title="urlDialogType === 'repo' ? '代码仓库地址' : '项目部署地址'"
          width="480px"
          @close="cancelUrlDialog"
        >
          <el-input
            v-model="urlDialogValue"
            :placeholder="urlDialogType === 'repo' ? '请填写 Gitee/GitHub 仓库地址' : '请填写项目运行演示地址'"
          />
          <template #footer>
            <el-button @click="cancelUrlDialog">取消</el-button>
            <el-button type="primary" :loading="savingUrl" @click="saveUrlDialog">保存</el-button>
          </template>
        </el-dialog>
      </div>
    </main>

    <SelfPasswordDialog v-model:visible="passwordDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Collection, ArrowDown, Key, SwitchButton, Plus, Refresh } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';
import { getMyThesisProject, releaseThesisTopic, updateThesisProject } from '@/api/thesis.api';
import type { ThesisProject } from '@/types/thesis';
import SelfPasswordDialog from '@/components/SelfPasswordDialog.vue';

const router = useRouter();
const authStore = useAuthStore();
const appModeStore = useAppModeStore();
const user = authStore.user;

const thesisProject = ref<ThesisProject | null>(null);
const loading = ref(false);
const releasing = ref(false);
const passwordDialogVisible = ref(false);
const urlDialogVisible = ref(false);
const urlDialogType = ref<'repo' | 'deploy'>('repo');
const urlDialogValue = ref('');
const savingUrl = ref(false);

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN');
}

function switchMode() {
  appModeStore.clearMode();
  router.push('/mode-select');
}

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  router.push('/login');
}

async function handleRelease() {
  releasing.value = true;
  try {
      await releaseThesisTopic();
    thesisProject.value = null;
    ElMessage.success('已放弃选题');
  } catch (err: any) {
    ElMessage.error(err?.message || '操作失败');
  } finally {
    releasing.value = false;
  }
}

function openUrlDialog(type: 'repo' | 'deploy') {
  urlDialogType.value = type;
  urlDialogValue.value = type === 'repo'
    ? (thesisProject.value?.repoUrl || '')
    : (thesisProject.value?.deployUrl || '');
  urlDialogVisible.value = true;
}

function cancelUrlDialog() {
  urlDialogVisible.value = false;
  urlDialogValue.value = '';
}

async function saveUrlDialog() {
  savingUrl.value = true;
  try {
    const payload = urlDialogType.value === 'repo'
      ? { repoUrl: urlDialogValue.value }
      : { deployUrl: urlDialogValue.value };
    thesisProject.value = await updateThesisProject(payload);
    urlDialogVisible.value = false;
    urlDialogValue.value = '';
    ElMessage.success('保存成功');
  } catch {
    ElMessage.error('保存失败');
  } finally {
    savingUrl.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    thesisProject.value = await getMyThesisProject();
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.graduation-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left { display: flex; align-items: center; }

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mini {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 800;
  font-size: 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.platform-tag {
  font-size: 12px;
  color: #10b981;
  display: block;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.dashboard-main {
  flex: 1;
  padding: 40px 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.project-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0 0;
}

.project-descriptions {
  margin-bottom: 0;
}

.project-links {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
