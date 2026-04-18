import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchTopicsApi, getTopicDetailApi, createCustomTopicApi } from '@/api/topic.api';
import type { Topic, Domain, CustomTopicInput } from '@/types/topic';

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

  // Computed: TOPIC-02 domain filtering
  const filteredTopics = computed(() => {
    if (!selectedDomain.value) {
      return topics.value;
    }
    return topics.value.filter(t => t.domain === selectedDomain.value);
  });

  // Computed: Separate system and custom topics
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
  }

  return {
    // State
    topics,
    currentTopic,
    loading,
    error,
    selectedDomain,
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
    clearCurrentTopic,
    $reset
  };
});