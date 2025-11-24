<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="px-6 py-8 pb-16">
        <!-- 설문 정보 헤더 -->
        <Card class="mb-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="px-6 py-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1">
                <Badge
                  :variant="survey.isActive === true ? 'default' : 'destructive'"
                  class="mb-3"
                >
                  {{ survey.isActive === true ? '진행중' : '종료' }}
                </Badge>
                <h1 class="text-2xl font-semibold text-gray-800 mb-2">{{ survey.title }}</h1>
                <p class="text-base text-gray-600">{{ survey.description }}</p>
              </div>
              <div class="text-right sm:text-left sm:ml-auto">
                <div class="text-xs text-gray-500 mb-1">마감일</div>
                <div class="text-sm text-gray-800 mb-4">{{ formatEndTime(survey.endTime) }}</div>
                <Button
                  variant="outline"
                  size="sm"
                  class="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                  @click="handleDelete"
                >
                  <Trash2 class="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <!-- 설문 공유 -->
        <Card class="mt-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                <Share2 class="h-5 w-5 text-primary-400 mr-2" />
                설문 공유
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                class="text-primary-400 hover:text-primary-500"
                @click="copyShareUrl"
              >
                <Copy class="h-4 w-4 mr-2" />
                URL 복사
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <!-- QR 코드 (모바일: 전체, 데스크톱: 4/12) -->
              <div class="md:col-span-4 text-center">
                <div class="mb-4 flex justify-center">
                  <div class="p-4 bg-white rounded-lg border border-gray-200 inline-block">
                    <qrcode-vue
                      :value="shareUrl"
                      :size="qrcodeSize"
                      level="H"
                      class="mx-auto"
                    />
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  QR 코드를 스캔하여 설문에 참여하세요
                </div>
              </div>
              <!-- 공유 URL 및 응답 현황 (모바일: 전체, 데스크톱: 8/12) -->
              <div class="md:col-span-8 flex flex-col h-full justify-center">
                <div>
                  <div class="text-sm font-medium text-gray-800 mb-2">공유 URL</div>
                  <div class="flex gap-2">
                    <Input
                      :model-value="shareUrl"
                      readonly
                      class="flex-1 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      class="h-12 px-4"
                      @click="copyShareUrl"
                    >
                      <Copy class="h-4 w-4" />
                    </Button>
                  </div>
                  <div class="text-xs text-gray-500 mt-2">
                    URL을 복사하여 설문을 공유하세요
                  </div>
                </div>
