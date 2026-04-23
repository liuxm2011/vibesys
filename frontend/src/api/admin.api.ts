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
  AiUsageStats
} from '@/types/admin';

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function fetchAdminUsersApi(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<UserListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', String(params.page));
  if (params.pageSize) query.append('pageSize', String(params.pageSize));
  if (params.search) query.append('search', params.search);
  if (params.role) query.append('role', params.role);
  if (params.status) query.append('status', params.status);

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
