import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchTopicsApi, getTopicDetailApi, createCustomTopicApi } from '@/api/topic.api';
import type { Topic, Domain, CustomTopicInput, Platform } from '@/types/topic';

/**
 * Topic Pinia store (TOPIC-01, TOPIC-02, TOPIC-05)
 * Manages topic list state and domain filtering
 */
export const useTopicStore = defineStore('topic', () => {
  // State
  const topics = ref<Topic[]>([]);
  const currentTopic = ref<Topic | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedDomain = ref<Domain | null>(null);
  const selectedType = ref<'SYSTEM' | 'CUSTOM' | null>(null);
  const selectedPlatform = ref<Platform | null>(null);
  const searchQuery = ref('');

  // Computed: TOPIC-02 domain + type + platform + keyword filtering
  const filteredTopics = computed(() => {
    let result = topics.value;
    if (selectedDomain.value) {
      result = result.filter(t => t.domain === selectedDomain.value);
    }
    if (selectedType.value === 'SYSTEM') {
      result = result.filter(t => t.type === 'SYSTEM');
    } else if (selectedType.value === 'CUSTOM') {
      result = result.filter(t => t.type === 'CUSTOM');
    }
    if (selectedPlatform.value) {
      result = result.filter(t => t.platform === selectedPlatform.value);
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return result;
  });

  // Computed: Separate system and custom topics (kept for reference)
  const systemTopics = computed(() =>
    topics.value.filter(t => t.type === 'SYSTEM')
  );

  const customTopics = computed(() =>
    topics.value.filter(t => t.type === 'CUSTOM')
  );

  // Computed: Topic count
  const topicCount = computed(() => topics.value.length);

  /**
   * Fetch topics list (TOPIC-01)
   * @returns true on success, false on failure
   */
  async function fetchTopics(): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchTopicsApi();
      topics.value = response.topics;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取选题失败，请刷新页面重试';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get topic detail (TOPIC-03)
   * @param topicId Topic ID
   * @returns true on success, false on failure
   */
  async function getTopicDetail(topicId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await getTopicDetailApi(topicId);
      currentTopic.value = response.topic;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取选题详情失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create custom topic (TOPIC-05)
   * @param data Custom topic input
   * @returns true on success, false on failure
   */
  async function createCustomTopic(data: CustomTopicInput): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await createCustomTopicApi(data);
      topics.value.push(response.topic);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '提交选题失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Set domain filter (TOPIC-02)
   * @param domain Domain to filter ('SE', 'BD', or null for all)
   */
  function setDomainFilter(domain: Domain | null): void {
    selectedDomain.value = domain;
  }

  function setTypeFilter(type: 'SYSTEM' | 'CUSTOM' | null): void {
    selectedType.value = type;
  }

  function setPlatformFilter(platform: Platform | null): void {
    selectedPlatform.value = platform;
  }

  /**
   * Clear current topic detail
   */
  function clearCurrentTopic(): void {
    currentTopic.value = null;
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    topics.value = [];
    currentTopic.value = null;
    loading.value = false;
    error.value = null;
    selectedDomain.value = null;
    selectedType.value = null;
    selectedPlatform.value = null;
  }

  return {
    // State
    topics,
    currentTopic,
    loading,
    error,
    selectedDomain,
    selectedType,
    selectedPlatform,
    searchQuery,
    // Computed
    filteredTopics,
    systemTopics,
    customTopics,
    topicCount,
    // Actions
    fetchTopics,
    getTopicDetail,
    createCustomTopic,
    setDomainFilter,
    setTypeFilter,
    setPlatformFilter,
    clearCurrentTopic,
    $reset
  };
});