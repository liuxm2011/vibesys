/**
 * 单元测试：outbound URL 策略守卫 checkPublicHttpsBaseUrl
 * 目标文件：src/utils/url-policy.utils.ts
 *
 * 该模块是 P0-A（SSRF 防护）的核心：用户 / 管理员可写的 baseURL 在落库与
 * fetch 之前必须经过它校验。本文件直接对纯函数建表断言，覆盖放行、拒绝、
 * 边界输入，并对已知局限（域名层 SSRF）做显式文档化锁定。
 *
 * 断言采用「精确 reason 字符串」而非「仅 ok===false」，避免放款断言掩盖回归：
 * 若守卫的判定类别发生变化，reason 会变，测试即失败。
 */
import { describe, it, expect } from 'vitest';
import { checkPublicHttpsBaseUrl } from '../src/utils/url-policy.utils.js';

describe('checkPublicHttpsBaseUrl — 放行合法公网 HTTPS 端点', () => {
  const allowed: string[] = [
    'https://api.minimaxi.com/v1',
    'https://api.openai.com',
    'https://api.example.com:8443', // 非标端口
    'https://api.example.com:8443/v1/chat', // 非标端口 + 路径
    'https://example.com/deep/path?x=1', // 路径 + 查询串
    'https://8.8.8.8', // 公网 IPv4 字面量
    'https://1.1.1.1:443', // 公网 IPv4 + 显式端口
    'https://[2606:4700:4700::1111]', // 公网 IPv6
    'https://[2001:4860:4860::8888]:8443', // 公网 IPv6 + 端口
  ];

  it.each(allowed)('放行 %s', (url) => {
    const result = checkPublicHttpsBaseUrl(url);
    expect(result.ok).toBe(true);
    // 成功时返回 trim 后的原始输入（不做重序列化），保证既有合法配置字节级不变
    if (result.ok) expect(result.url).toBe(url);
  });

  it('对首尾空白做 trim 后放行，并返回 trim 结果', () => {
    const result = checkPublicHttpsBaseUrl('  https://api.openai.com  ');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url).toBe('https://api.openai.com');
  });
});

describe('checkPublicHttpsBaseUrl — 拒绝非 https / 畸形 / 危险端点', () => {
  // [url, 期望的精确 reason]
  const rejected: Array<[string, string]> = [
    // 协议
    ['http://api.example.com', '仅支持 https 协议（当前为 http）'],
    ['ftp://api.example.com', '仅支持 https 协议（当前为 ftp）'],
    ['file:///etc/passwd', '仅支持 https 协议（当前为 file）'],
    ['data:text/plain,hi', '仅支持 https 协议（当前为 data）'],
    ['gopher://example.com', '仅支持 https 协议（当前为 gopher）'],
    // userinfo
    ['https://user:pass@api.example.com', 'URL 中不允许包含用户名或密码'],
    ['https://user@api.example.com', 'URL 中不允许包含用户名或密码'],
    // 主机名缺失 / 单标签
    ['https:///path', '主机名 path 不是有效的公网域名'],
    ['https://database', '主机名 database 不是有效的公网域名'],
    // 保留域名
    ['https://localhost', '主机名 localhost 属于内网保留域名'],
    ['https://localhost:8080', '主机名 localhost 属于内网保留域名'],
    ['https://foo.local', '主机名 foo.local 属于内网保留域名'],
    ['https://x.internal', '主机名 x.internal 属于内网保留域名'],
    ['https://y.localdomain', '主机名 y.localdomain 属于内网保留域名'],
    ['https://metadata', '主机名 metadata 属于内网保留域名'],
    // 云元数据 / 私网 IPv4 段
    ['https://169.254.169.254', 'IP 地址 169.254.169.254 属于内网或保留网段'],
    ['https://10.0.0.1', 'IP 地址 10.0.0.1 属于内网或保留网段'],
    ['https://10.255.255.255', 'IP 地址 10.255.255.255 属于内网或保留网段'],
    ['https://172.16.0.1', 'IP 地址 172.16.0.1 属于内网或保留网段'],
    ['https://172.20.1.1', 'IP 地址 172.20.1.1 属于内网或保留网段'],
    ['https://172.31.255.255', 'IP 地址 172.31.255.255 属于内网或保留网段'],
    ['https://192.168.1.1', 'IP 地址 192.168.1.1 属于内网或保留网段'],
    ['https://127.0.0.1', 'IP 地址 127.0.0.1 属于内网或保留网段'],
    ['https://100.64.0.1', 'IP 地址 100.64.0.1 属于内网或保留网段'], // CGNAT
    ['https://0.0.0.0', 'IP 地址 0.0.0.0 属于内网或保留网段'],
    // 进制 / 简写混淆，WHATWG URL 会规范化到 127.0.0.1
    ['https://2130706433', 'IP 地址 127.0.0.1 属于内网或保留网段'],
    ['https://0x7f000001', 'IP 地址 127.0.0.1 属于内网或保留网段'],
    ['https://017700000001', 'IP 地址 127.0.0.1 属于内网或保留网段'],
    ['https://127.1', 'IP 地址 127.0.0.1 属于内网或保留网段'],
    // IPv6 危险地址
    ['https://[::1]', '回环地址 ::1 不允许'],
    ['https://[::]', '未指定地址 :: 不允许'],
    ['https://[fc00::1]', '唯一本地地址 fc00::/7 不允许'],
    ['https://[fe80::1]', '链路本地地址 fe80::/10 不允许'],
    ['https://[ff00::1]', '多播地址 ff00::/8 不允许'],
    ['https://[::ffff:127.0.0.1]', 'IPv4 映射/兼容地址指向内网段'],
  ];

  it.each(rejected)('拒绝 %s', (url, expectedReason) => {
    const result = checkPublicHttpsBaseUrl(url);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe(expectedReason);
  });
});

