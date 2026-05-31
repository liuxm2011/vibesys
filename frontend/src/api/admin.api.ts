import { saveAs } from 'file-saver';
import { api, resolveApiUrl } from '@/utils/request';
import type {
  UserListResponse,
  TopicListResponse,
  OverviewStats,
  UserStats,
  ProjectStats,
  SystemConfig,
  ImportResult,
  CreateStudentRequest,
  CreateStudentResponse,
  UserPasswordInfo,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
  AiUsageStats,
  ApiProvider,
  ApiProviderForm,
  TestConnectionResult,
  ActiveProviderInfo
} from '@/types/admin';
import type { ProjectRepoInfo } from '@/types/project';

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function fetchAdminUsersApi(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  major?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  grade?: string;
}): Promise<UserListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', String(params.page));
  if (params.pageSize) query.append('pageSize', String(params.pageSize));
  if (params.search) query.append('search', params.search);
  if (params.role) query.append('role', params.role);
  if (params.major) query.append('major', params.major);
  if (params.status) query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  if (params.grade) query.append('grade', params.grade);

  return api.get<UserListResponse>(`/api/admin/users?${query.toString()}`);
}

export async function updateUserStatusApi(
  userId: number,
  status: 'ACTIVE' | 'BANNED'
): Promise<{ message: string; user: { id: number; status: string; name: string } }> {
  return api.put(`/api/admin/users/${userId}/status`, { status });
}

export async function createStudentApi(data: CreateStudentRequest): Promise<CreateStudentResponse> {
  return api.post('/api/admin/users', data);
}

export async function fetchUserPasswordInfoApi(userId: number): Promise<UserPasswordInfo> {
  return api.get(`/api/admin/users/${userId}/password`);
}

export async function updateUserPasswordApi(
  userId: number,
  data: UpdateUserPasswordRequest
): Promise<UpdateUserPasswordResponse> {
  return api.put(`/api/admin/users/${userId}/password`, data);
}

export async function importStudentsApi(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(resolveApiUrl('/api/admin/users/import'), {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '导入失败'));
  }

  return response.json();
}

export async function downloadStudentTemplateApi(): Promise<void> {
  const response = await fetch(resolveApiUrl('/api/admin/users/template'), {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '下载模板失败'));
  }

  const blob = await response.blob();
  saveAs(blob, getFilenameFromResponse(response, '学生导入模板.xlsx'));
}

// ============================================================
// TOPIC MANAGEMENT
// ============================================================

export async function fetchAdminTopicsApi(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  domain?: string;
  type?: string;
}): Promise<TopicListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', String(params.page));
  if (params.pageSize) query.append('pageSize', String(params.pageSize));
  if (params.search) query.append('search', params.search);
  if (params.domain) query.append('domain', params.domain);
  if (params.type) query.append('type', params.type);

  return api.get<TopicListResponse>(`/api/admin/topics?${query.toString()}`);
}

export async function createAdminTopicApi(data: {
  title: string;
  description: string;
  background?: string;
  objectives?: string;
  domain: 'SE' | 'BD';
  techStack?: string[];
}): Promise<{ topic: any }> {
  return api.post('/api/admin/topics', data);
}

export async function updateAdminTopicApi(
  topicId: number,
  data: {
    title: string;
    description: string;
    background?: string;
    objectives?: string;
    domain: 'SE' | 'BD';
    techStack?: string[];
  }
): Promise<{ topic: any }> {
  return api.put(`/api/admin/topics/${topicId}`, data);
}

export async function deleteAdminTopicApi(topicId: number): Promise<{ message: string }> {
  return api.delete(`/api/admin/topics/${topicId}`);
}

export async function importTopicsApi(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(resolveApiUrl('/api/admin/topics/import'), {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '导入失败'));
  }

  return response.json();
}

export function downloadTemplateApi(): void {
  window.open(resolveApiUrl('/api/admin/topics/template'), '_blank');
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      const error = await response.json();
      return error.error || fallback;
    } catch {
      return fallback;
    }
  }

  try {
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

function getFilenameFromResponse(response: Response, fallback: string): string {
  const disposition = response.headers.get('content-disposition') || '';
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = disposition.match(/filename="?([^"]+)"?/i);
  return basicMatch?.[1] || fallback;
}

// ============================================================
// STATISTICS
// ============================================================

export async function fetchOverviewStatsApi(): Promise<OverviewStats> {
  return api.get('/api/admin/stats/overview');
}

export async function fetchUserStatsApi(): Promise<UserStats> {
  return api.get('/api/admin/stats/users');
}

export async function fetchProjectStatsApi(): Promise<ProjectStats> {
  return api.get('/api/admin/stats/projects');
}

export async function fetchAiUsageStatsApi(): Promise<AiUsageStats> {
  return api.get('/api/admin/stats/ai-usage');
}

// ============================================================
// SYSTEM CONFIG
// ============================================================

export async function fetchAnnouncementApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/announcement');
}

export async function updateAnnouncementApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/announcement', { value });
}

export async function fetchGuideApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/guide');
}

export async function updateGuideApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/guide', { value });
}

// ============================================================
// GRADUATION CONFIG
// ============================================================

export async function fetchGraduationEnabledApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/graduationEnabled');
}

export async function updateGraduationEnabledApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/graduationEnabled', { value });
}

export async function fetchGraduationWhitelistApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/graduationWhitelist');
}

