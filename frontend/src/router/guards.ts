import { watch } from 'vue';
import type { Router, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getGraduationStatus } from '@/api/thesis.api';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';

/**
 * Setup navigation guards for authentication (D-19)
 * @param router Vue Router instance
 */
export function setupRouterGuards(router: Router): void {
  const authStore = useAuthStore();
  const appModeStore = useAppModeStore();

  watch(() => authStore.user, (newUser) => {
    if (!newUser && router.currentRoute.value.meta?.requiresAuth) {
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    }
  });

  router.beforeEach(async (to: RouteLocationNormalized, from): Promise<RouteLocationRaw | boolean | void | undefined> => {

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth ?? false;
    const requiresAdmin = to.meta.requiresAdmin ?? false;

    // Skip guard for public routes
    if (!requiresAuth) {
      return;
    }

    // Try to restore session on page refresh (AUTH-04)
    if (!authStore.user && !authStore.loading) {
      await authStore.fetchProfile();
    }

    // Check authentication status
    if (!authStore.isAuthenticated) {
      // Redirect to login with return path (D-19)
      return {
        name: 'Login',
        query: { redirect: to.fullPath }
      };
    }

    // Check admin-only routes
    if (requiresAdmin && !authStore.isAdmin) {
      // Non-admin trying to access admin route
      return { name: 'Dashboard' };
    }

    // Redirect admin away from dashboard to admin panel
    if (to.name === 'Dashboard' && authStore.isAdmin) {
      return { name: 'Admin' };
    }

    if (to.meta.appMode === 'graduation') {
      let message = '暂时无法确认毕业设计开放状态，请稍后重试。';
      try {
        const { access } = await getGraduationStatus();
        if (access === 'allowed') return;
        if (access === 'closed') message = '毕业设计尚未开放，请先使用项目设计。';
        if (access === 'ineligible') message = '毕业设计仅面向大数据专业学生开放。';
      } catch {
        if (!authStore.isAuthenticated) {
          return { name: 'Login', query: { redirect: to.fullPath } };
        }
      }

      ElMessage.warning(message);
      if (from.name === 'ModeSelect' || from.meta.appMode === 'project') return false;

      if (!authStore.isAdmin) appModeStore.setMode('project');
      return { name: 'Dashboard', replace: true };
    }

    // Students without a mode selected → redirect to mode selection
    if (!authStore.isAdmin && !to.meta.skipModeCheck) {
      if (!appModeStore.mode) {
        return { name: 'ModeSelect' };
      }
    }

    // All checks passed, proceed
    return;
  });

  router.afterEach((to, _from, failure) => {
    if (!failure && to.meta.appMode && !authStore.isAdmin) {
      appModeStore.setMode(to.meta.appMode);
    }
  });
}
