import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Setup navigation guards for authentication (D-19)
 * @param router Vue Router instance
 */
export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth ?? false;
    const requiresAdmin = to.meta.requiresAdmin ?? false;

    // Skip guard for public routes
    if (!requiresAuth) {
      next();
      return;
    }

    // Try to restore session on page refresh (AUTH-04)
    if (!authStore.user && !authStore.loading) {
      await authStore.fetchProfile();
    }

    // Check authentication status
    if (!authStore.isAuthenticated) {
      // Redirect to login with return path (D-19)
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Check admin-only routes
    if (requiresAdmin && !authStore.isAdmin) {
      // Non-admin trying to access admin route
      next({ name: 'Dashboard' });
      return;
    }

    // All checks passed, proceed
    next();
  });

  // Optional: afterEach for analytics or logging
  router.afterEach((to) => {
    // Could add page tracking here
    console.log(`Navigated to: ${to.path}`);
  });
}