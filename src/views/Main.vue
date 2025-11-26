<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="px-6 py-8">
        <!-- 상단 통계 카드 -->
        <div class="space-y-6">
          <!-- 기간별 인사이트 카드는 추후 사용 시 다시 활성화
          <Card class="shadow-md border border-gray-200 bg-white">
            <CardHeader class="p-6 border-b border-gray-100">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle class="text-lg font-semibold text-gray-900">
                    기간별 인사이트
                  </CardTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ rangeDescription }}
                  </p>
                </div>
                <div class="inline-flex rounded-full bg-gray-100 p-1">
                  <Button
                    v-for="option in rangeOptions"
                    :key="option"
                    :variant="selectedRange === option ? 'default' : 'ghost'"
                    size="sm"
                    class="rounded-full px-4 text-sm"
                    :class="selectedRange === option ? 'bg-primary-400 text-white hover:bg-primary-500' : 'text-gray-600 hover:text-gray-900'"
                    @click="selectedRange = option"
                  >
                    {{ rangeLabels[option] }}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="rounded-xl border border-gray-100 p-4">
                  <p class="text-xs uppercase tracking-wide text-gray-500">새로 생성된 설문</p>
                  <p class="mt-2 text-3xl font-semibold text-gray-900">{{ periodNewSurveys }}</p>
                  <p class="text-xs text-gray-500 mt-1">선택한 기간 기준</p>
                </div>
                <div class="rounded-xl border border-gray-100 p-4">
                  <p class="text-xs uppercase tracking-wide text-gray-500">응답 수</p>
                  <p class="mt-2 text-3xl font-semibold text-gray-900">{{ periodResponses }}건</p>
                  <p class="text-xs text-gray-500 mt-1">최근 입력된 응답 포함</p>
                </div>
                <div class="rounded-xl border border-gray-100 p-4">
                  <p class="text-xs uppercase tracking-wide text-gray-500">설문당 평균</p>
                  <p class="mt-2 text-3xl font-semibold text-gray-900">{{ periodAvgResponses }}건</p>
                  <p class="text-xs text-gray-500 mt-1">선택 기간 내 설문 기준</p>
                </div>
                <div class="rounded-xl border border-gray-100 p-4">
                  <p class="text-xs uppercase tracking-wide text-gray-500">활성 비율</p>
                  <p class="mt-2 text-3xl font-semibold text-gray-900">{{ periodActiveRate }}%</p>
                  <p class="text-xs text-gray-500 mt-1">활성 설문 / 전체 설문</p>
                </div>
              </div>
              <div class="mt-6">
                <div class="flex justify-between text-xs text-gray-500 mb-2">
                  <span>진행 중</span>
                  <span>{{ activeSurveysCount }} / {{ totalSurveys }}개</span>
                </div>
                <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    class="h-full bg-primary-400 transition-all"
                    :style="{ width: activeRate + '%' }"
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          -->

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="px-4 py-3 flex items-center justify-between">
                <CardTitle class="text-lg font-semibold text-gray-900">
                  응답 많은 설문 Top 3
                </CardTitle>
                <Badge variant="secondary" class="bg-gray-100 text-gray-600">
                  응답 높은 순
                </Badge>
              </CardHeader>
              <CardContent class="px-4 py-3">
                <div v-if="topSurveys.length > 0" class="space-y-2">
                  <div
                    v-for="(survey, index) in topSurveys"
                    :key="survey.id"
                    class="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 hover:border-primary-200 transition cursor-pointer"
                    @click="goToSurveyDetail(survey.id)"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base"
                        :class="medalClasses[index] || 'bg-primary-50 text-primary-500'"
                      >
                        {{ medalLabels[index] || (index + 1) }}
                      </div>
                      <div class="min-w-0">
                        <p class="font-medium text-gray-800 truncate">{{ survey.title }}</p>
                        <p class="text-xs text-gray-500 mt-1">생성일 {{ survey.createdAt }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-500">응답</p>
                      <p class="text-xl font-semibold text-gray-900">{{ survey.responseCount }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-8">
                  아직 응답 데이터가 없습니다.
                </div>
              </CardContent>
            </Card>

            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="px-4 py-3 flex items-center justify-between">
                <CardTitle class="text-lg font-semibold text-gray-900">
                  관심 필요한 설문
                </CardTitle>
                <Badge variant="secondary" class="bg-gray-100 text-gray-600">
                  응답 낮은 순
                </Badge>
              </CardHeader>
              <CardContent class="px-4 py-3">
                <div v-if="prioritySurveys.length > 0" class="space-y-2">
                  <div
                    v-for="survey in prioritySurveys"
                    :key="survey.id"
                    class="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 hover:border-primary-200 transition cursor-pointer"
                    @click="goToSurveyDetail(survey.id)"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full opacity-0"></div>
                      <div class="min-w-0">
                        <p class="font-medium text-gray-800 truncate">{{ survey.title }}</p>
                        <p class="text-xs text-gray-500 mt-1">생성일 {{ survey.createdAt }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-500">응답</p>
                      <p class="text-xl font-semibold text-gray-900">{{ survey.responseCount }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-8">
                  모든 설문이 안정적으로 운영 중입니다.
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        <!-- 최근 설문 & 활동 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div class="md:col-span-2">
            <Card class="shadow-md border border-gray-200 bg-white">
              <CardHeader class="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <CardTitle class="text-lg font-semibold text-gray-800">최근 설문</CardTitle>
                <Button 
                  v-if="recentSurveys.length > 0"
                  variant="ghost" 
                  size="sm" 
                  as-child 
                  class="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  <router-link to="/all-surveys" class="flex items-center gap-1">
                    전체보기
                    <ChevronRight class="h-4 w-4" />
                  </router-link>
                </Button>
              </CardHeader>
              <CardContent class="p-6 min-h-[400px] flex flex-col">
                <div v-if="recentSurveys.length > 0" class="overflow-x-auto flex-1">
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
                <div v-else class="flex-1 flex flex-col items-center justify-center py-12">
                  <p class="text-gray-500 text-lg mb-4">등록된 설문이 없습니다.</p>
                  <Button
                    class="bg-primary-400 hover:bg-primary-500 text-white"
                    as-child
                  >
                    <router-link to="/create-survey" class="flex items-center gap-2">
                      새 설문 만들기
                      <Plus class="h-4 w-4" />
                    </router-link>
                  </Button>
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
  Reply,
  ChevronRight,
  Plus,
} from 'lucide-vue-next'

const router = useRouter()
const { showError } = useSnackbar()

type RangeKey = 'today' | 'week' | 'month'

const recentSurveys = ref<recentSurvey[]>([])
const isLoading = ref(false)
const selectedRange = ref<RangeKey>('week')
const rangeOptions: RangeKey[] = ['today', 'week', 'month']
const rangeLabels: Record<RangeKey, string> = {
  today: '오늘',
  week: '이번 주',
  month: '이번 달',
}
const rangeDescriptions: Record<RangeKey, string> = {
  today: '오늘 생성된 설문과 응답 흐름을 보여줘요.',
  week: '이번 주 전체 설문 현황과 응답 트렌드를 확인하세요.',
  month: '이번 달 설문 성과를 한눈에 요약해드립니다.',
}
const medalLabels = ['1', '2', '3']
const medalClasses = [
  'bg-white text-amber-500 border border-amber-300 shadow-sm',
  'bg-white text-gray-500 border border-gray-300 shadow-sm',
  'bg-white text-orange-500 border border-orange-300 shadow-sm',
]

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

const totalSurveys = computed(() => recentSurveys.value.length)

const inactiveSurveysCount = computed(() => {
  return Math.max(totalSurveys.value - activeSurveysCount.value, 0)
})

const activeRate = computed(() => {
  if (totalSurveys.value === 0) return 0
  return Math.round((activeSurveysCount.value / totalSurveys.value) * 100)
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

const newSurveysThisWeek = computed(() => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return recentSurveys.value.filter((survey: recentSurvey) => new Date(survey.createdAt) >= sevenDaysAgo).length
})

const weeklySurveyGrowth = computed(() => {
  const sevenDaysAgo = new Date()
  const fourteenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const currentWeek = recentSurveys.value.filter((survey: recentSurvey) => {
    const date = new Date(survey.createdAt)
    return date >= sevenDaysAgo
  }).length

  const previousWeek = recentSurveys.value.filter((survey: recentSurvey) => {
    const date = new Date(survey.createdAt)
    return date >= fourteenDaysAgo && date < sevenDaysAgo
  }).length

  if (previousWeek === 0) return currentWeek === 0 ? 0 : 100
  return Math.round(((currentWeek - previousWeek) / previousWeek) * 100)
})

const avgResponsesPerSurvey = computed(() => {
  if (totalSurveys.value === 0) return 0
  return Math.round(totalResponses.value / totalSurveys.value)
})

const topSurveys = computed(() => {
  if (recentSurveys.value.length === 0) return []
  return [...recentSurveys.value]
    .sort((a, b) => b.responseCount - a.responseCount)
    .slice(0, 3)
})

const prioritySurveys = computed(() => {
  if (recentSurveys.value.length === 0) return []
  return [...recentSurveys.value]
    .sort((a, b) => a.responseCount - b.responseCount)
    .slice(0, 3)
})

const getRangeStart = (range: RangeKey) => {
  const now = new Date()
  if (range === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (range === 'week') {
    const start = new Date(now)
    start.setDate(start.getDate() - 7)
    return start
  }
  const start = new Date(now)
  start.setDate(start.getDate() - 30)
  return start
}

const periodSurveys = computed(() => {
  const rangeStart = getRangeStart(selectedRange.value)
  return recentSurveys.value.filter((survey: recentSurvey) => new Date(survey.createdAt) >= rangeStart)
})

const periodNewSurveys = computed(() => periodSurveys.value.length)

const periodResponses = computed(() => {
  return periodSurveys.value.reduce((sum, survey) => sum + survey.responseCount, 0)
})

const periodAvgResponses = computed(() => {
  if (periodSurveys.value.length === 0) return 0
  return Math.round(periodResponses.value / periodSurveys.value.length)
})

const periodActiveRate = computed(() => {
  if (periodSurveys.value.length === 0) return 0
  const activeCount = periodSurveys.value.filter((survey) => survey.isActive).length
  return Math.round((activeCount / periodSurveys.value.length) * 100)
})

const rangeDescription = computed(() => rangeDescriptions[selectedRange.value])
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
