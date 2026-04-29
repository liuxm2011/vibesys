export interface AdminUser {
  id: number;
  studentId: string;
  name: string;
  major: string;
  grade: string;
  class: string;
  role: 'STUDENT' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  projectCount: number;
  createdAt: string;
  passwordStatus: 'DEFAULT' | 'CUSTOM';
  passwordHint: string;
  revealedPassword: string | null;
  canRevealPassword: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserListResponse {
  users: AdminUser[];
  pagination: PaginationInfo;
}

// ============================================================
// STUDENT IMPORT & CREATION
// ============================================================

export interface StudentImportRow {
  studentId: string;
  name: string;
  class?: string;
}

export interface CreateStudentRequest {
  studentId: string;
  name: string;
  class?: string;
}

export interface CreateStudentResponse {
  user: {
    id: number;
    studentId: string;
    name: string;
    major: string;
    grade: string;
    class: string;
    role: 'STUDENT' | 'ADMIN';
    status: 'ACTIVE' | 'BANNED';
    createdAt: string;
  };
  initialPassword: string;
}

export interface UserPasswordInfo {
  userId: number;
  name: string;
  passwordStatus: 'DEFAULT' | 'CUSTOM';
  passwordHint: string;
  revealedPassword: string | null;
  canRevealPassword: boolean;
}

export interface UpdateUserPasswordRequest {
  action: 'RESET_TO_DEFAULT' | 'SET_CUSTOM';
  newPassword?: string;
}

export interface UpdateUserPasswordResponse {
  message: string;
  userId: number;
  passwordStatus: 'DEFAULT' | 'CUSTOM';
  passwordHint: string;
  revealedPassword: string;
}

export interface AdminTopic {
  id: number;
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: 'SE' | 'BD';
  platform: 'WEB' | 'IOS' | 'ANDROID' | 'WECHAT_MINI' | 'WINDOWS_DESKTOP' | 'MAC_DESKTOP';
  techStack: string[];
  type: 'SYSTEM' | 'CUSTOM';
  creatorId?: number | null;
  createdAt: string;
  _count?: { projects: number };
}

export interface TopicListResponse {
  topics: AdminTopic[];
  pagination: PaginationInfo;
}

export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalTopics: number;
  systemTopics: number;
  customTopics: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  notStartedProjects: number;
  totalDocuments: number;
}

export interface UserStats {
  byMajor: { major: string; count: number }[];
  byGrade: { grade: string; count: number }[];
  recentRegistrations: { date: string; count: number }[];
}

export interface ProjectStats {
  byDomain: { domain: string; count: number }[];
  byStatus: { status: string; count: number }[];
  avgProjectsPerUser: number;
}

export interface SystemConfig {
  key: 'announcement' | 'guide';
  value: string;
  updatedAt: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: { row: number; reason: string }[];
  defaultPasswordRule?: string;
}

// ============================================================
// AI USAGE STATISTICS
// ============================================================

export interface AiUsageOverview {
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  successRequests: number;
  errorRequests: number;
  timeoutRequests: number;
}

export interface AiUserUsage {
  userId: number;
  name: string;
  studentId: string;
  requestCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AiDocTypeUsage {
  docType: string;
  requestCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AiOperationUsage {
  operation: string;
  requestCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AiDailyTrend {
  date: string;
  requestCount: number;
  totalTokens: number;
  successCount: number;
  errorCount: number;
  timeoutCount: number;
}

export interface AiFailedRequest {
  id: number;
  userId: number;
  name: string;
  studentId: string;
  projectId: number | null;
  docType: string | null;
  operation: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

// ============================================================
// API PROVIDER MANAGEMENT
// ============================================================

export interface ApiProvider {
  id: number;
  name: string;
  providerType: 'minimax' | 'openai_compatible';
  baseURL: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  orderIndex: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProviderForm {
  name: string;
  providerType: 'minimax' | 'openai_compatible';
  baseURL: string;
  apiKey: string;
  model: string;
  description?: string;
  isActive?: boolean;
}

export interface TestConnectionResult {
  success: boolean;
  latencyMs: number;
  message: string;
}

export interface ActiveProviderInfo {
  name: string;
  providerType: string;
  model: string;
  baseURL: string;
  fromDatabase: boolean;
}

export interface AiUsageStats {
  overview: AiUsageOverview;
  userUsage: AiUserUsage[];
  docTypeUsage: AiDocTypeUsage[];
  operationUsage: AiOperationUsage[];
  dailyTrends: AiDailyTrend[];
  recentFailedRequests: AiFailedRequest[];
}
