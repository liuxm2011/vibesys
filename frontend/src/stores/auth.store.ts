import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi, logoutApi, getProfileApi, type User } from '@/api/auth.api';

/**
 * Pinia auth store (D-18)
 * Manages authentication state throughout the application
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  // Actions

  /**
   * Login action
   * @param studentId Student ID
   * @param password Password
   * @returns true on success, false on failure
   */
  async function login(studentId: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await loginApi(studentId, password);
      user.value = response.user;
      return true;
    } catch (e) {
      // D-20: Unified error message
      error.value = e instanceof Error ? e.message : '登录失败，请检查账号密码';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout action (D-14, AUTH-03)
   * Clears cookie on backend and local state
   */
  async function logout(): Promise<void> {
    try {
      await logoutApi();
    } catch (e) {
      console.error('Logout API error:', e);
    }
    // Clear state regardless of API success
    user.value = null;
    error.value = null;
  }

  /**
   * Fetch profile on page refresh (AUTH-04)
   * Restores user state from cookie authentication
   * @returns true if user restored, false if not logged in
   */
  async function fetchProfile(): Promise<boolean> {
    loading.value = true;

    try {
      const profile = await getProfileApi();
      user.value = profile;
      return true;
    } catch (e) {
      // Not logged in or session expired
      user.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reset store state (D-14)
   */
  function $reset(): void {
    user.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    user,
    loading,
    error,
    // Computed
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    logout,
    fetchProfile,
    $reset
  };
});