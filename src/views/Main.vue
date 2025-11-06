<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- 상단 통계 카드 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="p-6">
              <CardTitle class="text-sm font-medium text-gray-500 mb-2">
                진행중 설문
              </CardTitle>
              <div class="flex items-center">
                <span class="text-3xl font-semibold text-gray-800">{{ activeSurveysCount }}</span>
                <TrendingUp class="ml-3 h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
          </Card>

          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="p-6">
              <CardTitle class="text-sm font-medium text-gray-500 mb-2">
                총 응답수
              </CardTitle>
              <div class="flex items-center">
                <span class="text-3xl font-semibold text-gray-800">{{ totalResponses }}</span>
                <Reply class="ml-3 h-6 w-6 text-primary-400" />
              </div>
            </CardHeader>
          </Card>

          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="p-6">
              <CardTitle class="text-sm font-medium text-gray-500 mb-2">
                최근 7일 응답
              </CardTitle>
              <div class="flex items-center">
                <span class="text-3xl font-semibold text-gray-800">{{ recentResponses }}</span>
                <Badge variant="secondary" class="ml-3 bg-green-100 text-green-700">
                  +{{ recentResponseIncrease }}%
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="p-6">
              <CardTitle class="text-sm font-medium text-gray-500 mb-2">
                평균 응답 시간
              </CardTitle>
              <div class="flex items-center">
                <span class="text-3xl font-semibold text-gray-800">{{ avgResponseTime }}분</span>
                <Clock class="ml-3 h-6 w-6 text-primary-400" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <!-- 최근 설문 & 활동 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div class="md:col-span-2">
            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <CardTitle class="text-lg font-semibold text-gray-800">최근 설문</CardTitle>
                <Button variant="ghost" size="sm" as-child class="text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                  <router-link to="/all-surveys" class="flex items-center gap-1">
                    전체보기
                    <ChevronRight class="h-4 w-4" />
                  </router-link>
                </Button>
              </CardHeader>
              <CardContent class="p-6">
                <div class="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow class="hover:bg-transparent">
                        <TableHead class="text-gray-600 font-medium">설문 제목</TableHead>
                        <TableHead class="w-[100px] text-gray-600 font-medium">상태</TableHead>
                        <TableHead class="w-[100px] text-gray-600 font-medium">응답수</TableHead>
                        <TableHead class="w-[120px] text-gray-600 font-medium">생성일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="survey in recentSurveys"
                        :key="survey.id"
                        class="cursor-pointer hover:bg-gray-50 transition-colors"
                        @click="goToSurveyDetail(survey.id)"
                      >
                        <TableCell class="font-medium text-gray-800">{{ survey.title }}</TableCell>
                        <TableCell>
                          <Badge
                            :variant="survey.isActive === true ? 'default' : 'destructive'"
                            :class="survey.isActive === true ? 'bg-primary-400 text-white' : ''"
                          >
                            {{ survey.isActive === true ? '진행중' : '종료' }}
                          </Badge>
                        </TableCell>
                        <TableCell class="text-gray-600">{{ survey.responseCount }}개</TableCell>
                        <TableCell class="text-gray-600">{{ survey.createdAt }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="md:col-span-1">
            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <CardTitle class="text-lg font-semibold text-gray-800">최근 활동</CardTitle>
                <Button variant="ghost" size="sm" class="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                  더보기
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent class="p-6">
                <div class="space-y-4">
                  <div
                    v-for="(activity, index) in recentActivities"
                    :key="activity.id"
                    class="relative flex gap-4 pb-4 last:pb-0"
                    :class="{ 'border-l-2 border-gray-200 pl-4': index < recentActivities.length - 1 }"
                  >
                    <div
                      class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                      :class="{
                        'bg-green-500': activity.color === 'success',
                        'bg-primary-400': activity.color === 'info',
                        'bg-yellow-500': activity.color === 'warning',
                        'bg-red-500': activity.color === 'error',
                      }"
                    ></div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-800 mb-1">
                        {{ activity.title }}
                      </div>
                      <div class="text-xs text-gray-500">
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
/* 추가 스타일이 필요한 경우 */
</style>
