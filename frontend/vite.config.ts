import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

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
      '/api/ai/generate/stream': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('X-Accel-Buffering', 'no');
          });
          proxy.on('proxyRes', (proxyRes, _req, res) => {
            // Disable buffering for SSE streams
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              res.setHeader('Cache-Control', 'no-cache, no-transform');
              res.setHeader('Connection', 'keep-alive');
              res.setHeader('X-Accel-Buffering', 'no');
            }
          });
          proxy.on('error', (_err, _req, res) => {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '代理连接失败' }));
          });
        },
        // Longer timeout for AI generation (3 minutes)
        timeout: 180000,
        proxyTimeout: 180000,
      },
      // SSE streaming endpoint for expert panel review - needs long timeout
      '/api/ai/review/stream': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('X-Accel-Buffering', 'no');
          });
          proxy.on('proxyRes', (proxyRes, _req, res) => {
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              res.setHeader('Cache-Control', 'no-cache, no-transform');
              res.setHeader('Connection', 'keep-alive');
              res.setHeader('X-Accel-Buffering', 'no');
            }
          });
          proxy.on('error', (_err, _req, res) => {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '代理连接失败' }));
          });
        },
        // Review can take 6+ minutes (streaming + patch hint recovery)
        timeout: 600000,
        proxyTimeout: 600000,
      },
      // General API proxy
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  }
});
