import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // base 경로 명시적 설정 (프로덕션 빌드 시 정적 파일 경로 보정)
  base: '/',
  
  plugins: [
    // Vue 플러그인
    vue(),
    // Tailwind CSS는 PostCSS를 통해 처리되므로 별도 플러그인 불필요
  ],
  resolve: {
    // 경로 별칭 설정
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 빌드 최적화 설정
  build: {
    // 타겟 브라우저 (ES2020 이상 지원)
    target: 'es2020',
    // 소스맵 생성 (프로덕션에서는 false)
    sourcemap: false,
    // 청크 크기 경고 임계값 (500KB)
    chunkSizeWarningLimit: 500,
    // CSS 코드 분할
    cssCodeSplit: true,
    // CSS 최소화
    minify: 'esbuild', // esbuild가 terser보다 빠름
    // 빌드 산출물 최적화
    rollupOptions: {
      output: {
        // 청크 파일명 설정
        manualChunks: (id) => {
          // node_modules에서 라이브러리 분리
          if (id.includes('node_modules')) {
            // Vue 관련 라이브러리
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            // UI 라이브러리
            if (id.includes('reka-ui') || id.includes('lucide-vue-next')) {
              return 'ui-vendor'
            }
            // Chart 라이브러리
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'chart-vendor'
            }
            // 유틸리티 라이브러리
            if (id.includes('axios') || id.includes('@vueuse/core')) {
              return 'utils-vendor'
            }
            // 기타 vendor 라이브러리
            return 'vendor'
          }
        },
        // 청크 파일명 포맷
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // CSS 파일 분리
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          // 이미지 파일
          if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          // 폰트 파일
          if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          // 기타 파일
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  // 개발 서버 최적화
  server: {
    // HMR 성능 최적화
    hmr: {
      overlay: true
    }
  }
}) 