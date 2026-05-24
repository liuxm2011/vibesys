// frontend/src/api/thesis.api.ts
import { request } from '@/utils/request';
import type { ThesisTopic, ThesisProject } from '@/types/thesis';

export async function getThesisTopics(): Promise<ThesisTopic[]> {
  const data = await request<{ topics: ThesisTopic[] }>('/api/thesis/topics');
  return data.topics;
}

export async function getMyThesisProject(): Promise<ThesisProject | null> {
  const data = await request<{ project: ThesisProject | null }>('/api/thesis/project');
  return data.project;
}

export async function selectThesisTopic(topicId: number): Promise<ThesisProject> {
  const data = await request<{ project: ThesisProject }>('/api/thesis/select', {
    method: 'POST',
    body: { topicId },
  });
  return data.project;
}

export async function releaseThesisTopic(): Promise<void> {
  await request('/api/thesis/release', { method: 'DELETE' });
}

export async function updateThesisProject(data: { repoUrl?: string; deployUrl?: string }): Promise<ThesisProject> {
  const result = await request<{ project: ThesisProject }>('/api/thesis/project', {
    method: 'PUT',
    body: data,
  });
  return result.project;
}

export async function getGraduationStatus(): Promise<{ enabled: boolean }> {
  return request<{ enabled: boolean }>('/api/thesis/status');
}