describe('checkPublicHttpsBaseUrl — 边界与异常输入', () => {
  const empties: Array<[string, unknown]> = [
    ['空串', ''],
    ['纯空格', '   '],
    ['null', null],
    ['undefined', undefined],
    ['数字', 123],
    ['对象', {}],
    ['数组', []],
  ];

  it.each(empties)('%s → 拒绝为「地址不能为空」', (_label, value) => {
    const result = checkPublicHttpsBaseUrl(value as unknown as string);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('地址不能为空');
  });

  it('裸 "https://"（无主机名）→ 非法 URL', () => {
    const result = checkPublicHttpsBaseUrl('https://');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('不是合法的 URL');
  });

  it('超长主机名不崩溃，返回明确判定', () => {
    const long = `https://${'a'.repeat(5000)}.com`;
    expect(() => checkPublicHttpsBaseUrl(long)).not.toThrow();
    const result = checkPublicHttpsBaseUrl(long);
    // 词法上是一个（超长的）合法公网域名，故放行；关键是其不抛异常、不死循环
    expect(result.ok).toBe(true);
  });
});

describe('checkPublicHttpsBaseUrl — 已知局限（文档化锁定）', () => {
  /**
   * 见 src/utils/url-policy.utils.ts 文件头注释：本守卫是**纯词法**检查，
   * Workers 运行时无 dns 模块，无法在 fetch 前把主机名解析成 IP。
   * 因此「解析后落到私网/元数据 IP」的通配 DNS 域名会被放行。
   *
   * 下面这条用例不是「通过即安全」，而是**锁死当前（有意为之）的行为**——
   * 一旦将来引入 DNS 解析 / 连接期校验并收紧此处，此用例应当同步更新。
   */
  it('放行 https://127.0.0.1.nip.io（通配 DNS 指向回环，当前设计的已知局限）', () => {
    const result = checkPublicHttpsBaseUrl('https://127.0.0.1.nip.io');
    expect(result.ok).toBe(true);
  });

  it.todo(
    '待补强：解析主机名后的二次 IP 校验（连接期 pin / resolver hook）以关闭通配 DNS 绕过 —— 当前 Workers 环境无法实现'
  );
});
