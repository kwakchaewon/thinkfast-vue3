<template>
  <v-layout class="rounded rounded-md">
    <!-- 사이드바 -->
    <v-navigation-drawer
      permanent
      color="grey-lighten-4"
      width="280"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="userName"
          :subtitle="userEmail"
          class="profile-item"
        >
          <template v-slot:append>
            <div class="d-flex align-center">
              <v-badge
                :content="notifications.length.toString()"
                :model-value="notifications.length > 0"
                color="error"
                offset-x="12"
              >
                <v-btn
                  icon="mdi-bell"
                  variant="text"
                  @click="showNotifications = true"
                  class="notification-btn"
                >
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </v-badge>
            </div>

            <!-- 알림 메뉴 -->
            <v-menu
              v-model="showNotifications"
              :close-on-content-click="false"
              location="bottom end"
              offset="10"
            >
              <v-card min-width="300" max-width="400" class="notification-menu">
                <div class="d-flex align-center px-4 py-2 bg-grey-lighten-4">
                  <span class="text-h6">알림</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    density="compact"
                    size="small"
                    @click="showNotifications = false"
                  >
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-divider></v-divider>
                <v-list>
                  <v-list-subheader class="d-flex align-center px-4">
                    <v-btn
                      variant="text"
                      density="compact"
                      color="primary"
                      class="text-caption px-0"
                      @click="markAllAsRead"
                    >
                      모두 읽음 처리
                    </v-btn>
                  </v-list-subheader>
                  <v-list-item
                    v-for="notification in notifications"
                    :key="notification.id"
                    :subtitle="notification.time"
                    class="py-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="notification.color" size="36">
                        <v-icon color="white" size="small">
                          {{ notification.icon }}
                        </v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2 mb-1">
                      {{ notification.title }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="notifications.length === 0">
                    <v-list-item-title class="text-center text-subtitle-1 py-4">
                      새로운 알림이 없습니다
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="대시보드"
          value="dashboard"
          active
        ></v-list-item>
        
        <v-list-subheader>설문 관리</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-plus"
          title="새 설문 만들기"
          value="create"
          to="/create-survey"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-poll"
          title="내 설문"
          value="my-surveys"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-vote"
          title="참여 가능한 설문"
          value="available"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-subheader>분석</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-chart-box"
          title="설문 결과"
          value="results"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-chart-timeline-variant"
          title="인사이트"
          value="insights"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>
        
        <v-list-item
          prepend-icon="mdi-logout"
          title="로그아웃"
          value="logout"
          @click="handleLogout"
          class="logout-item"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list-item class="copyright-item">
        <v-list-item-title class="text-caption text-grey">
          © 2024 Andrew Kwak. All rights reserved.
        </v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <!-- 메인 컨텐츠 -->
    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pb-16">
        <!-- 상단 통계 카드 -->
        <v-row>
          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">진행중인 설문</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">3</span>
                  <v-icon color="success" class="ms-3">mdi-trending-up</v-icon>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">총 응답수</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">247</span>
                  <v-chip color="success" size="small" class="ms-3">+12%</v-chip>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">평균 응답률</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">82%</span>
                  <v-icon color="info" class="ms-3">mdi-information</v-icon>
                </div>
              </v-card-item>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card">
              <v-card-item>
                <v-card-title class="text-subtitle-1 mb-2">새로운 인사이트</v-card-title>
                <div class="d-flex align-center">
                  <span class="text-h4">5</span>
                  <v-chip color="warning" size="small" class="ms-3">New</v-chip>
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
                <v-btn variant="text" color="primary" size="small">
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
                          :color="survey.isActive ? 'success' : 'error'"
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter } from 'vue-router'
import { recentSurvey } from '@/interfaces/surveyInterface'

interface Notification {
  id: number
  title: string
  time: string
  icon: string
  color: string
}

export default defineComponent({
  name: 'MainView',
  components: {
    // AppFooter
  },
  setup() {
    const router = useRouter()
    const { showSuccess, showError } = useSnackbar()
    const userName = ref('Andrew Kwak')
    const userEmail = ref('andrew@example.com')
    const showNotifications = ref(false)
    const recentSurveys = ref<recentSurvey[]>([])
    const isLoading = ref(false)
    const ws = ref<WebSocket | null>(null)

    const notifications = ref<Notification[]>([])

    const connectWebSocket = () => {
      const username = localStorage.getItem('username') || 'user'
      const wsUrl = `ws://localhost:8080/alarm/${username}`
      console.log('Connecting to WebSocket:', wsUrl)
      
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('WebSocket connection established')
      }

      ws.value.onmessage = (event: MessageEvent) => {
        console.log('Received message:', event.data)
        try {
          let message: string
          // 메시지가 JSON인지 확인
          if (event.data.startsWith('{') || event.data.startsWith('[')) {
            const notification = JSON.parse(event.data)
            message = notification.message || notification
          } else {
            message = event.data
          }
          
          console.log('Processed message:', message)
          
          // 새로운 알림을 배열의 맨 앞에 추가
          notifications.value.unshift({
            id: Date.now(),
            title: message,
            time: '방금 전',
            icon: 'mdi-bell',
            color: 'primary'
          })
          
          // 알림이 추가되었음을 콘솔에 로깅
          console.log('Notification added:', notifications.value[0])
          
          // 알림 배지 업데이트를 위해 강제로 리렌더링
          showNotifications.value = false
          setTimeout(() => {
            showNotifications.value = true
          }, 100)
        } catch (error) {
          console.error('Error processing notification:', error)
        }
      }

      ws.value.onerror = (error: Event) => {
        console.error('WebSocket error:', error)
        console.log('WebSocket readyState:', ws.value?.readyState)
        showError('알림 서버와의 연결에 실패했습니다.')
      }

      ws.value.onclose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event.code, event.reason)
        // 연결이 끊어진 경우 3초 후 재연결 시도
        setTimeout(() => {
          if (ws.value?.readyState === WebSocket.CLOSED) {
            console.log('Attempting to reconnect...')
            connectWebSocket()
          }
        }, 3000)
      }
    }

    const fetchRecentSurveys = async () => {
      try {
        isLoading.value = true
        const response = await surveyApi.getRecentSurveys()
        console.log(response)
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
      connectWebSocket()
    })

    onUnmounted(() => {
      if (ws.value) {
        ws.value.close()
      }
    })

    const markAllAsRead = () => {
      notifications.value = []
      showNotifications.value = false
    }

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

    const handleLogout = async () => {
      try {
        await authApi.logout()
        showSuccess('로그아웃에 성공했습니다.')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const goToSurveyDetail = (surveyId: number) => {
      router.push(`/survey/${surveyId}`)
    }

    return {
      userName,
      userEmail,
      notifications,
      showNotifications,
      markAllAsRead,
      recentSurveys,
      recentActivities,
      handleLogout,
      isLoading,
      goToSurveyDetail
    }
  }
})
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}

.profile-item {
  min-height: 72px;
  padding: 12px 16px;
}

.profile-item :deep(.v-list-item__prepend) {
  padding-right: 16px;
}

.notification-btn {
  margin-left: 8px;
}

.notification-menu {
  margin-top: 8px;
}

.v-list-item-title {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stat-card {
  height: 100%;
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

.logout-item {
  margin-top: auto;
  color: #FF5252;
}

.logout-item :deep(.v-list-item__prepend) {
  color: #FF5252;
}

.copyright-item {
  padding: 8px 16px;
  opacity: 0.7;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: grey-lighten-4;
}

.survey-row {
  cursor: pointer;
}

.survey-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style> 