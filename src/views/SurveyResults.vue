<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="px-6 py-8 pb-16">
        <!-- 설문 정보 헤더 -->
        <Card class="mb-4 shadow-md border border-gray-200 bg-white">
          <CardHeader class="px-6 py-4">
            <div v-if="isLoading" class="flex items-center justify-center py-8">
              <div class="text-sm text-gray-500">설문 정보를 불러오는 중...</div>
            </div>
            <div v-else class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1">
                <Badge
                  v-if="survey.id"
                  :variant="survey.isActive === true ? 'default' : 'destructive'"
                  class="mb-3"
                >
                  {{ survey.isActive === true ? '진행중' : '종료' }}
                </Badge>
                <h1 class="text-2xl font-semibold text-gray-800 mb-2">{{ survey.title || '-' }}</h1>
                <p class="text-base text-gray-600">{{ survey.description || '-' }}</p>
              </div>
              <div v-if="survey.endTime" class="text-right sm:text-left sm:ml-auto">
                <div class="text-xs text-gray-500 mb-1">마감일</div>
                <div class="text-sm text-gray-800">{{ formatEndTime(survey.endTime) }}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <!-- 요약 리포트 카드 -->
        <Card class="mb-4 shadow-md border border-gray-200 bg-white">
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

        <!-- 설문 질문 섹션 -->
        <Card class="shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <CardTitle class="text-xl font-semibold text-gray-800">응답 결과</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div v-if="isLoadingQuestions" class="flex items-center justify-center py-8">
              <div class="text-sm text-gray-500">질문 목록을 불러오는 중...</div>
            </div>
            <div v-else-if="questions.length === 0" class="text-sm text-gray-500 text-center py-8">
              질문이 없습니다.
            </div>
            <div v-else class="space-y-6">
              <Card
                v-for="(question, index) in questions"
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
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <!-- 차트 -->
                      <div class="flex justify-center">
                        <div class="w-full max-w-sm">
                          <Doughnut :data="chartData" :options="chartOptions" />
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
          질문: {{ questions[selectedQuestionIndex].content }}
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Eye, X } from 'lucide-vue-next'

Chart.register(ArcElement, Tooltip, Legend)

interface Survey {
  id: number
  title: string
  description: string
  isActive: boolean
  endTime: string
  responseCount: number
}

const router = useRouter()
const route = useRoute()
const { showError } = useSnackbar()
const surveyId = computed(() => Number(route.params.id))
const isLoading = ref(false)

const survey = ref<Survey>({
  id: 0,
  title: '',
  description: '',
  isActive: false,
  endTime: '',
  responseCount: 0
})

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

interface QuestionItem {
  id?: number
  content: string
  type: string
  required: boolean
  options?: Array<{ id: number; content: string }> | string[]
}

const questions = ref<QuestionItem[]>([])
const isLoadingQuestions = ref(false)

const positionResults = [
  { name: '정글', percent: 28.5 },
  { name: '미드', percent: 28.5 },
  { name: '원딜', percent: 14.2 },
  { name: '탑', percent: 14.2 },
  { name: '서포터', percent: 14.2 }
]

const chartData = {
  labels: positionResults.map(r => r.name),
  datasets: [
    {
      data: positionResults.map(r => r.percent),
      backgroundColor: [
        '#4caf50', // 정글
        '#2196f3', // 미드
        '#ff9800', // 원딜
        '#9c27b0', // 탑
        '#ffc107'  // 서포터
      ]
    }
  ]
}

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

const showResponsesModal = ref(false)
const selectedQuestionIndex = ref<number | null>(null)
// 임시 전체 응답 데이터 (질문별 배열)
const allResponses = [
  ['정글', '미드', '정글', '원딜', '탑', '서포터', '정글'],
  ['매칭 시스템이 너무 불공정해요.', '클라이언트가 자주 튕깁니다.', '버그가 많아요.', 'AFK 유저가 많아요.']
]

function viewAllResponses(index: number) {
  selectedQuestionIndex.value = index
  showResponsesModal.value = true
}

