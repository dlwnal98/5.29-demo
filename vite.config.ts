import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// vite.config.ts 상단에 분리
const createProxyOptions = (target: string, extraOptions = {}) => ({
  target,
  changeOrigin: true,
  configure: (proxy: any) => {
    proxy.on('error', (err: Error, req: any, res: any) => {
      console.error(`[proxy error] ${req?.url ?? 'unknown'}`, err.message);
    });
    proxy.on('proxyReq', (proxyReq: any, req: any) => {
      // req가 있을 때만 로그 출력
      if (req?.method && req?.url) {
        console.log(`[proxy] ${req.method} ${req.url} → ${target}`);
      }
    });
  },
  ...extraOptions,
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  // mode = 'development' | 'production'
  // 세 번째 인자 '' -> VITE_prefix 없는 것도 전부 로드
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(),
    visualizer({
      filename: 'dist/stats.html',  // 결과 파일 위치
      open: true,                    // 빌드 후 브라우저 자동 오픈
      template: 'treemap',           // 시각화 방식 (treemap | sunburst | network)
    })

    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 3000,
      proxy: {
        // next.config.mjs의 19개 rewrites 규칙 이관
        //VITE_API_ADMIN
        '/admin': createProxyOptions(env.ADMIN_URL),

        //VITE_API_VAULT
        '/v1/api/git': createProxyOptions(env.VITE_API_VAULT),
        '/api/vault/key': createProxyOptions(env.VITE_API_VAULT),

        //VITE_API_APIMANAGEMENT
        '/api/v1/route-endpoints': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/common-codes': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/deployments': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/resources': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/api-keys': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/methods': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/metrics': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/stages': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/plans': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/models': createProxyOptions(env.VITE_API_APIMANAGEMENT),
        '/api/v1/invoke': createProxyOptions(env.VITE_API_APIMANAGEMENT),

        //VITE_API_AUTH
        '/api/v1/access-token': createProxyOptions(env.VITE_API_AUTH),
        '/api/v1/code': createProxyOptions(env.VITE_API_AUTH),

        //VITE_API_MEMBER
        '/api/v1/role-permissions': createProxyOptions(env.VITE_API_MEMBER),
        '/api/v1/organizations': createProxyOptions(env.VITE_API_MEMBER),
        '/api/v1/permissions': createProxyOptions(env.VITE_API_MEMBER),
        '/api/v1/roles': createProxyOptions(env.VITE_API_MEMBER),
        '/api/v1/users': createProxyOptions(env.VITE_API_MEMBER),
        '/api/v1/role': createProxyOptions(env.VITE_API_MEMBER),

        //VITE_API_GATEWAY
        '/api/v1/gateway/stage': createProxyOptions(env.VITE_API_GATWAY, { secure: true }),

        //VITE_API_METRICS
        // '/api/v1/metrics': createProxyOptions(env.VITE_API_METRICS),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('ace-builds') || id.includes('react-ace')) {
              return 'vendor-editor';
            }

            if (id.includes('d3-') || id.includes('recharts')) {
              return 'vendor-chart';
            }

            if (id.includes('react-dom')) {
              return 'vendor-react';
            }

            if (
              id.includes('highlight.js') ||
              id.includes('rehype-highlight') ||
              id.includes('micromark') ||
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('unified')
            ) {
              return 'vendor-markdown';
            }

            return 'vendor';
          },
        }
      },
      chunkSizeWarningLimit: 1000,
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'axios',
      ],
    },
  }
})
