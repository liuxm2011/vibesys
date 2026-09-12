/**
 * Outbound URL policy guard (SSRF defence for user/admin controlled baseURL).
 *
 * Runtime context: Cloudflare Workers.
 *   - No Node `fs`, no real `process.env` (only the nodejs_compat polyfill).
 *   - THE `dns` MODULE IS NOT AVAILABLE. We therefore cannot resolve a hostname
 *     to an IP before deciding whether a fetch is safe. Every decision below is
 *     purely lexical, based on WHATWG `URL` parsing of the raw string.
 *
 * ── Known limitation (documented on purpose, do NOT remove) ──────────────────
 * A hostname that *resolves* to a private / link-local / cloud-metadata IP
 * cannot be caught at the string layer. Examples that WILL pass this guard:
 *   - https://127.0.0.1.nip.io         (wildcard DNS -> 127.0.0.1)
 *   - https://anything.xip.io          (same idea)
 *   - https://attacker.example         (A record -> 169.254.169.254)
 * Fully closing this requires resolving the host and re-validating the returned
 * IP (or pinning the connection), which is impossible here without an external
 * resolver / a connect-time hook. This guard raises the bar (blocks literal
 * IPs, base/encoding obfuscation and well-known internal suffixes) but is NOT a
 * complete SSRF defence on its own.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type UrlPolicyResult =
  | { ok: true; url: string }
  | { ok: false; reason: string };

/** Hostnames that are always rejected (case-insensitive exact match). */
const BLOCKED_HOSTS = new Set([
  'localhost',
  'local',
  'localdomain',
  'internal',
  'metadata',
]);

/** Suffixes that are always rejected (case-insensitive). */
const BLOCKED_HOST_SUFFIXES = [
  '.localhost',
  '.local',
  '.localdomain',
  '.internal',
];

/**
 * IPv4 ranges that must never be reachable (private, loopback, link-local /
 * cloud metadata, CGNAT, this-network, benchmark, multicast, reserved).
 */
const BLOCKED_V4_CIDRS: Array<[string, number]> = [
  ['0.0.0.0', 8],        // "this network"
  ['10.0.0.0', 8],       // RFC1918 private
  ['100.64.0.0', 10],    // CGNAT (RFC6598)
  ['127.0.0.0', 8],      // loopback
  ['169.254.0.0', 16],   // link-local (incl. 169.254.169.254 cloud metadata)
  ['172.16.0.0', 12],    // RFC1918 private
  ['192.0.0.0', 24],     // IETF protocol assignments
  ['192.168.0.0', 16],   // RFC1918 private
  ['198.18.0.0', 15],    // benchmarking
  ['224.0.0.0', 4],      // multicast
  ['240.0.0.0', 4],      // reserved / future use
];

/** Parse a single IPv4 "number" part honouring hex (0x..) and octal (0..) forms. */
function parseIpv4Number(part: string): number | null {
  if (part === '') return null;
  if (/^0x[0-9a-f]+$/i.test(part)) return parseInt(part, 16);
  if (/^0[0-7]+$/.test(part)) return parseInt(part, 8);
  if (/^[0-9]+$/.test(part)) return parseInt(part, 10);
  return null;
}

/**
 * Convert an IPv4 literal (dotted form, or a single decimal/hex/octal integer)
 * to an unsigned 32-bit integer, following the WHATWG "IPv4 parser" rules so
 * that obfuscated forms such as `2130706433`, `0x7f000001`, `017700000001` and
 * `127.1` all map to 127.0.0.1. Returns null when the input is not an IPv4
 * literal (e.g. a normal domain name).
 */
function ipv4ToInt(input: string): number | null {
  if (input === '') return null;
  const parts = input.split('.');
  if (parts.length === 0 || parts.length > 4) return null;

  const values: number[] = [];
  for (const part of parts) {
    const value = parseIpv4Number(part);
    if (value === null || !Number.isFinite(value)) return null;
    values.push(value);
  }

  // Every part except the last must fit in one octet.
  for (let i = 0; i < values.length - 1; i += 1) {
    if (values[i] > 255) return null;
  }
  // The last part may encode the remaining octets, bounded by 256^(5 - n).
  const lastLimit = Math.pow(256, 5 - values.length);
  if (values[values.length - 1] >= lastLimit) return null;

  let result = values[values.length - 1];
  for (let i = 0; i < values.length - 1; i += 1) {
    result += values[i] * Math.pow(256, 3 - i);
  }
  return result >>> 0;
}

