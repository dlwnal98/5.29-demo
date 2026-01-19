import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      // next.config.mjs의 19개 rewrites 규칙 이관
      '/admin': {
        target: 'http://1.224.162.188:58761',
        changeOrigin: true,
      },
      '/v1/api/git': {
        target: 'http://1.224.162.188:58080',
        changeOrigin: true,
      },
      '/api/vault/key': {
        target: 'http://1.224.162.188:58080',
        changeOrigin: true,
      },
      '/api/v1/api-keys': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/access-token': {
        target: 'http://1.224.162.188:58081',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
          });
        },
      },
      '/api/v1/code': {
        target: 'http://1.224.162.188:58081',
        changeOrigin: true,
      },
      // '/auth-callback': {
      //   target: 'http://1.224.162.188:58081',
      //   changeOrigin: true,
      // },
      '/api/v1/organizations': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/permissions': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/role': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/roles': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/role-permissions': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/users': {
        target: 'http://1.224.162.188:58083',
        changeOrigin: true,
      },
      '/api/v1/plans': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },

      '/api/v1/resources': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/methods': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/stages': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/models': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/deployments': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/route-endpoints': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/common-codes': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/invoke': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/metrics': {
        target: 'http://1.224.162.188:58084',
        changeOrigin: true,
      },
      '/api/v1/gateway/stage': {
        target: 'https://1.224.162.188:18082',
        changeOrigin: true,
        secure: false, // HTTPS 자체 서명 인증서 허용
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React 코어 라이브러리
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }

            // Radix UI 컴포넌트 (20+ 패키지를 하나로)
            if (id.includes('@radix-ui')) {
              return 'radix-ui-vendor';
            }

            // 데이터 fetching
            if (id.includes('@tanstack/react-query') || id.includes('axios') || id.includes('swr')) {
              return 'query-vendor';
            }

            // 상태 관리
            if (id.includes('zustand')) {
              return 'state-vendor';
            }

            // 에디터
            if (id.includes('ace-builds') || id.includes('react-ace')) {
              return 'editor-vendor';
            }

            // 차트
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }

            // 마크다운/MDX
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('mdx')) {
              return 'markdown-vendor';
            }

            // 유틸리티
            if (id.includes('lucide-react') || id.includes('date-fns') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }

            // 나머지 node_modules
            return 'vendor';
          }
        },
      },
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
})