<!--                <div class="mt-auto">-->
<!--                  <div class="text-sm font-medium text-gray-800 mb-2">응답 현황</div>-->
<!--                  <div class="text-lg font-semibold text-gray-800">-->
<!--                    {{ survey.responseCount }}개-->
<!--                  </div>-->
<!--                </div>-->
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 요약 리포트 카드 -->
        <Card class="mt-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <CardTitle class="text-xl font-semibold text-gray-800">설문 요약 리포트</CardTitle>
              <span class="text-sm text-gray-500">총 {{ survey.responseCount }}명 참여</span>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div v-if="isLoadingSummary" class="flex items-center justify-center py-8">
              <div class="text-sm text-gray-500">요약 리포트를 불러오는 중...</div>
            </div>
            <div v-else class="space-y-6">
              <!-- 주요 포지션 -->
              <div v-if="summary.mainPosition">
                <div class="text-base font-semibold text-gray-800 mb-3">주요 포지션</div>
                <div class="text-base text-gray-700">{{ summary.mainPosition }}</div>
                <div v-if="summary.mainPositionPercent !== undefined" class="text-xs text-gray-500 mt-1">
                  전체 응답자의 {{ summary.mainPositionPercent.toFixed(1) }}%가 선택
                </div>
              </div>

              <!-- 개선 사항 -->
              <div v-if="summary.improvements && summary.improvements.length > 0">
                <div class="text-base font-semibold text-gray-800 mb-3">개선 사항</div>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in summary.improvements"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <span class="text-base text-gray-700">{{ index + 1 }}.</span>
                    <span class="text-base text-gray-700">{{ item }}</span>
                  </div>
                </div>
              </div>
              <div v-if="!summary.mainPosition && (!summary.improvements || summary.improvements.length === 0)" class="text-sm text-gray-500">
                요약 리포트 데이터가 없습니다.
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 설문 질문 목록 -->
        <Card class="mt-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                <ListChecks class="h-5 w-5 text-primary-400 mr-2" />
                설문 질문
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-6">
              <div
                v-for="(question, index) in survey.questions"
                :key="question.id"
                class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                <div class="flex items-start gap-4">
                  <!-- 질문 번호 -->
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-sm text-gray-700">
                    {{ index + 1 }}
                  </div>
                  <!-- 질문 내용 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start gap-2 mb-2 flex-wrap">
                      <h3 class="text-lg font-semibold text-gray-800">{{ question.content }}</h3>
                      <Badge
                        v-if="question.required"
                        variant="destructive"
                        class="text-xs"
                      >
                        필수
                      </Badge>
                    </div>
                    <div class="text-xs text-gray-500 mb-4">
                      {{ questionTypeLabels[question.type] }}
                    </div>
                    <!-- 질문 타입별 표시 -->
                    <div v-if="question.type === 'MULTIPLE_CHOICE'" class="flex flex-wrap gap-2">
                      <Badge
                        v-for="option in question.options"
                        :key="option.id"
                        variant="secondary"
                        class="text-sm text-white bg-primary-400"
                      >
                        {{ option.content }}
                      </Badge>
                    </div>
                    <div v-else-if="question.type === 'SCALE'" class="mt-4">
                      <Slider
                        :model-value="[3]"
                        :min="1"
                        :max="5"
                        :step="1"
                        disabled
                        class="w-full"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-2">
                        <span>매우 불만족</span>
                        <span>매우 만족</span>
                      </div>
                    </div>
                    <div v-else class="mt-2">
                      <Textarea
                        placeholder="주관식 응답"
                        readonly
                        class="bg-gray-50 border-gray-200 resize-none"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 응답 결과 섹션 -->
        <Card class="mt-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <CardTitle class="text-xl font-semibold text-gray-800">응답 결과</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div v-if="isLoadingQuestions" class="flex items-center justify-center py-8">
              <div class="text-sm text-gray-500">질문 목록을 불러오는 중...</div>
            </div>
            <div v-else-if="resultQuestions.length === 0" class="text-sm text-gray-500 text-center py-8">
              질문이 없습니다.
            </div>
            <div v-else class="space-y-6">
              <Card
                v-for="(question, index) in resultQuestions"
                :key="question.id || index"
                class="shadow-sm border border-gray-200 bg-white"
              >
                <!-- 헤더 -->
                <CardHeader class="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-sm text-gray-700">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                          {{ question.content }}
                          <Badge
                            v-if="question.required"
                            variant="destructive"
                            class="text-xs"
                          >
                            필수
                          </Badge>
                        </h3>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-primary-400 hover:text-primary-500"
                      @click="viewAllResponses(index)"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      전체 응답 보기
                    </Button>
                  </div>
                </CardHeader>
                
                <!-- 바디 -->
                <CardContent class="p-6">
                  <div class="text-xs text-gray-500 mb-4">{{ question.type }}</div>
                  
                  <!-- 객관식 차트 -->
                  <div v-if="question.type === '객관식'" class="space-y-4">
                    <div v-if="isLoadingStatistics(question.id)" class="flex items-center justify-center py-8">
                      <div class="text-sm text-gray-500">통계 데이터를 불러오는 중...</div>
                    </div>
                    <div v-else-if="question.id && statisticsMap.get(question.id)" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <!-- 차트 -->
                      <div class="flex justify-center">
                        <div class="w-full max-w-sm">
                          <Doughnut :data="getChartData(question.id)" :options="chartOptions" />
                        </div>
                      </div>
                      <!-- 인사이트 텍스트 -->
                      <div class="flex items-center">
                        <div v-if="question.id && isLoadingInsight(question.id)" class="text-sm text-gray-500">
                          인사이트를 불러오는 중...
                        </div>
                        <div v-else-if="question.id && insightMap.get(question.id)" class="text-base text-gray-600 leading-relaxed">
                          {{ insightMap.get(question.id) }}
                        </div>
                        <div v-else class="text-sm text-gray-500">
                          인사이트 데이터가 없습니다.
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-sm text-gray-500 text-center py-8">
                      통계 데이터가 없습니다.
                    </div>
                  </div>

                  <!-- 주관식 워드클라우드 -->
                  <div v-else-if="question.type === '주관식' && question.id" class="space-y-4">
                    <div v-if="isLoadingWordCloud(question.id)" class="flex items-center justify-center py-8">
                      <div class="text-sm text-gray-500">워드클라우드를 불러오는 중...</div>
                    </div>
                    <template v-else-if="question.id">
                      <div v-if="wordCloudDataMap.get(question.id)?.wordCloud && (wordCloudDataMap.get(question.id)?.wordCloud?.length || 0) > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <!-- 워드클라우드 -->
                      <div class="wordcloud-visual">
                        <span
                          v-for="(item, i) in wordCloudDataMap.get(question.id)?.wordCloud || []"
                          :key="item.word"
                          class="wordcloud-key"
                          :style="getWordCloudStyle(item, i, question.id)"
                        >
                          {{ item.word }}
                          <span class="wordcloud-count">{{ item.count }}</span>
                        </span>
                      </div>
                      <!-- 인사이트 텍스트 -->
                      <div class="flex items-center">
                        <div v-if="question.id && isLoadingInsight(question.id)" class="text-sm text-gray-500">
                          인사이트를 불러오는 중...
                        </div>
                        <div v-else-if="question.id && insightMap.get(question.id)" class="text-base text-gray-600 leading-relaxed">
                          {{ insightMap.get(question.id) }}
                        </div>
                        <div v-else class="text-sm text-gray-500">
                          인사이트 데이터가 없습니다.
                        </div>
                      </div>
                      </div>
                      <div v-else class="text-sm text-gray-500 text-center py-8">
                        워드클라우드 데이터가 없습니다.
                      </div>
                    </template>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </HeaderMenu>

  <!-- 전체 응답 모달 -->
  <Dialog v-model:open="showResponsesModal">
    <DialogContent class="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold text-gray-800 flex items-center justify-between">
          전체 응답 보기
          <Button
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0"
            @click="showResponsesModal = false"
          >
            <X class="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>
      <div v-if="selectedQuestionIndex !== null" class="py-4">
        <div class="mb-4 text-sm font-medium text-gray-800">
          질문: {{ resultQuestions[selectedQuestionIndex]?.content }}
        </div>
        <Separator class="mb-4" />
        <div v-if="allResponses[selectedQuestionIndex] && allResponses[selectedQuestionIndex].length" class="space-y-2">
          <div
            v-for="(resp, i) in allResponses[selectedQuestionIndex]"
            :key="i"
            class="p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700"
          >
            {{ resp }}
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">응답이 없습니다.</div>
      </div>
    </DialogContent>
  </Dialog>

  <!-- 삭제 확인 다이얼로그 -->
  <Dialog v-model:open="showDeleteDialog">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold text-gray-800">설문 삭제</DialogTitle>
        <DialogDescription class="text-gray-600">
          정말로 이 설문을 삭제하시겠습니까?<br>
          삭제된 설문은 복구할 수 없습니다.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button
          variant="outline"
          @click="showDeleteDialog = false"
        >
          취소
        </Button>
        <Button
          variant="destructive"
          @click="confirmDelete"
        >
          삭제
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getQuestionsResponse, GetSurveyDetailResponse } from '@/interfaces/surveyInterface'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Trash2,
  Copy,
  Share2,
  ListChecks,
  Eye,
  X,
} from 'lucide-vue-next'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Separator } from '@/components/ui/separator'
import type { QuestionStatisticsOption } from '@/interfaces/surveyInterface'

