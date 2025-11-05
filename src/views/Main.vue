<template>
  <HeaderMenu>
    <div class="container mx-auto px-4 pb-16">
      <!-- 상단 통계 카드 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card class="stat-card">
          <CardHeader>
            <CardTitle class="text-sm font-medium text-muted-foreground mb-2">
              진행중 설문
            </CardTitle>
            <div class="flex items-center">
              <span class="text-3xl font-semibold">{{ activeSurveysCount }}</span>
              <TrendingUp class="ml-3 h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
        </Card>

        <Card class="stat-card">
          <CardHeader>
            <CardTitle class="text-sm font-medium text-muted-foreground mb-2">
              총 응답수
            </CardTitle>
            <div class="flex items-center">
              <span class="text-3xl font-semibold">{{ totalResponses }}</span>
              <Reply class="ml-3 h-6 w-6 text-primary" />
            </div>
          </CardHeader>
        </Card>

        <Card class="stat-card">
          <CardHeader>
            <CardTitle class="text-sm font-medium text-muted-foreground mb-2">
              최근 7일 응답
            </CardTitle>
            <div class="flex items-center">
              <span class="text-3xl font-semibold">{{ recentResponses }}</span>
              <Badge variant="secondary" class="ml-3">
                +{{ recentResponseIncrease }}%
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card class="stat-card">
          <CardHeader>
            <CardTitle class="text-sm font-medium text-muted-foreground mb-2">
              평균 응답 시간
            </CardTitle>
            <div class="flex items-center">
              <span class="text-3xl font-semibold">{{ avgResponseTime }}분</span>
              <Clock class="ml-3 h-6 w-6 text-blue-500" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <!-- 최근 설문 & 활동 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="md:col-span-2">
          <Card class="content-card">
            <CardHeader class="flex flex-row items-center justify-between px-4 py-3 bg-slate-100 border-b">
              <CardTitle class="text-lg font-semibold">최근 설문</CardTitle>
              <Button variant="ghost" size="sm" as-child>
                <router-link to="/all-surveys" class="flex items-center gap-1">
                  전체보기
                  <ChevronRight class="h-4 w-4" />
                </router-link>
              </Button>
            </CardHeader>
            <CardContent class="p-4">
              <div class="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>설문 제목</TableHead>
                      <TableHead class="w-[100px]">상태</TableHead>
                      <TableHead class="w-[100px]">응답수</TableHead>
                      <TableHead class="w-[120px]">생성일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="survey in recentSurveys"
                      :key="survey.id"
                      class="survey-row cursor-pointer hover:bg-slate-50"
                      @click="goToSurveyDetail(survey.id)"
                    >
                      <TableCell class="font-medium">{{ survey.title }}</TableCell>
                      <TableCell>
                        <Badge
                          :variant="survey.isActive === true ? 'default' : 'destructive'"
                        >
                          {{ survey.isActive === true ? '진행중' : '종료' }}
                        </Badge>
                      </TableCell>
                      <TableCell>{{ survey.responseCount }}개</TableCell>
                      <TableCell>{{ survey.createdAt }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="md:col-span-1">
          <Card class="content-card">
            <CardHeader class="flex flex-row items-center justify-between px-4 py-3 bg-slate-100 border-b">
              <CardTitle class="text-lg font-semibold">최근 활동</CardTitle>
              <Button variant="ghost" size="sm" class="flex items-center gap-1">
                더보기
                <ChevronRight class="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent class="p-4">
              <div class="space-y-4 mt-2">
                <div
                  v-for="(activity, index) in recentActivities"
                  :key="activity.id"
                  class="relative flex gap-4 pb-4 last:pb-0"
                  :class="{ 'border-l-2 border-slate-200 pl-4': index < recentActivities.length - 1 }"
                >
                  <div
                    class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    :class="{
                      'bg-green-500': activity.color === 'success',
                      'bg-blue-500': activity.color === 'info',
                      'bg-yellow-500': activity.color === 'warning',
                      'bg-red-500': activity.color === 'error',
                    }"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium mb-1">
                      {{ activity.title }}
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {{ activity.time }}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </HeaderMenu>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { recentSurvey } from '@/interfaces/surveyInterface'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  Reply,
  Clock,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()
const { showError } = useSnackbar()

const recentSurveys = ref<recentSurvey[]>([])
const isLoading = ref(false)

const fetchRecentSurveys = async () => {
  try {
    isLoading.value = true
    const response = await surveyApi.getRecentSurveys()
    recentSurveys.value = (response as any).data || response
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
  return recentSurveys.value.filter((survey: recentSurvey) => survey.isActive).length
})

const totalResponses = computed(() => {
  return recentSurveys.value.reduce((sum: number, survey: recentSurvey) => sum + survey.responseCount, 0)
})

const recentResponses = computed(() => {
  return recentSurveys.value.reduce((sum: number, survey: recentSurvey) => {
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
  const currentResponses = recentResponses.value
  const previousResponses = recentSurveys.value.reduce((sum: number, survey: recentSurvey) => {
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
  return 10
})
</script>

<style scoped>
.stat-card {
  min-height: 100px;
}

.content-card {
  min-height: 100%;
}
</style>
