import { ref, watch, onMounted } from 'vue'
// import { usePreferredDark } from '@vueuse/core' // 시스템 다크 모드 감지 (현재 미사용)

/**
 * 테마 관리 composable
 * 라이트 모드를 기본으로 하며, 다크모드는 선택적으로 지원
 * 
 * @example
 * ```vue
 * <script setup>
 * const { isDark, toggleTheme } = useTheme()
 * 
 * // 다크모드 토글
 * toggleTheme()
 * </script>
 * ```
 */
export const useTheme = () => {
  // const prefersDark = usePreferredDark() // 시스템 다크 모드 감지 (현재 미사용)
  const isDark = ref(false) // 기본값: 라이트 모드

  // 로컬 스토리지에서 테마 설정 불러오기
  const loadTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        isDark.value = true
      } else if (savedTheme === 'light') {
        isDark.value = false
      } else {
        // 저장된 설정이 없으면 시스템 설정 따르기 (선택사항)
        // isDark.value = prefersDark.value
        isDark.value = false // 기본값: 라이트 모드
      }
    }
  }

  // HTML 요소에 dark 클래스 추가/제거
  const updateTheme = (dark: boolean) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      if (dark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // 테마 변경 감지
  watch(isDark, (newValue) => {
    updateTheme(newValue)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
    }
  })

  // 테마 토글
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 라이트 모드로 설정
  const setLight = () => {
    isDark.value = false
  }

  // 다크 모드로 설정
  const setDark = () => {
    isDark.value = true
  }

  // 초기화
  onMounted(() => {
    loadTheme()
    updateTheme(isDark.value)
  })

  return {
    isDark,
    toggleTheme,
    setLight,
    setDark,
  }
}

