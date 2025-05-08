<template>
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
              :content="notifications.filter(n => !n.isRead).length.toString()"
              :model-value="notifications.filter(n => !n.isRead).length > 0"
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
                <v-list-subheader 
                  v-if="notifications.some(n => !n.isRead)"
                  class="d-flex align-center px-4"
                >
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
                  :subtitle="`🕒 ${notification.time}  •  ${notification.isRead ? '읽음' : '읽지 않음'}`"
                  class="py-2 notification-item"
                  @click="handleNotificationClick(notification)"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="notification.color" size="36">
                      <v-icon color="white" size="small">
                        {{ notification.icon }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-subtitle-2 mb-1 notification-title">
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import axios from 'axios'
import tbAxios from "@/apis/axios.ts";

interface Notification {
  id: number
  title: string
  time: string
  icon: string
  color: string
  isRead: boolean
  type: string
  surveyId: number
  surveyTitle: string
  createdAt: string
  alarmCount: number
}

interface RawNotification {
  type: string
  surveyId: number
  surveyTitle: string
  isRead: boolean
  createdAt: string
  alarmCount: number
}

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const { showSuccess, showError } = useSnackbar()
    const userName = ref('Andrew Kwak')
    const userEmail = ref('andrew@example.com')
    const showNotifications = ref(false)
    const notifications = ref<Notification[]>([])
    const ws = ref<WebSocket | null>(null)

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      if (diffInMinutes < 1) return '방금 전'
      if (diffInMinutes < 60) return `${diffInMinutes}분 전`
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}시간 전`
      
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}일 전`
    }

    const formatNotificationTitle = (notification: RawNotification) => {
      if (notification.type === 'SURVEY_RESPONSE') {
        const truncatedTitle = notification.surveyTitle.length > 20 
          ? notification.surveyTitle.substring(0, 20) + '...'
          : notification.surveyTitle
        return `📢 [설문 응답] "${truncatedTitle}"에\n새로운 응답이 도착했습니다. (총 ${notification.alarmCount}건의 응답)`
      }
      return `알림: ${notification.type}`
    }

    const fetchInitialNotifications = async () => {
      try {
        console.log('Fetching initial notifications...')
        const response = await tbAxios.get('http://localhost:8080/notification')
        console.log('Raw response:', response)
        console.log('Response data:', response.data)
        
        if (response.data.data && Array.isArray(response.data.data)) {
          const processedNotifications = response.data.data.map((notification: any) => {
            console.log('Processing raw notification:', notification)
            const processed = {
              id: Date.now() + Math.random(),
              title: formatNotificationTitle(notification),
              time: formatTimeAgo(notification.createdAt),
              icon: 'mdi-bell',
              color: notification.isRead ? 'grey' : 'primary',
              isRead: notification.isRead,
              type: notification.type,
              surveyId: notification.surveyId,
              surveyTitle: notification.surveyTitle,
              createdAt: notification.createdAt,
              alarmCount: notification.alarmCount
            }
            console.log('Processed notification:', processed)
            return processed
          })
          
          console.log('Final processed notifications:', processedNotifications)
          notifications.value = processedNotifications
          console.log('Current notifications value:', notifications.value)
        } else {
          console.error('Invalid response format:', response.data)
        }
      } catch (error) {
        console.error('Failed to fetch initial notifications:', error)
      }
    }

    const connectWebSocket = () => {
      const username = localStorage.getItem('username') || 'user'
      const wsUrl = `ws://localhost:8080/alarm/${username}`
      console.log('Connecting to WebSocket:', wsUrl)
      
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('WebSocket connection established')
      }

      ws.value.onmessage = (event: MessageEvent) => {
        console.log('Received WebSocket message:', event.data)
        try {
          const data = JSON.parse(event.data)
          console.log('Parsed WebSocket data:', data)
          
          if (data && Array.isArray(data)) {
            const processedNotifications = data.map((notification: any) => {
              console.log('Processing WebSocket notification:', notification)
              return {
                id: Date.now() + Math.random(),
                title: formatNotificationTitle(notification),
                time: formatTimeAgo(notification.createdAt),
                icon: 'mdi-bell',
                color: notification.isRead ? 'grey' : 'primary',
                isRead: notification.isRead,
                type: notification.type,
                surveyId: notification.surveyId,
                surveyTitle: notification.surveyTitle,
                createdAt: notification.createdAt,
                alarmCount: notification.alarmCount
              }
            })
            console.log('Processed WebSocket notifications:', processedNotifications)
            notifications.value = processedNotifications
          } else {
            console.log('Received empty or invalid WebSocket data, keeping existing notifications')
          }
        } catch (error) {
          console.error('Error processing WebSocket notification:', error)
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

    onMounted(async () => {
      await fetchInitialNotifications()
      connectWebSocket()
    })

    onUnmounted(() => {
      if (ws.value) {
        ws.value.close()
      }
    })

    const markAllAsRead = async () => {
      try {
        // 읽지 않은 알림들의 surveyId만 추출
        const unreadSurveyIds = notifications.value
          .filter((notification: Notification) => !notification.isRead)
          .map((notification: Notification) => notification.surveyId)
        
        if (unreadSurveyIds.length > 0) {
          console.log('Marking notifications as read for surveyIds:', unreadSurveyIds)
          await tbAxios.post('http://localhost:8080/notification/read', unreadSurveyIds)
          
          // 알림 목록 새로고침
          await fetchInitialNotifications()
          showSuccess('모든 알림을 읽음 처리했습니다.')
        } else {
          console.log('No unread notifications to mark as read')
        }
      } catch (error) {
        console.error('Failed to mark notifications as read:', error)
        showError('알림 읽음 처리에 실패했습니다.')
      }
    }

    const handleLogout = async () => {
      try {
        await authApi.logout()
        showSuccess('로그아웃에 성공했습니다.')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const handleNotificationClick = async (notification: Notification) => {
      if (notification.type === 'SURVEY_RESPONSE') {
        try {
          // 알림 읽음 처리 API 호출
          await tbAxios.post('http://localhost:8080/notification/read', [notification.surveyId])
          
          // 알림 목록 새로고침
          await fetchInitialNotifications()
          
          // 설문 페이지로 이동
          router.push(`/survey/${notification.surveyId}`)
        } catch (error) {
          console.error('Failed to mark notification as read:', error)
          showError('알림 읽음 처리에 실패했습니다.')
        }
      }
    }

    return {
      userName,
      userEmail,
      notifications,
      showNotifications,
      markAllAsRead,
      handleLogout,
      handleNotificationClick
    }
  }
})
</script>

<style scoped>
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

.notification-title {
  white-space: pre-line;
  line-height: 1.4;
}

.notification-item {
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style> 