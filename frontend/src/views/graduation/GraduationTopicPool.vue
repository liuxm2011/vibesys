<template>
  <div class="topic-pool">
    <div class="pool-header">
      <div class="header-left">
        <el-button text @click="router.push('/graduation')">
          <el-icon><ArrowLeft /></el-icon>返回看板
        </el-button>
        <h2 class="pool-title">毕业设计选题池</h2>
      </div>
      <div class="header-stats">
        <el-tag type="info">共 {{ topics.length }} 个题目</el-tag>
        <el-tag type="danger">已选 {{ lockedCount }} 个</el-tag>
        <el-tag type="success">剩余 {{ topics.length - lockedCount }} 个</el-tag>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="selectedCategory" placeholder="按分类筛选" clearable style="width: 240px">
        <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <el-input v-model="searchKeyword" placeholder="搜索题目或数据集名..." style="width: 300px" clearable>
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>

    <div v-if="myProject" class="my-selection-banner">
      <el-alert type="success" :closable="false">
        <template #default>
          <div class="banner-content">
            <span>您已选择：<strong>{{ myProject.topic.title }}</strong></span>
            <el-popconfirm
              title="放弃选题后，该题目将重新开放给其他同学。确定放弃吗？"
              confirm-button-text="确定放弃"
              cancel-button-text="取消"
              @confirm="handleRelease"
            >
              <template #reference>
                <el-button type="warning" size="small" :loading="releasing">放弃选题</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-alert>
    </div>

    <div v-loading="loading" class="topics-grid">
      <div
        v-for="topic in filteredTopics"
        :key="topic.id"
        class="topic-card"
        :class="{
          'topic-card--mine': topic.isLockedByMe,
          'topic-card--locked': topic.isLocked && !topic.isLockedByMe
        }"
      >
        <div class="topic-category-badge">{{ topic.category }}</div>
        <h3 class="topic-title">{{ topic.title }}</h3>
        <div class="topic-meta">
          <div class="meta-item">
            <span class="meta-label">数据集：</span>
            <span class="meta-value">{{ topic.datasetName }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">数据大小：</span>
            <span class="meta-value">{{ topic.datasetSize }}</span>
          </div>
        </div>
        <div class="topic-footer">
          <el-tag v-if="topic.isLockedByMe" type="success">已选择（我的）</el-tag>
          <el-tag v-else-if="topic.isLocked" type="danger">已被选择</el-tag>
          <el-tag v-else type="info">可选</el-tag>

          <div class="footer-actions">
            <el-button
              v-if="!topic.isLocked && !myProject"
              type="primary"
              size="small"
              :loading="selectingId === topic.id"
              @click="handleSelect(topic.id)"
            >
              选择此题
            </el-button>
            <el-button
              v-if="topic.datasetUrl"
              size="small"
              plain
              @click="openDataset(topic.datasetUrl)"
            >
              查看数据集
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-if="!loading && filteredTopics.length === 0" description="没有找到匹配的题目" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Search } from '@element-plus/icons-vue';
import { getThesisTopics, selectThesisTopic, releaseThesisTopic, getMyThesisProject } from '@/api/thesis.api';
import type { ThesisTopic, ThesisProject } from '@/types/thesis';

const router = useRouter();

const topics = ref<ThesisTopic[]>([]);
const myProject = ref<ThesisProject | null>(null);
const loading = ref(false);
const selectingId = ref<number | null>(null);
const releasing = ref(false);
const selectedCategory = ref('');
const searchKeyword = ref('');

const categories = computed(() =>
  [...new Set(topics.value.map(t => t.category))].sort()
);

const lockedCount = computed(() =>
  topics.value.filter(t => t.isLocked).length
);

const filteredTopics = computed(() => {
  return topics.value.filter(t => {
    if (selectedCategory.value && t.category !== selectedCategory.value) return false;
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase();
      return t.title.toLowerCase().includes(kw) || t.datasetName.toLowerCase().includes(kw);
    }
    return true;
  });
});

function openDataset(url: string) {
  router.push(`/graduation/dataset?url=${encodeURIComponent(url)}`);
}

async function loadData() {
  loading.value = true;
  try {
    [topics.value, myProject.value] = await Promise.all([
      getThesisTopics(),
      getMyThesisProject(),
    ]);
  } catch {
    ElMessage.error('加载选题数据失败，请刷新重试');
  } finally {
    loading.value = false;
  }
}

async function handleSelect(topicId: number) {
  selectingId.value = topicId;
  try {
    myProject.value = await selectThesisTopic(topicId);
    await loadData();
    ElMessage.success('选题成功！');
    router.push('/graduation');
  } catch (err: any) {
    ElMessage.error(err?.message || '选题失败，请重试');
  } finally {
    selectingId.value = null;
  }
}

async function handleRelease() {
  releasing.value = true;
  try {
    await releaseThesisTopic();
    myProject.value = null;
    await loadData();
    ElMessage.success('已放弃选题，题目已重新开放');
  } catch (err: any) {
    ElMessage.error(err?.message || '操作失败');
  } finally {
    releasing.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.topic-pool {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.pool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pool-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.my-selection-banner {
  margin-bottom: 20px;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.topic-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topic-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.topic-card--mine {
  border-color: #10b981;
  background: #f0fdf4;
}

.topic-card--locked {
  opacity: 0.65;
}

.topic-category-badge {
  display: inline-block;
  font-size: 11px;
  color: #4f46e5;
  background: #eef2ff;
  padding: 2px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.topic-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
}

.topic-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  display: flex;
  gap: 4px;
  font-size: 13px;
}

.meta-label {
  color: #94a3b8;
  white-space: nowrap;
}

.meta-value {
  color: #475569;
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.footer-actions {
  display: flex;
  gap: 6px;
}
</style>
