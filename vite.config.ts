import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
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
    // 소스맵 생성 (개발 환경에서만)
    sourcemap: false,
    // 청크 크기 경고 임계값 (500KB)
    chunkSizeWarningLimit: 500,
    // 빌드 산출물 최적화
    rollupOptions: {
      output: {
        // 청크 파일명 설정
        manualChunks: {
          // Vue 관련 라이브러리
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 라이브러리
          'ui-vendor': ['reka-ui', 'lucide-vue-next'],
          // 유틸리티 라이브러리
          'utils-vendor': ['axios', '@vueuse/core'],
        }
      }
    }
  }
}) 