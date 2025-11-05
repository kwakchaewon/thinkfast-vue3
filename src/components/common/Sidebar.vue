<template>
  <!-- 데스크톱 고정 사이드바 -->
  <aside class="fixed left-0 top-0 h-screen w-[280px] bg-slate-100 dark:bg-slate-900 border-r border-border flex flex-col z-40">
    <!-- 프로필 섹션 -->
    <div class="p-4 border-b border-border">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 flex-1 min-h-[72px]">
          <Avatar class="h-12 w-12">
            <AvatarImage src="https://randomuser.me/api/portraits/men/85.jpg" alt="Profile" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ userName }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ userEmail }}</p>
          </div>
        </div>
        
        <!-- 알림 버튼 -->
        <DropdownMenu v-model:open="showNotifications">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="relative">
              <Bell class="h-5 w-5" />
              <Badge
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {{ unreadCount }}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-[300px] sm:w-[400px]">
            <div class="flex items-center justify-between px-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-t-md">
              <h3 class="text-lg font-semibold">알림</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground hidden sm:inline">최신 30일 간 알림이 표시됩니다</span>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6"
                  @click="showNotifications = false"
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            
            <!-- 모두 읽음 처리 버튼 -->
            <div v-if="hasUnread" class="px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                class="text-xs text-primary h-7 px-2"
                @click="markAllAsRead"
              >
                모두 읽음 처리
              </Button>
            </div>
            
            <!-- 알림 목록 -->
            <div class="max-h-[400px] overflow-y-auto">
              <div v-if="paginatedNotifications.length === 0" class="p-4 text-center text-sm text-muted-foreground">
                새로운 알림이 없습니다
              </div>
              <div
                v-for="notification in paginatedNotifications"
                :key="notification.id"
                class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-border last:border-0"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex items-start gap-3">
                  <Avatar :class="`h-9 w-9 bg-${notification.color === 'primary' ? 'primary' : 'muted'}`">
                    <Bell class="h-5 w-5 text-white" />
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium mb-1 line-clamp-2 whitespace-pre-line">
                      {{ notification.title }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      🕒 {{ notification.time }} • {{ notification.isRead ? '읽음' : '읽지 않음' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 페이지네이션 -->
            <div v-if="notifications.length > 0" class="flex items-center justify-center gap-2 p-2 border-t border-border">
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="text-xs text-muted-foreground">{{ currentPage }} / {{ totalPages }}</span>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- 네비게이션 메뉴 -->
    <nav class="flex-1 overflow-y-auto py-2">
      <div class="space-y-1 px-2">
        <router-link
          to="/"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="$route.path === '/' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-foreground hover:bg-slate-200 dark:hover:bg-slate-800'"
        >
          <LayoutDashboard class="h-5 w-5" />
          대시보드
        </router-link>
      </div>

      <Separator class="my-2" />

      <div class="px-2">
        <h3 class="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">설문 관리</h3>
        <div class="space-y-1">
          <router-link
            to="/create-survey"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <Plus class="h-5 w-5" />
            새 설문 만들기
          </router-link>
          <a
            href="#"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground"
          >
            <BarChart3 class="h-5 w-5" />
            내 설문
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground"
          >
            <Vote class="h-5 w-5" />
            참여 가능한 설문
          </a>
        </div>
      </div>

      <Separator class="my-2" />

      <div class="px-2">
        <h3 class="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">분석</h3>
        <div class="space-y-1">
          <a
            href="#"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground"
          >
            <BarChart3 class="h-5 w-5" />
            설문 결과
          </a>
          <a
            href="#"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground"
          >
            <TrendingUp class="h-5 w-5" />
            인사이트
          </a>
        </div>
      </div>

      <Separator class="my-2" />

      <div class="px-2">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 text-destructive w-full"
        >
          <LogOut class="h-5 w-5" />
          로그아웃
        </button>
      </div>
    </nav>

    <!-- Copyright -->
    <div class="p-4 border-t border-border">
      <p class="text-xs text-muted-foreground text-center">
        © 2024 Andrew Kwak. All rights reserved.
      </p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import tbAxios from "@/apis/axios.ts"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  Vote,
  TrendingUp,
  LogOut,
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

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

const router = useRouter()
const { showSuccess, showError } = useSnackbar()
const userName = ref('Andrew Kwak')
const userEmail = ref('andrew@example.com')
const showNotifications = ref(false)
const notifications = ref<Notification[]>([])
const ws = ref<WebSocket | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

const totalPages = computed(() => {
  return Math.ceil(notifications.value.length / itemsPerPage)
})

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return notifications.value.slice(start, end)
})

const unreadCount = computed(() => {
  return notifications.value.filter((n: Notification) => !n.isRead).length
})

const hasUnread = computed(() => {
  return unreadCount.value > 0
})

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
    const maxLen = 13;
    const truncatedTitle = notification.surveyTitle.length > maxLen
      ? notification.surveyTitle.substring(0, maxLen) + '...'
      : notification.surveyTitle;
    return `📢 [응답 알림] "${truncatedTitle}"
새로운 응답이 도착했습니다. (총 ${notification.alarmCount}건의 응답)`;
  }
  if (notification.type === 'SURVEY_EXPIRED') {
    const maxLen = 13;
    const truncatedTitle = notification.surveyTitle.length > maxLen
      ? notification.surveyTitle.substring(0, maxLen) + '...'
      : notification.surveyTitle;
    return `📢 [설문 종료] "${truncatedTitle}"
설문이 종료 됐습니다. (총 ${notification.alarmCount}건의 응답)`;
  }
  return `알림: ${notification.type}`
}

const fetchInitialNotifications = async () => {
  try {
    console.log('Fetching initial notifications...')
    const response = await tbAxios.get('http://localhost:8080/notification')
    
    if (response.data.data && Array.isArray(response.data.data)) {
      const processedNotifications = response.data.data.map((notification: any) => {
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
        return processed
      })
      
      notifications.value = processedNotifications
      resetPagination()
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
    const unreadSurveyIds = notifications.value
      .filter((notification: Notification) => !notification.isRead)
      .map((notification: Notification) => notification.surveyId)
    
    if (unreadSurveyIds.length > 0) {
      console.log('Marking notifications as read for surveyIds:', unreadSurveyIds)
      await tbAxios.post('http://localhost:8080/notification/read', unreadSurveyIds)
      
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
  if (notification.type === 'SURVEY_RESPONSE' || notification.type === 'SURVEY_EXPIRED') {
    try {
      await tbAxios.post('http://localhost:8080/notification/read', [notification.surveyId])
      await fetchInitialNotifications()
      await router.replace(`/survey/${notification.surveyId}`)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      showError('알림 읽음 처리에 실패했습니다.')
    }
  }
}

const resetPagination = () => {
  currentPage.value = 1
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