Chart.register(ArcElement, Tooltip, Legend)

const { showSuccess, showError } = useSnackbar()
const router = useRouter()
const route = useRoute()
const surveyId = computed(() => Number(route.params.id))
const showDeleteDialog = ref(false)
const isLoading = ref(false)

// 요약 리포트 관련
const summary = ref<{
  mainPosition: string
  mainPositionPercent?: number
  improvements: string[]
}>({
  mainPosition: '',
  mainPositionPercent: undefined,
  improvements: []
})
const isLoadingSummary = ref(false)

// 응답 결과 관련
interface QuestionItem {
  id?: number
  content: string
  type: string
  required: boolean
  options?: Array<{ id: number; content: string }> | string[]
}
const resultQuestions = ref<QuestionItem[]>([])
const isLoadingQuestions = ref(false)

// 질문별 통계 데이터를 Map으로 관리
const statisticsMap = ref<Map<number, import('@/interfaces/surveyInterface').QuestionStatisticsResponse>>(new Map())
const loadingStatistics = ref<Set<number>>(new Set())

// 색상 팔레트 (옵션 개수에 따라 동적으로 사용)
const colorPalette = [
  '#4caf50', // 초록
  '#2196f3', // 파랑
  '#ff9800', // 주황
  '#9c27b0', // 보라
  '#ffc107', // 노랑
  '#e91e63', // 분홍
  '#00bcd4', // 청록
  '#795548', // 갈색
  '#607d8b', // 청회색
  '#f44336', // 빨강
  '#8bc34a', // 연두
  '#3f51b5', // 남색
  '#ff5722', // 진주황
  '#009688', // 청록2
  '#cddc39'  // 라임
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  }
}

