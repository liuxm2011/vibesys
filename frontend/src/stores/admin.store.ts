import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as adminApi from '@/api/admin.api';
import type {
  AdminUser,
  AdminTopic,
  OverviewStats,
  UserStats,
  ProjectStats,
  SystemConfig,
  PaginationInfo,
  CreateStudentRequest,
  ImportResult,
  UserPasswordInfo,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
  AiUsageStats
} from '@/types/admin';

export const useAdminStore = defineStore('admin', () => {
  // User management state
  const users = ref<AdminUser[]>([]);
  const userPagination = ref<PaginationInfo>({ total: 0, page: 1, pageSize: 20, totalPages: 0 });
  const userMajors = ref<string[]>([]);
  const usersLoading = ref(false);

  // Topic management state
  const topics = ref<AdminTopic[]>([]);
  const topicPagination = ref<PaginationInfo>({ total: 0, page: 1, pageSize: 20, totalPages: 0 });
  const topicsLoading = ref(false);

  // Statistics state
  const overviewStats = ref<OverviewStats | null>(null);
  const userStats = ref<UserStats | null>(null);
  const projectStats = ref<ProjectStats | null>(null);
  const aiUsageStats = ref<AiUsageStats | null>(null);
  const statsLoading = ref(false);

  // System config state
  const announcement = ref<SystemConfig | null>(null);
  const guide = ref<SystemConfig | null>(null);
  const configLoading = ref(false);

  // Common error state
  const error = ref<string | null>(null);

  // --- User Management ---
  async function loadUsers(params: { page?: number; pageSize?: number; search?: string; role?: string; major?: string; status?: string } = {}) {
    usersLoading.value = true;
    error.value = null;
    try {
      const response = await adminApi.fetchAdminUsersApi(params);
      users.value = response.users;
      userMajors.value = response.majors;
      userPagination.value = response.pagination;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载用户列表失败';
    } finally {
      usersLoading.value = false;
    }
  }

  async function updateUserStatus(userId: number, status: 'ACTIVE' | 'BANNED') {
    error.value = null;
    try {
      await adminApi.updateUserStatusApi(userId, status);
      await loadUsers({ page: userPagination.value.page, pageSize: userPagination.value.pageSize });
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新用户状态失败';
      throw e;
    }
  }

  async function createStudent(data: CreateStudentRequest) {
    error.value = null;
    try {
      const response = await adminApi.createStudentApi(data);
      await loadUsers({ page: 1, pageSize: userPagination.value.pageSize });
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建学生失败';
      throw e;
    }
  }

  async function importStudents(file: File): Promise<ImportResult> {
    error.value = null;
    try {
      const result = await adminApi.importStudentsApi(file);
      await loadUsers({ page: 1, pageSize: userPagination.value.pageSize });
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '导入学生失败';
      throw e;
    }
  }

  async function getUserPasswordInfo(userId: number): Promise<UserPasswordInfo> {
    error.value = null;
    try {
      return await adminApi.fetchUserPasswordInfoApi(userId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取密码信息失败';
      throw e;
    }
  }

  async function updateUserPassword(
    userId: number,
    data: UpdateUserPasswordRequest
  ): Promise<UpdateUserPasswordResponse> {
    error.value = null;
    try {
      const response = await adminApi.updateUserPasswordApi(userId, data);
      await loadUsers({ page: userPagination.value.page, pageSize: userPagination.value.pageSize });
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新密码失败';
      throw e;
    }
  }

  // --- Topic Management ---
  async function loadTopics(params: { page?: number; pageSize?: number; search?: string; domain?: string; type?: string; platform?: string } = {}) {
    topicsLoading.value = true;
    error.value = null;
    try {
      const response = await adminApi.fetchAdminTopicsApi(params);
      topics.value = response.topics;
      topicPagination.value = response.pagination;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载选题列表失败';
    } finally {
      topicsLoading.value = false;
    }
  }

  async function createTopic(data: { title: string; description: string; background?: string; objectives?: string; domain: 'SE' | 'BD'; techStack?: string[] }) {
    error.value = null;
    try {
      await adminApi.createAdminTopicApi(data);
      await loadTopics({ page: topicPagination.value.page, pageSize: topicPagination.value.pageSize });
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建选题失败';
      throw e;
    }
  }

  async function updateTopic(topicId: number, data: { title: string; description: string; background?: string; objectives?: string; domain: 'SE' | 'BD'; techStack?: string[] }) {
    error.value = null;
    try {
      await adminApi.updateAdminTopicApi(topicId, data);
      await loadTopics({ page: topicPagination.value.page, pageSize: topicPagination.value.pageSize });
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新选题失败';
      throw e;
    }
  }

  async function deleteTopic(topicId: number) {
    error.value = null;
    try {
      await adminApi.deleteAdminTopicApi(topicId);
      await loadTopics({ page: topicPagination.value.page, pageSize: topicPagination.value.pageSize });
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除选题失败';
      throw e;
    }
  }

  async function importTopics(file: File) {
    error.value = null;
    try {
      const result = await adminApi.importTopicsApi(file);
      await loadTopics({ page: 1, pageSize: topicPagination.value.pageSize });
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '导入选题失败';
      throw e;
    }
  }

  // --- Statistics ---
  async function loadOverviewStats() {
    statsLoading.value = true;
    error.value = null;
    try {
      overviewStats.value = await adminApi.fetchOverviewStatsApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载统计数据失败';
    } finally {
      statsLoading.value = false;
    }
  }

  async function loadUserStats() {
    statsLoading.value = true;
    error.value = null;
    try {
      userStats.value = await adminApi.fetchUserStatsApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载用户统计失败';
    } finally {
      statsLoading.value = false;
    }
  }

  async function loadProjectStats() {
    statsLoading.value = true;
    error.value = null;
    try {
      projectStats.value = await adminApi.fetchProjectStatsApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载项目统计失败';
    } finally {
      statsLoading.value = false;
    }
  }

  async function loadAiUsageStats() {
    statsLoading.value = true;
    error.value = null;
    try {
      aiUsageStats.value = await adminApi.fetchAiUsageStatsApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载AI用量统计失败';
    } finally {
      statsLoading.value = false;
    }
  }

  // --- System Config ---
  async function loadAnnouncement() {
    configLoading.value = true;
    error.value = null;
    try {
      announcement.value = await adminApi.fetchAnnouncementApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载公告配置失败';
    } finally {
      configLoading.value = false;
    }
  }

  async function saveAnnouncement(value: string) {
    error.value = null;
    try {
      announcement.value = await adminApi.updateAnnouncementApi(value);
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存公告失败';
      throw e;
    }
  }

  async function loadGuide() {
    configLoading.value = true;
    error.value = null;
    try {
      guide.value = await adminApi.fetchGuideApi();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载指南配置失败';
    } finally {
      configLoading.value = false;
    }
  }

  async function saveGuide(value: string) {
    error.value = null;
    try {
      guide.value = await adminApi.updateGuideApi(value);
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存指南失败';
      throw e;
    }
  }

  // Reset
  function $reset() {
    users.value = [];
    userMajors.value = [];
    topics.value = [];
    overviewStats.value = null;
    userStats.value = null;
    projectStats.value = null;
    aiUsageStats.value = null;
    announcement.value = null;
    guide.value = null;
    error.value = null;
  }

  return {
    users, userPagination, userMajors, usersLoading,
    topics, topicPagination, topicsLoading,
    overviewStats, userStats, projectStats, aiUsageStats, statsLoading,
    announcement, guide, configLoading,
    error,
    loadUsers, updateUserStatus, createStudent, importStudents, getUserPasswordInfo, updateUserPassword,
    loadTopics, createTopic, updateTopic, deleteTopic, importTopics,
    loadOverviewStats, loadUserStats, loadProjectStats, loadAiUsageStats,
    loadAnnouncement, saveAnnouncement, loadGuide, saveGuide,
    $reset
  };
});
