import { computed } from 'vue'
import { useBreakpoints } from '@vueuse/core'

/**
 * 반응형 브레이크포인트 헬퍼 composable
 * Tailwind CSS breakpoint와 일치하도록 설정됨
 * 
 * @example
 * ```vue
 * <script setup>
 * const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive()
 * 
 * // 모바일일 때만 실행
 * if (isMobile.value) {
 *   // 모바일 로직
 * }
 * </script>
 * ```
 */
export const useResponsive = () => {
  const breakpoints = useBreakpoints({
    sm: 640,   // Small devices (landscape phones)
    md: 768,   // Medium devices (tablets)
    lg: 1024,  // Large devices (desktops)
    xl: 1280,  // Extra large devices (large desktops)
    '2xl': 1536, // 2X Extra large devices
  })

  // 현재 활성화된 브레이크포인트
  const breakpoint = computed(() => {
    if (breakpoints['2xl'].value) return '2xl'
    if (breakpoints.xl.value) return 'xl'
    if (breakpoints.lg.value) return 'lg'
    if (breakpoints.md.value) return 'md'
    if (breakpoints.sm.value) return 'sm'
    return 'xs'
  })

  // 디바이스 타입 감지
  const isMobile = computed(() => breakpoints.smaller('sm').value)
  const isTablet = computed(() => 
    breakpoints.between('sm', 'lg').value
  )
  const isDesktop = computed(() => breakpoints['lg'].value)

  // 특정 브레이크포인트 이상/이하 감지
  const isSmAndUp = computed(() => breakpoints['sm'].value)
  const isMdAndUp = computed(() => breakpoints['md'].value)
  const isLgAndUp = computed(() => breakpoints['lg'].value)
  const isXlAndUp = computed(() => breakpoints['xl'].value)

  // 특정 브레이크포인트 사이 감지
  const isBetweenSmAndMd = computed(() => 
    breakpoints.between('sm', 'md').value
  )
  const isBetweenMdAndLg = computed(() => 
    breakpoints.between('md', 'lg').value
  )
  const isBetweenLgAndXl = computed(() => 
    breakpoints.between('lg', 'xl').value
  )

  return {
    // 현재 브레이크포인트
    breakpoint,
    
    // 디바이스 타입
    isMobile,
    isTablet,
    isDesktop,
    
    // 브레이크포인트 이상/이하
    isSmAndUp,
    isMdAndUp,
    isLgAndUp,
    isXlAndUp,
    
    // 브레이크포인트 사이
    isBetweenSmAndMd,
    isBetweenMdAndLg,
    isBetweenLgAndXl,
    
    // 원본 breakpoints 객체 (고급 사용)
    breakpoints,
  }
}

/**
 * 단순한 breakpoint 감지 composable
 * 특정 breakpoint만 필요한 경우 사용
 * 
 * @param breakpoint - 감지할 breakpoint ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @returns 해당 breakpoint 이상인지 여부
 * 
 * @example
 * ```vue
 * <script setup>
 * const isMd = useBreakpoint('md')
 * 
 * if (isMd.value) {
 *   // md 이상일 때 실행
 * }
 * </script>
 * ```
 */
export const useBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
  const breakpoints = useBreakpoints({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  })

  return computed(() => breakpoints[breakpoint].value)
}

