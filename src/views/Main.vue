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
      <v-container fluid class="pb-16">
        <!-- 상단 통계 카드 -->
        <v-row>
          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">진행중 설문</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">{{ activeSurveysCount }}</span>
                  <v-icon color="success" class="ms-3">mdi-chart-line</v-icon>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">총 응답수</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">{{ totalResponses }}</span>
                  <v-icon color="primary" class="ms-3">mdi-message-reply</v-icon>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">최근 7일 응답</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">{{ recentResponses }}</span>
                  <v-chip color="success" size="small" class="ms-3">+{{ recentResponseIncrease }}%</v-chip>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">평균 응답 시간</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">{{ avgResponseTime }}분</span>
                  <v-icon color="info" class="ms-3">mdi-clock-outline</v-icon>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <!-- 최근 설문 & 활동 -->
        <v-row class="mt-4">
          <v-col cols="12" md="8">
            <v-card class="content-card">
              <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
                <span class="text-h6">최근 설문</span>
                <v-spacer></v-spacer>
                <v-btn 
                  variant="text" 
                  color="primary" 
                  size="small"
                  to="/all-surveys"
                >
                  전체보기
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-subtitle-2">설문 제목</th>
                      <th class="text-subtitle-2" width="100">상태</th>
                      <th class="text-subtitle-2" width="100">응답수</th>
                      <th class="text-subtitle-2" width="120">생성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="survey in recentSurveys" 
                      :key="survey.id"
                      class="survey-row"
                      @click="goToSurveyDetail(survey.id)"
                    >
                      <td class="text-body-1">{{ survey.title }}</td>
                      <td>
                        <v-chip
                          :color="survey.isActive === true ? 'success' : 'error'"
                          size="small"
                          class="font-weight-medium"
                        >
                          {{ survey.isActive === true ? '진행중' : '종료' }}
                        </v-chip>
                      </td>
                      <td class="text-body-1">{{ survey.responseCount }}개</td>
                      <td class="text-body-1">{{ survey.createdAt }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="content-card">
              <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
                <span class="text-h6">최근 활동</span>
                <v-spacer></v-spacer>
                <v-btn variant="text" color="primary" size="small">
                  더보기
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-timeline density="compact" align="start" class="mt-2">
                  <v-timeline-item
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    :dot-color="activity.color"
                    size="small"
                    class="pb-2"
                  >
                    <div class="text-body-1 font-weight-medium mb-1">
                      {{ activity.title }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ activity.time }}
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter } from 'vue-router'
import { recentSurvey } from '@/interfaces/surveyInterface'
import Sidebar from '@/components/common/Sidebar.vue'
import { useDisplay } from 'vuetify'
import { authApi } from '@/apis/authApi'

export default defineComponent({
  name: 'MainView',
  components: {
    Sidebar
  },
  setup() {
    const router = useRouter()
    const { showError, showSuccess } = useSnackbar()
    const { smAndDown } = useDisplay()
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

    const recentSurveys = ref<recentSurvey[]>([])
    const isLoading = ref(false)

    const fetchRecentSurveys = async () => {
      try {
        isLoading.value = true
        const response = await surveyApi.getRecentSurveys()
        recentSurveys.value = response.data
      } catch (error) {
        console.error('Failed to fetch recent surveys:', error)
        showError('최근 설문 목록을 불러오는데 실패했습니다.')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchRecentSurveys()
    })

    const recentActivities = ref([
      {
        id: 1,
        title: '새로운 설문 응답 5개 도착',
        time: '10분 전',
        color: 'success'
      },
      {
        id: 2,
        title: '설문 분석 완료',
        time: '1시간 전',
        color: 'info'
      },
      {
        id: 3,
        title: '새로운 인사이트 발견',
        time: '2시간 전',
        color: 'warning'
      },
      {
        id: 4,
        title: '설문 마감 예정',
        time: '3시간 전',
        color: 'error'
      }
    ])

    const goToSurveyDetail = (surveyId: number) => {
      router.push(`/survey/${surveyId}`)
    }

    const activeSurveysCount = computed(() => {
      return recentSurveys.value.filter(survey => survey.isActive).length
    })

    const totalResponses = computed(() => {
      return recentSurveys.value.reduce((sum, survey) => sum + survey.responseCount, 0)
    })

    const recentResponses = computed(() => {
      // 최근 7일간의 응답 수를 계산하는 로직
      return recentSurveys.value.reduce((sum, survey) => {
        const surveyDate = new Date(survey.createdAt)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        if (surveyDate >= sevenDaysAgo) {
          return sum + survey.responseCount
        }
        return sum
      }, 0)
    })

    const recentResponseIncrease = computed(() => {
      // 이전 7일 대비 응답 증가율 계산
      const currentResponses = recentResponses.value
      const previousResponses = recentSurveys.value.reduce((sum, survey) => {
        const surveyDate = new Date(survey.createdAt)
        const fourteenDaysAgo = new Date()
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        if (surveyDate >= fourteenDaysAgo && surveyDate < sevenDaysAgo) {
          return sum + survey.responseCount
        }
        return sum
      }, 0)

      if (previousResponses === 0) return 0
      return Math.round(((currentResponses - previousResponses) / previousResponses) * 100)
    })

    const avgResponseTime = computed(() => {
      // 설문별 평균 응답 시간 계산 (예시로 10분 고정)
      return 10
    })

    return {
      recentSurveys,
      recentActivities,
      isLoading,
      goToSurveyDetail,
      activeSurveysCount,
      totalResponses,
      recentResponses,
      recentResponseIncrease,
      avgResponseTime,
      isMobile,
      menuOpen,
      handleLogout
    }
  }
})
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}

.stat-card {
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.stat-card .v-card-item {
  height: 100px;
  padding: 16px;
}

.stat-card .v-card-title {
  opacity: 0.7;
}

.content-card {
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.content-card .v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-timeline-item:last-child {
  padding-bottom: 0 !important;
}

.survey-row {
  cursor: pointer;
}

.survey-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
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