/** True when the given 32-bit value falls inside a blocked IPv4 CIDR. */
function isBlockedV4Int(ip: number): boolean {
  for (const [base, prefix] of BLOCKED_V4_CIDRS) {
    const baseInt = ipv4ToInt(base);
    if (baseInt === null) continue;
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    if ((ip & mask) >>> 0 === (baseInt & mask) >>> 0) return true;
  }
  return false;
}

/** Parse a dotted-decimal IPv4 (for embedding inside IPv6), returns 4 bytes. */
function parseIpv4Dotted(input: string): number[] | null {
  const parts = input.split('.');
  if (parts.length !== 4) return null;
  const bytes: number[] = [];
  for (const part of parts) {
    if (!/^[0-9]+$/.test(part)) return null;
    const value = parseInt(part, 10);
    if (value < 0 || value > 255) return null;
    bytes.push(value);
  }
  return bytes;
}

/** Expand an IPv6 literal into eight 16-bit groups, or null when invalid. */
function expandIpv6(addr: string): number[] | null {
  let s = addr.toLowerCase();
  const zoneIndex = s.indexOf('%');
  if (zoneIndex !== -1) s = s.slice(0, zoneIndex);
  if (s === '') return null;

  // Fold an embedded IPv4 tail (e.g. ::ffff:127.0.0.1) into two hex groups.
  if (s.includes('.')) {
    const lastColon = s.lastIndexOf(':');
    if (lastColon === -1) return null;
    const v4 = parseIpv4Dotted(s.slice(lastColon + 1));
    if (!v4) return null;
    const high = ((v4[0] << 8) | v4[1]).toString(16);
    const low = ((v4[2] << 8) | v4[3]).toString(16);
    s = `${s.slice(0, lastColon + 1)}${high}:${low}`;
  }

  const parseHextet = (part: string): number | null => {
    if (part === '' || !/^[0-9a-f]{1,4}$/.test(part)) return null;
    return parseInt(part, 16);
  };

  const doubleColon = s.indexOf('::');
  if (doubleColon === -1) {
    const parts = s.split(':');
    if (parts.length !== 8) return null;
    const groups = parts.map(parseHextet);
    if (groups.some((g) => g === null)) return null;
    return groups as number[];
  }

  if (s.indexOf('::', doubleColon + 1) !== -1) return null; // more than one "::"
  const left = s.slice(0, doubleColon);
  const right = s.slice(doubleColon + 2);
  const leftParts = left === '' ? [] : left.split(':');
  const rightParts = right === '' ? [] : right.split(':');
  const missing = 8 - leftParts.length - rightParts.length;
  if (missing < 1) return null;
  const leftGroups = leftParts.map(parseHextet);
  const rightGroups = rightParts.map(parseHextet);
  if ([...leftGroups, ...rightGroups].some((g) => g === null)) return null;
  return [
    ...(leftGroups as number[]),
    ...new Array(missing).fill(0),
    ...(rightGroups as number[]),
  ];
}

/** Returns a rejection reason when the IPv6 literal is unsafe, else null. */
function checkIpv6(bare: string): string | null {
  const groups = expandIpv6(bare);
  if (!groups) return 'IPv6 地址格式无效';
  const g = groups;

  if (g.every((x) => x === 0)) return '未指定地址 :: 不允许';
  if (g.slice(0, 7).every((x) => x === 0) && g[7] === 1) return '回环地址 ::1 不允许';
  if ((g[0] & 0xfe00) === 0xfc00) return '唯一本地地址 fc00::/7 不允许';
  if ((g[0] & 0xffc0) === 0xfe80) return '链路本地地址 fe80::/10 不允许';
  if ((g[0] & 0xff00) === 0xff00) return '多播地址 ff00::/8 不允许';

  // IPv4-mapped (::ffff:0:0/96) and IPv4-compatible (::/96, deprecated).
  const highZero = g[0] === 0 && g[1] === 0 && g[2] === 0 && g[3] === 0 && g[4] === 0;
  if (highZero && (g[5] === 0xffff || g[5] === 0)) {
    const embedded = (((g[6] << 16) | g[7]) >>> 0);
    if (isBlockedV4Int(embedded)) {
      return 'IPv4 映射/兼容地址指向内网段';
    }
  }
  return null;
}

