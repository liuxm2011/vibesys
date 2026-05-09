import { api } from '@/utils/request';

// Types matching backend responses
export interface User {
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  major: string;
  grade: string;
  class: string;
}

export interface LoginResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface StudentSystemConfig {
  announcement: string;
  guide: string;
  updatedAt: {
    announcement: string | null;
    guide: string | null;
  };
}

/**
 * Login API (D-02: studentId as account)
 * @param studentId Student ID (login account)
 * @param password Password (initial = studentId for new users)
 * @returns User info on success
 * @throws Error with unified message on failure (D-20)
 */
export async function loginApi(studentId: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>('/api/auth/login', { studentId, password });
}

/**
 * Logout API (AUTH-03)
 * Clears httpOnly cookie on backend
 * @returns Success message
 */
export async function logoutApi(): Promise<LogoutResponse> {
  return api.post<LogoutResponse>('/api/auth/logout', {});
}

/**
 * Get current user profile (AUTH-02)
 * Uses cookie for authentication
 * @returns User profile
 * @throws Error if not logged in
 */
export async function getProfileApi(): Promise<User> {
  return api.get<User>('/api/auth/profile');
}

export async function fetchStudentSystemConfigApi(): Promise<StudentSystemConfig> {
  return api.get<StudentSystemConfig>('/api/auth/system-config');
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  return api.put<ChangePasswordResponse>('/api/auth/password', {
    currentPassword,
    newPassword
  });
}
