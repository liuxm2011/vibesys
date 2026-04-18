import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),  // Created in Plan 05
    meta: { requiresAuth: true }
  },
  {
    path: '/topics',
    name: 'TopicPool',
    component: () => import('@/views/TopicPool.vue'),  // Created in Wave 5
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),  // Placeholder for Phase 5
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

// Route meta type extension
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
  }
}