import { api } from '@/utils/request';
import type { TopicsResponse, TopicDetailResponse, CustomTopicInput, CreateCustomTopicResponse, Domain } from '@/types/topic';

/**
 * Fetch topics list (TOPIC-01)
 * Optional domain filter (TOPIC-02)
 * @param domain Optional domain filter ('SE' or 'BD')
 * @returns Topics array
 */
export async function fetchTopicsApi(domain?: Domain): Promise<TopicsResponse> {
  const url = domain ? `/api/topics?domain=${domain}` : '/api/topics';
  return api.get<TopicsResponse>(url);
}

/**
 * Get topic detail (TOPIC-03)
 * @param topicId Topic ID
 * @returns Topic detail
 */
export async function getTopicDetailApi(topicId: number): Promise<TopicDetailResponse> {
  return api.get<TopicDetailResponse>(`/api/topics/${topicId}`);
}

/**
 * Create custom topic (TOPIC-05)
 * @param data Custom topic input data
 * @returns Created topic
 */
export async function createCustomTopicApi(data: CustomTopicInput): Promise<CreateCustomTopicResponse> {
  return api.post<CreateCustomTopicResponse>('/api/topics/custom', data);
}