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
    path: '/mode-select',
    name: 'ModeSelect',
    component: () => import('@/views/ModeSelect.vue'),
    meta: { requiresAuth: true, skipModeCheck: true }
  },
  {
    path: '/graduation',
    name: 'GraduationDashboard',
    component: () => import('@/views/graduation/GraduationDashboard.vue'),
    meta: { requiresAuth: true, skipModeCheck: true }
  },
  {
    path: '/graduation/topics',
    name: 'GraduationTopicPool',
    component: () => import('@/views/graduation/GraduationTopicPool.vue'),
    meta: { requiresAuth: true, skipModeCheck: true }
  },
  {
    path: '/graduation/dataset',
    name: 'DatasetPreview',
    component: () => import('@/views/graduation/DatasetPreview.vue'),
    meta: { requiresAuth: true, skipModeCheck: true }
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
      { path: 'config', name: 'AdminConfig', component: () => import('@/views/admin/SystemConfig.vue') },
      { path: 'api-providers', name: 'AdminApiProviders', component: () => import('@/views/admin/ApiProviderManagement.vue') },
      { path: 'repos', name: 'AdminRepos', component: () => import('@/views/admin/RepoManagement.vue') },
      { path: 'graduation', name: 'AdminGraduation', component: () => import('@/views/admin/GraduationManagement.vue') },
      { path: 'archive', name: 'AdminArchive', component: () => import('@/views/admin/ArchiveManagement.vue') }
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
    skipModeCheck?: boolean;
  }
}
