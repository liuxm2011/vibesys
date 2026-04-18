import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchProjectsApi, createProjectApi, deleteProjectApi } from '@/api/project.api';
import type { Project, ProjectStatus } from '@/types/project';

/**
 * Project Pinia store (TOPIC-04, DASH-01, DASH-02, D-08, D-09)
 * Manages project list state and project operations
 */
export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed: DASH-01 project count
  const projectCount = computed(() => projects.value.length);

  // Computed: D-08 max limit reached check
  const maxProjectsReached = computed(() => projects.value.length >= 10);

  // Computed: DASH-02 filter by status
  const notStartedProjects = computed(() =>
    projects.value.filter(p => p.status === 'NOT_STARTED')
  );

  const inProgressProjects = computed(() =>
    projects.value.filter(p => p.status === 'IN_PROGRESS')
  );

  const completedProjects = computed(() =>
    projects.value.filter(p => p.status === 'COMPLETED')
  );

  /**
   * Fetch user's projects (DASH-01)
   * @returns true on success, false on failure
   */
  async function fetchProjects(): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchProjectsApi();
      projects.value = response.projects;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取项目列表失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create project from topic (TOPIC-04, D-06)
   * @param topicId Topic ID to create project from
   * @returns true on success, false on failure
   */
  async function createProject(topicId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await createProjectApi(topicId);
      projects.value.unshift(response.project);  // Add to front (newest first)
      return true;
    } catch (e) {
      // Handle specific error messages from backend
      error.value = e instanceof Error ? e.message : '创建项目失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete project (D-09)
   * Note: Deleting project does NOT affect original topic
   * @param projectId Project ID to delete
   * @returns true on success, false on failure
   */
  async function deleteProject(projectId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await deleteProjectApi(projectId);
      // Remove from local state
      const index = projects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        projects.value.splice(index, 1);
      }
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除项目失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get status display text (DASH-02)
   * @param status Project status
   * @returns Chinese display text
   */
  function getStatusText(status: ProjectStatus): string {
    switch (status) {
      case 'NOT_STARTED':
        return '未开始';
      case 'IN_PROGRESS':
        return '进行中';
      case 'COMPLETED':
        return '已完成';
    }
  }

  /**
   * Get status tag type for Element Plus (DASH-02)
   * @param status Project status
   * @returns el-tag type value
   */
  function getStatusTagType(status: ProjectStatus): 'info' | 'warning' | 'success' {
    switch (status) {
      case 'NOT_STARTED':
        return 'info';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'success';
    }
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    projects.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    projects,
    loading,
    error,
    // Computed
    projectCount,
    maxProjectsReached,
    notStartedProjects,
    inProgressProjects,
    completedProjects,
    // Actions
    fetchProjects,
    createProject,
    deleteProject,
    getStatusText,
    getStatusTagType,
    $reset
  };
});