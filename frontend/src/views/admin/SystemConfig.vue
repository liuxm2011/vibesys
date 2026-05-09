<template>
  <div class="system-config">
    <div class="page-header">
      <h2>系统配置</h2>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- Announcement Tab -->
      <el-tab-pane label="平台公告" name="announcement">
        <div class="config-panel">
          <el-input
            v-model="announcementText"
            type="textarea"
            :rows="12"
            placeholder="输入平台公告内容..."
            maxlength="5000"
            show-word-limit
          />
          <div class="config-actions">
            <el-button @click="loadAnnouncement">重新加载</el-button>
            <el-button type="primary" @click="saveAnnouncement" :loading="saving">保存公告</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- Guide Tab -->
      <el-tab-pane label="使用指南" name="guide">
        <div class="config-panel">
          <el-input
            v-model="guideText"
            type="textarea"
            :rows="12"
            placeholder="输入使用指南内容..."
            maxlength="10000"
            show-word-limit
          />
          <div class="config-actions">
            <el-button @click="loadGuideConfig">重新加载</el-button>
            <el-button type="primary" @click="saveGuide" :loading="saving">保存指南</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { ElMessage } from 'element-plus';

const store = useAdminStore();
const activeTab = ref('announcement');
const announcementText = ref('');
const guideText = ref('');
const saving = ref(false);

async function loadAnnouncement() {
  await store.loadAnnouncement();
  announcementText.value = store.announcement?.value || '';
}

async function loadGuideConfig() {
  await store.loadGuide();
  guideText.value = store.guide?.value || '';
}

async function saveAnnouncement() {
  saving.value = true;
  try {
    await store.saveAnnouncement(announcementText.value);
    ElMessage.success('公告已保存');
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败');
  } finally {
    saving.value = false;
  }
}

async function saveGuide() {
  saving.value = true;
  try {
    await store.saveGuide(guideText.value);
    ElMessage.success('指南已保存');
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadAnnouncement();
  loadGuideConfig();
});
</script>

<style scoped>
.system-config {
  background: white;
  border-radius: var(--radius-md);
  padding: 24px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-main);
}

.config-panel {
  padding: 16px 0;
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
