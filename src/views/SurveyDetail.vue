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
                class="text-primary-400 hover:bg-primary-400 hover:text-white"
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
                      class="h-12 px-4 hover:bg-primary-400 hover:text-white hover:border-primary-400"
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
              <span class="text-sm text-gray-500">총 {{ actualResponseCount }}명 참여</span>
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
                      class="text-primary-400 hover:bg-primary-400 hover:text-white"
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
    <DialogContent class="max-w-xl h-[600px] bg-white border-gray-200 flex flex-col">
      <DialogHeader class="flex-shrink-0">
        <DialogTitle class="text-xl font-semibold text-gray-900">
          전체 응답 보기
        </DialogTitle>
      </DialogHeader>
      <div v-if="selectedQuestionIndex !== null" class="flex-1 flex flex-col overflow-hidden py-4">
        <div class="mb-4 text-sm font-medium text-gray-900 flex-shrink-0">
          질문: {{ resultQuestions[selectedQuestionIndex]?.content }}
        </div>
        <Separator class="mb-4 flex-shrink-0" />
        <div v-if="loadingResponses" class="flex-1 flex items-center justify-center text-sm text-gray-500">
          응답을 불러오는 중...
        </div>
        <div v-else-if="paginatedResponses.length > 0" class="flex-1 overflow-y-auto space-y-2 pr-2">
          <div
            v-for="resp in paginatedResponses"
            :key="resp.id"
            class="flex items-center justify-between py-2 px-3 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <div class="text-sm text-gray-900 flex-1">{{ resp.content }}</div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 ml-4 flex-shrink-0">
              <Clock class="h-3.5 w-3.5 text-gray-400" />
              <span>{{ formatTimeAgo(resp.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="flex-1 flex items-center justify-center text-sm text-gray-600">응답이 없습니다.</div>
        
        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center border-t border-gray-200 pt-4 flex-shrink-0">
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentResponsePage === 1"
              @click="currentResponsePage--"
              class="h-8 w-8 p-0"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <div class="flex items-center gap-1">
              <template v-for="(page, idx) in visiblePages" :key="`page-${idx}`">
                <span
                  v-if="page !== -1"
                  class="px-3 py-1 text-sm rounded cursor-pointer transition-colors"
                  :class="page === currentResponsePage
                    ? 'bg-primary-400 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'"
                  @click="currentResponsePage = page"
                >
                  {{ page }}
                </span>
                <span
                  v-else
                  class="px-2 text-gray-400"
                >
                  ...
                </span>
              </template>
            </div>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentResponsePage === totalPages"
              @click="currentResponsePage++"
              class="h-8 w-8 p-0"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
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
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Separator } from '@/components/ui/separator'
import type { QuestionStatisticsOption } from '@/interfaces/surveyInterface'

Chart.register(ArcElement, Tooltip, Legend)

// 라우터에서 전달되는 id prop을 명시적으로 정의하여 Vue 경고 해결
defineProps<{
  id?: string | number
}>()

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
const currentResponsePage = ref(1)
const responsesPerPage = 10
const loadingResponses = ref(false)
const questionResponses = ref<{
  responses: Array<{ id: number; content: string; createdAt: string }>
  pagination: { currentPage: number; pageSize: number; totalPages: number; totalCount: number }
} | null>(null)

// 페이징 관련 computed
const totalResponseCount = computed(() => {
  return questionResponses.value?.pagination.totalCount || 0
})

const totalPages = computed(() => {
  return questionResponses.value?.pagination.totalPages || 0
})

const paginatedResponses = computed(() => {
  return questionResponses.value?.responses || []
})

// 질문별 응답 조회
const fetchQuestionResponses = async () => {
  if (selectedQuestionIndex.value === null) return
  
  const question = resultQuestions.value[selectedQuestionIndex.value]
  if (!question || !question.id || !surveyId.value) return
  
  try {
    loadingResponses.value = true
    const response = await surveyApi.getQuestionResponses(
      surveyId.value,
      question.id,
      currentResponsePage.value,
      responsesPerPage
    )
    questionResponses.value = {
      responses: response.responses,
      pagination: response.pagination
    }
  } catch (error) {
    console.error('Failed to fetch question responses:', error)
    questionResponses.value = null
  } finally {
    loadingResponses.value = false
  }
}

// 페이지 변경 시 응답 재조회
watch(currentResponsePage, () => {
  if (showResponsesModal.value && selectedQuestionIndex.value !== null) {
    fetchQuestionResponses()
  }
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentResponsePage.value
  
  if (total <= 7) {
    // 7페이지 이하면 모두 표시
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 현재 페이지 기준으로 앞뒤 2페이지씩 표시
    if (current <= 3) {
      // 앞부분
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push(-1) // 구분자
      pages.push(total)
    } else if (current >= total - 2) {
      // 뒷부분
      pages.push(1)
      pages.push(-1) // 구분자
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 중간
      pages.push(1)
      pages.push(-1) // 구분자
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(-1) // 구분자
      pages.push(total)
    }
  }
  
  return pages
})

// 시간 포맷팅 함수 (상대 시간)
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`
  
  // 7일 이상이면 날짜 형식으로 표시
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 실제 응답 데이터를 기반으로 총 참여자 수 계산
const actualResponseCount = computed(() => {
  // 통계 데이터에서 totalResponses 찾기
  for (const [, statistics] of statisticsMap.value) {
    if (statistics?.statistics?.totalResponses) {
      return statistics.statistics.totalResponses
    }
  }
  
  // 워드클라우드 데이터에서 totalResponses 찾기
  for (const [, wordCloudData] of wordCloudDataMap.value) {
    if (wordCloudData?.totalResponses) {
      return wordCloudData.totalResponses
    }
  }
  
  // 데이터가 없으면 API에서 받은 기본값 사용
  return survey.value.responseCount || 0
})

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
  currentResponsePage.value = 1 // 모달 열 때 첫 페이지로 리셋
  questionResponses.value = null // 이전 데이터 초기화
  showResponsesModal.value = true
  // 모달이 열리면 응답 조회
  fetchQuestionResponses()
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
    
    // null 또는 undefined 체크 추가
    if (!questionsData || !Array.isArray(questionsData)) {
      console.warn('질문 데이터가 없거나 배열이 아닙니다:', questionsData)
      resultQuestions.value = []
      return
    }
    
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