/**
 * Validate a user/admin supplied API base URL before it is stored or fetched.
 *
 * Enforces, in order:
 *   1. A well-formed absolute URL.
 *   2. Protocol must be `https:` (http/ftp/file/data/gopher/... rejected).
 *   3. No userinfo (`https://user:pass@host/...` rejected).
 *   4. A non-empty hostname is required (`https:///path` rejected).
 *   5. Hostname blocklist / suffix blocklist (localhost, *.local, *.internal,
 *      *.localdomain, bare `metadata`, ...).
 *   6. IPv4 literals must be public (private/loopback/link-local/metadata/
 *      CGNAT/benchmark/multicast/reserved all rejected), including the
 *      decimal / hex / octal / shorthand obfuscations of 127.0.0.1.
 *   7. IPv6 literals must be public (`::1`, `::`, fc00::/7, fe80::/10, ff00::/8
 *      and IPv4-mapped private addresses rejected).
 *
 * On success `url` is the trimmed input string (NOT re-serialised), so existing
 * legitimate base URLs keep byte-for-byte behaviour. Failures carry a
 * human-readable Chinese `reason`.
 */
export function checkPublicHttpsBaseUrl(raw: string): UrlPolicyResult {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return { ok: false, reason: '地址不能为空' };
  }
  const trimmed = raw.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: '不是合法的 URL' };
  }

  // (a) protocol
  if (parsed.protocol !== 'https:') {
    return { ok: false, reason: `仅支持 https 协议（当前为 ${parsed.protocol.replace(':', '') || '空'}）` };
  }

  // (b) userinfo
  if (parsed.username !== '' || parsed.password !== '') {
    return { ok: false, reason: 'URL 中不允许包含用户名或密码' };
  }

  // (c) hostname present
  const hostname = parsed.hostname.toLowerCase();
  if (hostname === '') {
    return { ok: false, reason: '缺少主机名' };
  }

  const bracketed = hostname.startsWith('[') && hostname.endsWith(']');
  const bareHost = bracketed ? hostname.slice(1, -1) : hostname;
  if (bareHost === '') {
    return { ok: false, reason: '缺少主机名' };
  }

  // IPv6 literal (bracketed, or any colon-bearing host after unbracketing).
  if (bracketed || bareHost.includes(':')) {
    const reason = checkIpv6(bareHost);
    if (reason) return { ok: false, reason };
    return { ok: true, url: trimmed };
  }

  // (d) hostname blocklist / suffix blocklist
  if (BLOCKED_HOSTS.has(bareHost)) {
    return { ok: false, reason: `主机名 ${bareHost} 属于内网保留域名` };
  }
  for (const suffix of BLOCKED_HOST_SUFFIXES) {
    if (bareHost.endsWith(suffix)) {
      return { ok: false, reason: `主机名 ${bareHost} 属于内网保留域名` };
    }
  }

  // (e)+(g) IPv4 literal (incl. obfuscated encodings) must be public
  const v4 = ipv4ToInt(bareHost);
  if (v4 !== null) {
    if (isBlockedV4Int(v4)) {
      return { ok: false, reason: `IP 地址 ${bareHost} 属于内网或保留网段` };
    }
    return { ok: true, url: trimmed };
  }

  // A single-label host can never be a public DNS name and is a classic
  // internal-service target (e.g. `https://database`, `https://router`). This
  // also rejects `https:///path`, which WHATWG parses as host "path".
  if (!bareHost.includes('.')) {
    return { ok: false, reason: `主机名 ${bareHost} 不是有效的公网域名` };
  }

  // (h) A regular hostname: port unrestricted, path allowed. Passing note:
  // wildcard-DNS hosts (nip.io/xip.io) that resolve to internal IPs remain a
  // known limitation of this lexical guard — see file header.
  return { ok: true, url: trimmed };
}
