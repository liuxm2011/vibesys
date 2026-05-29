// Minimal leveled logger that works in both Node (dev) and Cloudflare Workers.
// Level resolves from LOG_LEVEL, else defaults to 'warn' in production and
// 'debug' otherwise. In Workers (no process.env) it falls back to the default.

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function resolveLevel(): LogLevel {
  const env = (typeof process !== 'undefined' ? process.env : undefined) as
    | Record<string, string | undefined>
    | undefined;
  const explicit = env?.LOG_LEVEL?.toLowerCase();
  if (explicit && explicit in ORDER) return explicit as LogLevel;
  return env?.NODE_ENV === 'production' ? 'warn' : 'debug';
}

let threshold = ORDER[resolveLevel()];

export const logger = {
  setLevel(level: LogLevel) {
    threshold = ORDER[level];
  },
  debug(...args: unknown[]) {
    if (ORDER.debug >= threshold) console.debug(...args);
  },
  info(...args: unknown[]) {
    if (ORDER.info >= threshold) console.info(...args);
  },
  warn(...args: unknown[]) {
    if (ORDER.warn >= threshold) console.warn(...args);
  },
  error(...args: unknown[]) {
    if (ORDER.error >= threshold) console.error(...args);
  },
};
