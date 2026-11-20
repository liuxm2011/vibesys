import { defineConfig, type ProxyOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

function streamProxy(timeout: number): ProxyOptions {
  return {
    target: 'http://127.0.0.1:3001',
    changeOrigin: true,
    timeout,
    proxyTimeout: timeout,
    configure(proxy) {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.setHeader('Connection', 'keep-alive');
      });
      proxy.on('proxyRes', (proxyRes, _req, res) => {
        if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
        }
      });
      proxy.on('error', (error, _req, res) => {
        if (!('writeHead' in res) || res.headersSent) {
          res.destroy(error);
          return;
        }
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '代理连接失败' }));
      });
    },
  };
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      // SSE streaming endpoint - must be before general /api proxy
      '/api/ai/generate/stream': streamProxy(180_000),
      '/api/graduation/generate/stream': streamProxy(600_000),
      '/api/ai/review/stream': streamProxy(600_000),
      // General API proxy
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  }
});
