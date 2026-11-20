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
      <el-tab-pane label="毕业设计日历" name="graduationCalendars" lazy>
        <div class="config-panel">
          <p>按届别维护各阶段日期及检测阈值。日期用 YYYY-MM-DD，检测阈值用百分数。新增届别时可复制现有届别的字段。</p>
          <el-input v-model="calendarText" type="textarea" :rows="21" maxlength="20000" aria-label="毕业设计届别日历" />
          <div class="config-actions">
            <el-button @click="loadCalendars">重新加载</el-button>
            <el-button type="primary" :loading="saving" @click="saveCalendars">保存毕业设计日历</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { fetchGraduationCalendarsApi, updateGraduationCalendarsApi } from '@/api/admin.api';
import { useAdminStore } from '@/stores/admin.store';
import { ElMessage } from 'element-plus';

const store = useAdminStore();
const activeTab = ref('announcement');
const announcementText = ref('');
const guideText = ref('');
const saving = ref(false);
const calendarText = ref('');

async function loadCalendars() {
  try {
    const config = await fetchGraduationCalendarsApi();
    calendarText.value = JSON.stringify(JSON.parse(config.value), null, 2);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '加载毕业设计日历失败');
  }
}

async function saveCalendars() {
  saving.value = true;
  try {
    await updateGraduationCalendarsApi(calendarText.value);
    ElMessage.success('毕业设计日历已保存');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '保存毕业设计日历失败');
  } finally {
    saving.value = false;
  }
}

watch(activeTab, tab => {
  if (tab === 'graduationCalendars' && !calendarText.value) void loadCalendars();
});

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
