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
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),  // Phase 3: Document editing
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'Admin', redirect: '/admin/users' },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/UserManagement.vue') },
      { path: 'topics', name: 'AdminTopics', component: () => import('@/views/admin/TopicManagement.vue') },
      { path: 'stats', name: 'AdminStats', component: () => import('@/views/admin/Statistics.vue') },
      { path: 'config', name: 'AdminConfig', component: () => import('@/views/admin/SystemConfig.vue') }
    ]
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
