import { api } from '@/utils/request';
import type { ProjectsResponse, CreateProjectResponse, DeleteProjectResponse } from '@/types/project';

/**
 * Fetch user's projects list (DASH-01)
 * @returns Projects array with topic info
 */
export async function fetchProjectsApi(): Promise<ProjectsResponse> {
  return api.get<ProjectsResponse>('/api/projects');
}

/**
 * Create project from topic (TOPIC-04, D-06)
 * @param topicId Topic ID to create project from
 * @returns Created project with topic info
 */
export async function createProjectApi(topicId: number): Promise<CreateProjectResponse> {
  return api.post<CreateProjectResponse>('/api/projects', { topicId });
}

/**
 * Delete project (D-09)
 * @param projectId Project ID to delete
 * @returns Success message
 */
export async function deleteProjectApi(projectId: number): Promise<DeleteProjectResponse> {
  return api.delete<DeleteProjectResponse>(`/api/projects/${projectId}`);
}