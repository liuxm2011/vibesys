import { api } from '@/utils/request';
import type {
  ProjectsResponse,
  CreateProjectResponse,
  DeleteProjectResponse,
  UpdateTechStackResponse,
  ProjectDetail,
  RepoInfoResponse,
  SyncRepoResponse
} from '@/types/project';

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

/**
 * Fetch project detail by ID (Export-03)
 * @param projectId Project ID to fetch detail for
 * @returns Project detail with topic info
 */
export async function fetchProjectDetailApi(projectId: number): Promise<{ project: ProjectDetail }> {
  return api.get(`/api/projects/${projectId}`);
}

/**
 * Update project tech stack (DOC-07)
 * @param projectId Project ID
 * @param techStack New tech stack string
 * @returns Updated project with tech stack
 */
export async function updateProjectTechStackApi(
  projectId: number,
  techStack: string
): Promise<UpdateTechStackResponse> {
  return api.put<UpdateTechStackResponse>(`/api/projects/${projectId}/techStack`, { techStack });
}

export async function updateProjectRepoUrlApi(
  projectId: number,
  repoUrl: string | null
): Promise<{ message: string }> {
  return api.put(`/api/projects/${projectId}/repoUrl`, { repoUrl });
}

export async function syncRepoApi(
  projectId: number
): Promise<SyncRepoResponse> {
  return api.post<SyncRepoResponse>(`/api/projects/${projectId}/syncRepo`, {});
}

export async function fetchRepoInfoApi(
  projectId: number
): Promise<RepoInfoResponse> {
  return api.get<RepoInfoResponse>(`/api/projects/${projectId}/repoInfo`);
}