// endTime 포맷팅 함수 (예: "2024-01-15 14:30:00" -> "2024-01-15 14:30")
function formatEndTime(endTime: string): string {
  if (!endTime) return '-'
  
  // "YYYY-MM-DD HH:mm:ss" 형식 또는 "YYYY-MM-DD HH:mm" 형식 처리
  const parts = endTime.trim().split(' ')
  if (parts.length >= 2) {
    const date = parts[0]
    const time = parts[1].substring(0, 5) // HH:mm까지만 표시
    return `${date} ${time}`
  }
  
  return endTime
}

const fetchSurveyDetail = async () => {
  try {
    isLoading.value = true
    const surveyDetail = await surveyApi.getSurveyDetail(surveyId.value)
    survey.value = {
      id: surveyDetail.id,
      title: surveyDetail.title,
      description: surveyDetail.description,
      isActive: surveyDetail.isActive,
      endTime: surveyDetail.endTime,
      responseCount: surveyDetail.responseCount
    }
  } catch (error) {
    showError('설문 정보를 불러오는데 실패했습니다.')
    router.push('/')
  } finally {
    isLoading.value = false
  }
}

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
      // 권한이 없는 경우 빈 상태로 유지하거나 메시지 표시 가능
      console.warn('설문 요약 리포트에 접근할 권한이 없습니다.')
    } else {
      // 기타 에러는 이미 surveyApi에서 에러 메시지 표시됨
      console.error('설문 요약 리포트 로딩 실패:', error)
    }
  } finally {
    isLoadingSummary.value = false
  }
}

// 특정 질문의 워드클라우드 데이터 가져오기
const fetchWordCloud = async (questionId: number) => {
  // 이미 로딩 중이거나 이미 데이터가 있으면 스킵
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
    // 403 권한 없음 에러인 경우 워드클라우드를 표시하지 않음
    if (error.response?.status === 403) {
      console.warn(`질문 ${questionId}의 워드클라우드에 접근할 권한이 없습니다.`)
    } else {
      console.error(`질문 ${questionId}의 워드클라우드 로딩 실패:`, error)
    }
    // 에러 발생 시 빈 데이터 설정
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
  // 이미 로딩 중이거나 이미 데이터가 있으면 스킵
  if (loadingInsight.value.has(questionId) || insightMap.value.has(questionId)) {
    return
  }

  try {
    loadingInsight.value.add(questionId)
    const insightText = await surveyApi.getQuestionInsight(surveyId.value, questionId)
    insightMap.value.set(questionId, insightText)
  } catch (error: any) {
    // 403 권한 없음 에러인 경우 인사이트를 표시하지 않음
    if (error.response?.status === 403) {
      console.warn(`질문 ${questionId}의 인사이트에 접근할 권한이 없습니다.`)
    } else {
      console.error(`질문 ${questionId}의 인사이트 로딩 실패:`, error)
    }
    // 에러 발생 시 빈 문자열 설정
    insightMap.value.set(questionId, '')
  } finally {
    loadingInsight.value.delete(questionId)
  }
}

// 질문 목록을 가져오고 주관식 질문의 워드클라우드 및 모든 질문의 인사이트 로드
const fetchQuestions = async () => {
  try {
    isLoadingQuestions.value = true
    const questionsData = await surveyApi.getQuestionsBySurveyId(surveyId.value)
    // 질문 타입 매핑 (서버: MULTIPLE_CHOICE, SUBJECTIVE -> 화면: 객관식, 주관식)
    const typeMapping: Record<string, string> = {
      'MULTIPLE_CHOICE': '객관식',
      'SUBJECTIVE': '주관식',
      'SCALE': '척도형'
    }
    
    questions.value = questionsData.map(q => ({
      id: q.id,
      content: q.content,
      type: typeMapping[q.type] || q.type,
      required: q.required ?? false,
      options: q.options || []
    }))

    // 모든 질문의 인사이트 및 주관식 질문의 워드클라우드 가져오기
    const promises: Promise<void>[] = []
    for (const question of questions.value) {
      if (question.id) {
        // 모든 질문의 인사이트 가져오기
        promises.push(fetchQuestionInsight(question.id))
        
        // 주관식 질문의 워드클라우드 가져오기
        if (question.type === '주관식') {
          promises.push(fetchWordCloud(question.id))
        }
      }
    }
    
    // 병렬로 로드
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
  fetchQuestions()
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