// 질문별 워드클라우드 데이터를 Map으로 관리
const wordCloudDataMap = ref<Map<number, { wordCloud: Array<{ word: string; count: number }>; totalResponses: number }>>(new Map())
const loadingWordCloud = ref<Set<number>>(new Set())

// 질문별 인사이트 텍스트를 Map으로 관리
const insightMap = ref<Map<number, string>>(new Map())
const loadingInsight = ref<Set<number>>(new Set())

const showResponsesModal = ref(false)
const selectedQuestionIndex = ref<number | null>(null)
// 임시 전체 응답 데이터 (질문별 배열)
const allResponses = [
  ['정글', '미드', '정글', '원딜', '탑', '서포터', '정글'],
  ['매칭 시스템이 너무 불공정해요.', '클라이언트가 자주 튕깁니다.', '버그가 많아요.', 'AFK 유저가 많아요.']
]

const survey = ref<GetSurveyDetailResponse>({
  id: 0,
  title: '',
  description: '',
  isActive: false,
  endTime: '',
  responseCount: 0,
  questions: []
})

const shareUrl = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/survey/${route.params.id}/create-response`
})

// 반응형 QR 코드 크기
const qrcodeSize = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 150 : 200
  }
  return 200
})

const handleDelete = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await surveyApi.deleteSurvey(surveyId.value)
    showSuccess('설문이 삭제되었습니다.')
    router.push('/')
  } catch (error) {
    showError('설문 삭제에 실패했습니다.')
  } finally {
    showDeleteDialog.value = false
  }
}

const copyShareUrl = async () => {
  try {
    // 최신 클립보드 API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl.value)
      showSuccess('URL이 복사되었습니다.')
    } else {
      // Fallback: 구형 브라우저나 HTTP 환경을 위한 방법
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl.value
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          showSuccess('URL이 복사되었습니다.')
        } else {
          throw new Error('복사 실패')
        }
      } catch (err) {
        showError('URL 복사에 실패했습니다.')
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
    showError('URL 복사에 실패했습니다.')
  }
}

const questionTypeLabels: Record<string, string> = {
  MULTIPLE_CHOICE: '객관식',
  SUBJECTIVE: '주관식',
  SCALE: '척도형'
}

const fetchSurveyDetail = async () => {
  try {
    isLoading.value = true
    const surveyDetail = await surveyApi.getSurveyDetail(surveyId.value)
    const questions = await surveyApi.getQuestionsBySurveyId(surveyId.value)
    
    // API 응답을 survey ref에 바인딩
    survey.value = {
      id: surveyDetail.id,
      title: surveyDetail.title,
      description: surveyDetail.description,
      isActive: surveyDetail.isActive,
      endTime: surveyDetail.endTime,
      responseCount: surveyDetail.responseCount,
      questions: questions.map((question: getQuestionsResponse) => ({
        id: question.id,
        content: question.content,
        type: question.type,
        required: question.required || false,
        options: question.options || []
      }))
    }
    
    // 동적 제목 설정
    if (survey.value.title) {
      document.title = `${survey.value.title} :: ThinkFast`
    }
  } catch (error) {
    router.push('/')
  } finally {
    isLoading.value = false
  }
}

// 특정 질문의 통계 로딩 상태 확인
function isLoadingStatistics(questionId: number | undefined): boolean {
  if (!questionId) return false
  return loadingStatistics.value.has(questionId)
}

// 질문별 차트 데이터 생성
function getChartData(questionId: number | undefined) {
  if (!questionId) {
    return { labels: [], datasets: [] }
  }
  
  const statistics = statisticsMap.value.get(questionId)
  if (!statistics || !statistics.statistics.options || statistics.statistics.options.length === 0) {
    return { labels: [], datasets: [] }
  }

  const options = statistics.statistics.options
  const labels = options.map((opt: QuestionStatisticsOption) => opt.optionContent)
  const data = options.map((opt: QuestionStatisticsOption) => opt.percent)
  const backgroundColor = options.map((_: QuestionStatisticsOption, index: number) => colorPalette[index % colorPalette.length])

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor
      }
    ]
  }
}

// 특정 질문의 워드클라우드 로딩 상태 확인
function isLoadingWordCloud(questionId: number): boolean {
  return loadingWordCloud.value.has(questionId)
}

// 특정 질문의 인사이트 로딩 상태 확인
function isLoadingInsight(questionId: number | undefined): boolean {
  if (!questionId) return false
  return loadingInsight.value.has(questionId)
}

function getWordCloudStyle(item: { word: string; count: number }, i: number, questionId: number | undefined) {
  if (!questionId) {
    return { display: 'none' }
  }
  
  const wordCloudData = wordCloudDataMap.value.get(questionId)?.wordCloud || []
  if (wordCloudData.length === 0) {
    return { display: 'none' }
  }
  
  const minFont = 16
  const maxFont = 36
  const minCount = Math.min(...wordCloudData.map((w: { word: string; count: number }) => w.count))
  const maxCount = Math.max(...wordCloudData.map((w: { word: string; count: number }) => w.count))
  const size = minFont + ((item.count - minCount) / (maxCount - minCount || 1)) * (maxFont - minFont)
  
  // 원형 레이아웃을 위한 각도 계산
  const angle = (i / (wordCloudData.length || 1)) * 2 * Math.PI
  const radius = 35 // 중심으로부터의 거리 (%)
  
  // 원형 레이아웃에 약간의 랜덤성 추가
  const randomRadius = radius * (0.8 + Math.random() * 0.4) // 80%~120% 범위
  const randomAngle = angle + (Math.random() - 0.5) * 0.5 // ±0.25 라디안 범위
  
  // 극좌표를 직교좌표로 변환
  const left = 50 + randomRadius * Math.cos(randomAngle)
  const top = 50 + randomRadius * Math.sin(randomAngle)
  
  // 다양한 색상 팔레트
  const colors = [
    '#2196F3', // 파랑
    '#4CAF50', // 초록
    '#FF9800', // 주황
    '#9C27B0', // 보라
    '#E91E63', // 분홍
    '#00BCD4', // 청록
    '#FFC107', // 노랑
    '#795548', // 갈색
    '#607D8B', // 청회색
    '#F44336'  // 빨강
  ]
  
  // 빈도수에 따라 색상 선택 (빈도가 높을수록 더 선명한 색상)
  const colorIndex = Math.floor((item.count - minCount) / (maxCount - minCount || 1) * (colors.length - 1))
  const color = colors[colorIndex]
  
  return {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    fontSize: size + 'px',
    fontWeight: 700,
    color,
    opacity: 0.7 + ((item.count - minCount) / (maxCount - minCount || 1)) * 0.3,
    zIndex: 10 + item.count,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease-out',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  }
}

function viewAllResponses(index: number) {
  selectedQuestionIndex.value = index
  showResponsesModal.value = true
}

// endTime 포맷팅 함수 (예: "2025-11-23T20:00:00" -> "2025-11-23 20:00")
function formatEndTime(endTime: string): string {
  if (!endTime) return '-'
  
  // ISO 형식 처리 (예: "2025-11-23T20:00:00")
  if (endTime.includes('T')) {
    const [date, time] = endTime.split('T')
    if (time) {
      const timeWithoutSeconds = time.substring(0, 5) // HH:mm까지만 표시
      return `${date} ${timeWithoutSeconds}`
    }
    return date
  }
  
  // 공백으로 구분된 형식 처리 (예: "2024-01-15 14:30:00" -> "2024-01-15 14:30")
  const parts = endTime.trim().split(' ')
  if (parts.length >= 2) {
    const date = parts[0]
    const time = parts[1].substring(0, 5) // HH:mm까지만 표시
    return `${date} ${time}`
  }
  
  return endTime
}

// 라우트 파라미터 변경 감지
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchSurveyDetail()
    fetchSurveySummary()
    fetchResultQuestions()
  }
})

// 설문 요약 리포트 가져오기
const fetchSurveySummary = async () => {
  try {
    isLoadingSummary.value = true
    const summaryData = await surveyApi.getSurveySummary(surveyId.value)
    summary.value = {
      mainPosition: summaryData.mainPosition || '',
      mainPositionPercent: summaryData.mainPositionPercent,
      improvements: summaryData.improvements || []
    }
  } catch (error: any) {
    // 403 권한 없음 에러인 경우 요약 리포트 섹션을 숨기거나 기본값 유지
    if (error.response?.status === 403) {
      console.warn('설문 요약 리포트에 접근할 권한이 없습니다.')
    } else {
      console.error('설문 요약 리포트 로딩 실패:', error)
    }
  } finally {
    isLoadingSummary.value = false
  }
}

// 특정 질문의 워드클라우드 데이터 가져오기
const fetchWordCloud = async (questionId: number) => {
  if (loadingWordCloud.value.has(questionId) || wordCloudDataMap.value.has(questionId)) {
    return
  }

  try {
    loadingWordCloud.value.add(questionId)
    const wordCloudData = await surveyApi.getWordCloud(surveyId.value, questionId)
    wordCloudDataMap.value.set(questionId, {
      wordCloud: wordCloudData.wordCloud || [],
      totalResponses: wordCloudData.totalResponses || 0
    })
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.warn(`질문 ${questionId}의 워드클라우드에 접근할 권한이 없습니다.`)
    } else {
      console.error(`질문 ${questionId}의 워드클라우드 로딩 실패:`, error)
    }
    wordCloudDataMap.value.set(questionId, {
      wordCloud: [],
      totalResponses: 0
    })
  } finally {
    loadingWordCloud.value.delete(questionId)
  }
}

// 특정 질문의 인사이트 텍스트 가져오기
const fetchQuestionInsight = async (questionId: number) => {
  if (loadingInsight.value.has(questionId) || insightMap.value.has(questionId)) {
    return
  }

  try {
    loadingInsight.value.add(questionId)
    const insightText = await surveyApi.getQuestionInsight(surveyId.value, questionId)
    insightMap.value.set(questionId, insightText)
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.warn(`질문 ${questionId}의 인사이트에 접근할 권한이 없습니다.`)
    } else {
      console.error(`질문 ${questionId}의 인사이트 로딩 실패:`, error)
    }
    insightMap.value.set(questionId, '')
  } finally {
    loadingInsight.value.delete(questionId)
  }
}

// 특정 질문의 통계 데이터 가져오기
const fetchQuestionStatistics = async (questionId: number) => {
  if (loadingStatistics.value.has(questionId) || statisticsMap.value.has(questionId)) {
    return
  }

  try {
    loadingStatistics.value.add(questionId)
    const statisticsData = await surveyApi.getQuestionStatistics(surveyId.value, questionId)
    statisticsMap.value.set(questionId, statisticsData)
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.warn(`질문 ${questionId}의 통계에 접근할 권한이 없습니다.`)
    } else {
      console.error(`질문 ${questionId}의 통계 로딩 실패:`, error)
    }
    statisticsMap.value.set(questionId, {
      questionId,
      type: 'MULTIPLE_CHOICE',
      statistics: {
        options: [],
        totalResponses: 0
      }
    })
  } finally {
    loadingStatistics.value.delete(questionId)
  }
}

// 응답 결과용 질문 목록 가져오기
const fetchResultQuestions = async () => {
  try {
    isLoadingQuestions.value = true
    const questionsData = await surveyApi.getQuestionsBySurveyId(surveyId.value)
    const typeMapping: Record<string, string> = {
      'MULTIPLE_CHOICE': '객관식',
      'SUBJECTIVE': '주관식',
      'SCALE': '척도형'
    }
    
    resultQuestions.value = questionsData.map(q => ({
      id: q.id,
      content: q.content,
      type: typeMapping[q.type] || q.type,
      required: q.required ?? false,
      options: q.options || []
    }))

    // 모든 질문의 인사이트 및 주관식 질문의 워드클라우드, 객관식 질문의 통계 가져오기
    const promises: Promise<void>[] = []
    for (const question of resultQuestions.value) {
      if (question.id) {
        promises.push(fetchQuestionInsight(question.id))
        
        if (question.type === '주관식') {
          promises.push(fetchWordCloud(question.id))
        }
        
        if (question.type === '객관식') {
          promises.push(fetchQuestionStatistics(question.id))
        }
      }
    }
    
    await Promise.all(promises)
  } catch (error) {
    console.error('질문 목록을 불러오는데 실패했습니다:', error)
  } finally {
    isLoadingQuestions.value = false
  }
}

onMounted(() => {
  fetchSurveyDetail()
  fetchSurveySummary()
  fetchResultQuestions()
})
</script>

<style scoped>
.wordcloud-visual {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.08);
  min-height: 300px;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .wordcloud-visual {
    min-height: 250px;
    padding: 30px 20px;
  }
}

.wordcloud-key {
  font-family: 'Pretendard', 'Noto Sans KR', 'sans-serif';
  font-weight: 700;
  transition: all 0.3s ease-out;
  line-height: 1.1;
  display: inline-block;
  pointer-events: none;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
}

.wordcloud-count {
  font-size: 0.7em;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 4px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
}
</style>
