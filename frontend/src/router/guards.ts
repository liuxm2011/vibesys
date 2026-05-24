import { watch } from 'vue';
import type { Router, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';

/**
 * Setup navigation guards for authentication (D-19)
 * @param router Vue Router instance
 */
export function setupRouterGuards(router: Router): void {
  const authStore = useAuthStore();

  watch(() => authStore.user, (newUser) => {
    if (!newUser && router.currentRoute.value.meta?.requiresAuth) {
      router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    }
  });

  router.beforeEach(async (to: RouteLocationNormalized): Promise<RouteLocationRaw | boolean | void | undefined> => {

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

    // Non-admin students without a mode selected → redirect to mode selection
    if (!authStore.isAdmin && !to.meta.skipModeCheck) {
      const appModeStore = useAppModeStore();
      if (!appModeStore.mode) {
        return { name: 'ModeSelect' };
      }
    }

    // All checks passed, proceed
    return;
  });

  // Optional: afterEach for analytics or logging
  router.afterEach((to) => {
    // Could add page tracking here
    console.log(`Navigated to: ${to.path}`);
  });
}