import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter, isNavigationFailure, NavigationFailureType } from 'vue-router';
import { beforeEach, expect, test, vi } from 'vitest';
import { ElMessage } from 'element-plus';
import { getGraduationStatus } from '@/api/thesis.api';
import appRouter from '@/router';
import { setupRouterGuards } from '@/router/guards';
import { useAppModeStore } from '@/stores/appMode.store';
import { useAuthStore } from '@/stores/auth.store';

vi.mock('element-plus', () => ({ ElMessage: { warning: vi.fn() } }));
vi.mock('@/api/thesis.api', () => ({ getGraduationStatus: vi.fn() }));

beforeEach(() => {
  sessionStorage.clear();
  vi.resetAllMocks();
  setActivePinia(createPinia());
});

function setup() {
  const auth = useAuthStore();
  auth.user = { studentId: '231311111', name: '学生', role: 'STUDENT', major: '大数据', grade: '', class: '' };
  const router = createRouter({
    history: createMemoryHistory(),
    routes: appRouter.getRoutes()
      .filter(({ name }) => ['Login', 'Dashboard', 'ModeSelect', 'GraduationDashboard', 'GraduationTopicPool', 'DatasetPreview'].includes(String(name)))
      .map(({ path, name, meta }) => ({ path, name, meta, component: { render: () => null } })),
  });
  setupRouterGuards(router);
  return { router, auth, mode: useAppModeStore() };
}

test('从项目设计进入毕业设计并返回，当前模式随页面更新', async () => {
  vi.mocked(getGraduationStatus).mockResolvedValue({ access: 'allowed' });
  const { router, mode } = setup();
  await router.push('/dashboard');
  expect(router.currentRoute.value.name).toBe('ModeSelect');
  mode.setMode('project');
  await router.push('/dashboard');
  await router.push('/graduation');
  expect(router.currentRoute.value.name).toBe('GraduationDashboard');
  expect(mode.mode).toBe('graduation');
  await router.push('/dashboard');
  expect(router.currentRoute.value.name).toBe('Dashboard');
  expect(mode.mode).toBe('project');
});

test.each([
  ['closed', '毕业设计尚未开放，请先使用项目设计。'],
  ['ineligible', '毕业设计仅面向大数据专业学生开放。'],
] as const)('从项目设计切换受限时留在原页面（%s）', async (access, message) => {
  vi.mocked(getGraduationStatus).mockResolvedValue({ access });
  const { router, mode } = setup();
  mode.setMode('project');
  await router.push('/dashboard');
  const failure = await router.push('/graduation');
  expect(isNavigationFailure(failure, NavigationFailureType.aborted)).toBe(true);
  expect(router.currentRoute.value.name).toBe('Dashboard');
  expect(mode.mode).toBe('project');
  expect(ElMessage.warning).toHaveBeenCalledWith(message);
});

test.each(['/graduation', '/graduation/topics', '/graduation/dataset'])('直接打开受限页面 %s 会回到项目设计', async (path) => {
  vi.mocked(getGraduationStatus).mockResolvedValue({ access: 'closed' });
  const { router, mode } = setup();
  await router.push(path);
  expect(router.currentRoute.value.name).toBe('Dashboard');
  expect(mode.mode).toBe('project');
});

test('刷新毕业设计深链接时重新检查权限并恢复模式', async () => {
  vi.mocked(getGraduationStatus).mockResolvedValue({ access: 'allowed' });
  const { router, auth, mode } = setup();
  const user = auth.user;
  auth.user = null;
  vi.spyOn(auth, 'fetchProfile').mockImplementation(async () => {
    auth.user = user;
    return true;
  });
  await router.push('/graduation/topics');
  expect(getGraduationStatus).toHaveBeenCalledOnce();
  expect(router.currentRoute.value.name).toBe('GraduationTopicPool');
  expect(sessionStorage.getItem('appMode')).toBe('graduation');
  expect(mode.mode).toBe('graduation');
});

test('状态请求失败时显示重试提示并回到项目设计', async () => {
  vi.mocked(getGraduationStatus).mockRejectedValue(new Error('network error'));
  const { router } = setup();
  await router.push('/graduation');
  expect(router.currentRoute.value.name).toBe('Dashboard');
  expect(ElMessage.warning).toHaveBeenCalledWith('暂时无法确认毕业设计开放状态，请稍后重试。');
});