export async function updateGraduationWhitelistApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/graduationWhitelist', { value });
}

// ============================================================
// API PROVIDER MANAGEMENT
// ============================================================

export async function fetchApiProvidersApi(): Promise<{ providers: ApiProvider[] }> {
  return api.get('/api/admin/api-providers');
}

export async function createApiProviderApi(data: ApiProviderForm): Promise<{ provider: ApiProvider; message: string }> {
  return api.post('/api/admin/api-providers', data);
}

export async function updateApiProviderApi(id: number, data: Partial<ApiProviderForm>): Promise<{ provider: ApiProvider; message: string }> {
  return api.put(`/api/admin/api-providers/${id}`, data);
}

export async function deleteApiProviderApi(id: number): Promise<{ message: string }> {
  return api.delete(`/api/admin/api-providers/${id}`);
}

export async function activateApiProviderApi(id: number): Promise<{ provider: ApiProvider; message: string }> {
  return api.post(`/api/admin/api-providers/${id}/activate`, {});
}

export async function testApiProviderApi(id: number): Promise<TestConnectionResult> {
  return api.post(`/api/admin/api-providers/${id}/test`, {});
}

export async function fetchActiveApiProviderApi(): Promise<{ active: ActiveProviderInfo }> {
  return api.get('/api/admin/api-providers/active');
}

// ============================================================
// PROJECT REPO MANAGEMENT
// ============================================================

export interface ProjectRepoFilters {
  hasDeployUrl?: boolean;
  major?: string;
  class?: string;
  featured?: boolean;
  grade?: string;
}

function buildRepoFilterQuery(filters: ProjectRepoFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.hasDeployUrl !== undefined) params.set('hasDeployUrl', String(filters.hasDeployUrl));
  if (filters.major) params.set('major', filters.major);
  if (filters.class) params.set('class', filters.class);
  if (filters.featured) params.set('featured', 'true');
  if (filters.grade) params.set('grade', filters.grade);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchProjectReposApi(
  filters: ProjectRepoFilters = {}
): Promise<{ repos: ProjectRepoInfo[] }> {
  return api.get(`/api/admin/projects/repos${buildRepoFilterQuery(filters)}`);
}

export async function adminUpdateDeployUrlApi(
  projectId: number,
  deployUrl: string | null
): Promise<{ message: string }> {
  return api.put(`/api/admin/projects/${projectId}/deployUrl`, { deployUrl });
}

export async function adminUpdateFeaturedApi(
  projectId: number,
  featured: boolean
): Promise<{ message: string }> {
  return api.put(`/api/admin/projects/${projectId}/featured`, { featured });
}

export async function exportProjectReposApi(filters: ProjectRepoFilters = {}): Promise<void> {
  const response = await fetch(resolveApiUrl(`/api/admin/projects/repos/export${buildRepoFilterQuery(filters)}`), {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '导出失败'));
  }

  const blob = await response.blob();
  saveAs(blob, getFilenameFromResponse(response, '项目仓库地址.xlsx'));
}

// ============================================================
// GRADUATION / THESIS MANAGEMENT
// ============================================================

export async function adminGetThesisTopics(): Promise<any[]> {
  const data = await api.get<{ topics: any[] }>('/api/admin/thesis/topics');
  return data.topics;
}

export async function adminGetThesisProjects(params: { page?: number; pageSize?: number; search?: string } = {}): Promise<{ projects: any[]; total: number; page: number; pageSize: number }> {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.pageSize) q.set('pageSize', String(params.pageSize));
  if (params.search) q.set('search', params.search);
  return api.get<{ projects: any[]; total: number; page: number; pageSize: number }>(`/api/admin/thesis/projects?${q}`);
}

// ============================================================
// GRADE ARCHIVING（按年级归档）
// ============================================================

export interface ArchivedGrade {
  id: number;
  grade: string;
  archivedByUserId: number | null;
  studentCount: number;
  projectCount: number;
  thesisCount: number;
  archivedAt: string;
}

export interface ActiveGradeOption {
  grade: string;
  studentCount: number;
}

export interface ArchivedThesis {
  id: number;
  grade: string;
  studentId: string;
  studentName: string;
  className: string;
  topicTitle: string;
  topicCategory: string;
  datasetName: string;
  repoUrl: string | null;
  deployUrl: string | null;
  originalCreatedAt: string;
  archivedAt: string;
}

export async function fetchArchivedGradesApi(): Promise<{ grades: ArchivedGrade[] }> {
  return api.get('/api/admin/archive');
}

export async function fetchActiveGradesApi(): Promise<{ grades: ActiveGradeOption[] }> {
  return api.get('/api/admin/archive/active-grades');
}

export async function archiveGradeApi(grade: string): Promise<{
  message: string; grade: string; studentCount: number; projectCount: number; thesisCount: number;
}> {
  return api.post('/api/admin/archive', { grade });
}

export async function unarchiveGradeApi(grade: string): Promise<{ message: string }> {
  return api.delete(`/api/admin/archive/${encodeURIComponent(grade)}`);
}

export async function fetchArchivedThesisApi(
  grade: string,
  search = ''
): Promise<{ projects: ArchivedThesis[]; total: number }> {
  const q = new URLSearchParams();
  if (search) q.set('search', search);
  return api.get(`/api/admin/archive/${encodeURIComponent(grade)}/thesis?${q}`);
}
