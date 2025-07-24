<template>
  <v-layout class="rounded rounded-md">
    <!-- 모바일: AppBar + 상단 block 메뉴만 (Sidebar 절대 렌더링 안함) -->
    <div v-if="isMobile">
      <v-app-bar color="#e0e3e8" flat app>
        <v-app-bar-nav-icon @click="menuOpen = !menuOpen" :class="{ 'menu-active': menuOpen }" />
        <v-toolbar-title class="font-weight-bold">ThinkFast</v-toolbar-title>
      </v-app-bar>
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
    <v-main class="bg-grey-lighten-3">
      <slot />
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
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

    return {
      isMobile,
      menuOpen,
      handleLogout
    }
  }
})
</script>

<style scoped>
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