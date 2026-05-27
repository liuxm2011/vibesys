import { api } from '@/utils/request';

export interface UserApiSettingResponse {
  exists: boolean;
  setting: {
    id: number;
    baseURL: string;
    apiKey: string;
    model: string;
    hasRealKey: boolean;
    updatedAt: string;
  } | null;
}

export interface SaveApiSettingRequest {
  baseURL?: string;
  apiKey?: string;
  model?: string;
}

export interface SaveApiSettingResponse {
  message: string;
  setting: {
    id: number;
    baseURL: string;
    model: string;
    updatedAt: string;
  };
}

export interface TestConnectionRequest {
  baseURL: string;
  apiKey: string;
  model: string;
}

export interface TestConnectionResponse {
  success: boolean;
  latencyMs: number;
  message: string;
  response?: string;
}

export async function fetchUserApiSettingApi(): Promise<UserApiSettingResponse> {
  return api.get('/api/user/api-setting');
}

export async function saveUserApiSettingApi(data: SaveApiSettingRequest): Promise<SaveApiSettingResponse> {
  return api.put('/api/user/api-setting', data);
}

export async function testUserApiSettingApi(data: TestConnectionRequest): Promise<TestConnectionResponse> {
  return api.post('/api/user/api-setting/test', data);
}

export async function deleteUserApiSettingApi(): Promise<{ message: string }> {
  return api.delete('/api/user/api-setting');
}
