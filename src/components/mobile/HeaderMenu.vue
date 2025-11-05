<template>
  <div class="flex h-screen">
    <!-- 모바일: AppBar + 상단 드로어 메뉴 -->
    <div v-if="isMobile" class="w-full">
      <!-- 모바일 헤더 -->
      <header
        class="fixed top-0 left-0 right-0 z-50 bg-slate-200 shadow-sm transition-transform duration-300"
        :class="{ '-translate-y-full': !isHeaderVisible }"
      >
        <div class="flex items-center h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            class="h-10 w-10"
            :class="{ 'bg-slate-300': menuOpen }"
            @click="menuOpen = !menuOpen"
          >
            <Menu class="h-5 w-5" />
          </Button>
          <span class="ml-4 text-xl font-bold">ThinkFast</span>
        </div>
      </header>

      <!-- 드로어 메뉴 -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="-translate-y-full"
      >
        <div
          v-if="menuOpen"
          class="fixed top-16 left-0 right-0 z-40 bg-white shadow-lg w-full"
        >
          <nav class="py-2">
            <router-link
              to="/"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <LayoutDashboard class="h-5 w-5" />
              대시보드
            </router-link>
            <router-link
              to="/create-survey"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <Plus class="h-5 w-5" />
              새 설문 만들기
            </router-link>
            <router-link
              to="/all-surveys"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <BarChart3 class="h-5 w-5" />
              전체 설문
            </router-link>
            <a
              href="#"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <BarChart3 class="h-5 w-5" />
              내 설문
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <Vote class="h-5 w-5" />
              참여 가능한 설문
            </a>
            <Separator class="my-2" />
            <a
              href="#"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <BarChart3 class="h-5 w-5" />
              설문 결과
            </a>
            <a
              href="#"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors"
              @click="menuOpen = false"
            >
              <TrendingUp class="h-5 w-5" />
              인사이트
            </a>
            <Separator class="my-2" />
            <button
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-100 transition-colors w-full text-left"
              @click="handleLogout"
            >
              <LogOut class="h-5 w-5" />
              로그아웃
            </button>
          </nav>
        </div>
      </Transition>

      <!-- 모바일 메인 컨텐츠 -->
      <main class="pt-16 min-h-screen bg-slate-100">
        <slot />
      </main>
    </div>

    <!-- 데스크톱: 고정 사이드바 + 메인 컨텐츠 -->
    <template v-else>
      <Sidebar />
      <main class="flex-1 ml-[280px] bg-slate-100 min-h-screen">
        <slot />
      </main>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBreakpoints } from '@vueuse/core'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import Sidebar from '@/components/common/Sidebar.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Menu,
  LayoutDashboard,
  Plus,
  BarChart3,
  Vote,
  TrendingUp,
  LogOut,
} from 'lucide-vue-next'

const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024,
})

const isMobile = computed(() => breakpoints.smaller('sm').value)
const menuOpen = ref(false)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)

const { showSuccess } = useSnackbar()

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY > lastScrollY.value && currentScrollY > 80) {
    // 아래로 스크롤 && 80px 이상 스크롤시 헤더 숨김
    isHeaderVisible.value = false
  } else if (currentScrollY < lastScrollY.value || currentScrollY <= 80) {
    // 위로 스크롤하거나 상단 근처에 있으면 헤더 보임
    isHeaderVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

// 로그아웃 핸들러
const handleLogout = async () => {
  try {
    await authApi.logout()
    showSuccess('로그아웃에 성공했습니다.')
    menuOpen.value = false
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

onMounted(() => {
  if (isMobile.value) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (isMobile.value) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
/* 스크롤 가능한 body */
:global(body) {
  overflow-y: auto !important;
  height: auto !important;
}

:global(html) {
  overflow-y: auto !important;
  height: auto !important;
}
</style>
