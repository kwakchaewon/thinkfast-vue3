<template>
  <v-layout class="rounded rounded-md">
    <!-- 모바일: AppBar + 상단 block 메뉴만 (Sidebar 절대 렌더링 안함) -->
    <div v-if="isMobile">
      <div class="mobile-header" :class="{ 'header-hidden': !isHeaderVisible }">
        <div class="mobile-toolbar">
          <v-btn icon @click="menuOpen = !menuOpen" :class="{ 'menu-active': menuOpen }">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <span class="mobile-title font-weight-bold">ThinkFast</span>
        </div>
      </div>
      <v-slide-y-transition>
        <v-sheet v-if="menuOpen" class="mobile-header-bar elevation-1">
          <v-list nav>
            <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="대시보드" @click="menuOpen = false" />
            <v-list-item to="/create-survey" prepend-icon="mdi-plus" title="새 설문 만들기" @click="menuOpen = false" />
            <v-list-item to="/all-surveys" prepend-icon="mdi-poll" title="전체 설문" @click="menuOpen = false" />
            <v-list-item to="/my-surveys" prepend-icon="mdi-poll" title="내 설문" @click="menuOpen = false" />
            <v-list-item to="/available" prepend-icon="mdi-vote" title="참여 가능한 설문" @click="menuOpen = false" />
            <v-divider class="my-2" />
            <v-list-item to="/results" prepend-icon="mdi-chart-box" title="설문 결과" @click="menuOpen = false" />
            <v-list-item to="/insights" prepend-icon="mdi-chart-timeline-variant" title="인사이트" @click="menuOpen = false" />
            <v-divider class="my-2" />
            <v-list-item prepend-icon="mdi-logout" title="로그아웃" @click="handleLogout" />
          </v-list>
        </v-sheet>
      </v-slide-y-transition>
    </div>
    <!-- 데스크탑: 고정 사이드바만 (모바일에서는 절대 렌더링 안함) -->
    <Sidebar v-if="!isMobile" />
    <!-- 메인 컨텐츠 -->
    <v-main class="bg-grey-lighten-3" :class="{ 'mobile-main-content': isMobile }">
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import Sidebar from '@/components/common/Sidebar.vue'

export default defineComponent({
  name: 'HeaderMenu',
  components: {
    Sidebar
  },
  setup() {
    const { smAndDown } = useDisplay()
    const { showSuccess } = useSnackbar()
    const isMobile = computed(() => smAndDown.value)
    const menuOpen = ref(false)
    const isHeaderVisible = ref(true)
    const lastScrollY = ref(0)

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

    return {
      isMobile,
      menuOpen,
      isHeaderVisible,
      handleLogout
    }
  }
})
</script>

<style scoped>
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  background: #e0e3e8;
  transition: transform 0.3s ease-in-out;
}

.mobile-header.header-hidden {
  transform: translateY(-100%);
}

.mobile-toolbar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  background: #e0e3e8;
}

.mobile-title {
  margin-left: 16px;
  font-size: 1.25rem;
}

.mobile-main-content {
  padding-top: 64px !important;
  min-height: 100vh !important;
  overflow: visible !important;
}

/* 전체 페이지 스크롤 활성화 */
:global(body) {
  overflow-y: auto !important;
  height: auto !important;
}

:global(html) {
  overflow-y: auto !important;
  height: auto !important;
}

.mobile-header-bar {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
  left: 0;
  z-index: 10;
}

.menu-active {
  background: #d1d5db !important;
  border-radius: 50%;
}

@media (max-width: 600px) {
  .mobile-header-bar {
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    width: 100vw;
    left: 0;
  }
}
</style> 