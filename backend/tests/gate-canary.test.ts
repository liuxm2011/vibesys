/**
 * ⚠️ 临时文件 —— CI 部署门禁演练（Drill）
 *
 * 目的：验证 `deploy-worker.yml` 的 `deploy` job（needs: test）在测试失败时被真正阻断，
 * 而不是形同虚设。
 *
 * 该用例故意失败 → `test` job 失败 → `deploy` job 应被 skipped。
 * 演练结束后本文件会被删除（见紧随其后的 revert 提交）。
 *
 * 影响面：仅测试文件，不参与 Worker 构建（wrangler 从 src/worker.ts 打包），
 * 因此即使门禁失效也不会把任何变更带上生产。
 */
import { describe, expect, it } from 'vitest';

describe('CI deploy gate drill', () => {
  it('deliberately fails to prove the deploy gate blocks on test failure', () => {
    expect(1).toBe(2);
  });
});
