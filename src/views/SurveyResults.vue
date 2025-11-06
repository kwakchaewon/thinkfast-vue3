<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="container mx-auto px-4 py-8 max-w-7xl pb-16">
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
                <div class="text-sm text-gray-800">{{ survey.endTime }}</div>
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
            <div class="space-y-6">
              <!-- 주요 포지션 -->
              <div>
                <div class="text-base font-semibold text-gray-800 mb-3">주요 포지션</div>
                <div class="text-base text-gray-700">{{ summary.mainPosition }}</div>
                <div class="text-xs text-gray-500 mt-1">전체 응답자의 45%가 선택</div>
              </div>

              <!-- 개선 사항 -->
              <div>
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
            </div>
          </CardContent>
        </Card>

        <!-- 설문 질문 섹션 -->
        <Card class="shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <CardTitle class="text-xl font-semibold text-gray-800">응답 결과</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-6">
              <Card
                v-for="(question, index) in questions"
                :key="index"
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
                        <div class="text-base text-gray-600 leading-relaxed">
                          정글과 미드가 응답자의 절반 이상을 차지하며,<br>
                          원딜, 탑, 서포터는 동일한 비율로 나타났습니다.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 주관식 워드클라우드 -->
                  <div v-else-if="question.type === '주관식'" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <!-- 워드클라우드 -->
                      <div class="wordcloud-visual">
                        <span
                          v-for="(item, i) in wordCloudData"
                          :key="item.word"
                          class="wordcloud-key"
                          :style="getWordCloudStyle(item, i)"
                        >
                          {{ item.word }}
                          <span class="wordcloud-count">{{ item.count }}</span>
                        </span>
                      </div>
                      <!-- 인사이트 텍스트 -->
                      <div class="flex items-center">
                        <div class="text-base text-gray-600 leading-relaxed">
                          응답자들은 '매칭 시스템'에 대한 개선 요청이 가장 많았으며, <br>그 뒤를 '클라이언트 안정성'과 '버그 수정'에 대한 의견이 차지했습니다.
                        </div>
                      </div>
                    </div>
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

const summary = ref({
  mainPosition: '정글',
  improvements: [
    '매칭 시스템의 실력 차이 완화 필요',
    '초반 AFK 플레이어 패널티 강화',
    '클라이언트 성능 최적화 필요'
  ]
})

const questions = [
  {
    content: '당신이 가장 자주 플레이하는 포지션은 무엇인가요?',
    type: '객관식',
    required: true,
    options: ['탑', '정글', '미드', '원딜', '서포터']
  },
  {
    content: '리그 오브 레전드에서 개선되었으면 하는 점이나 바라는 점이 있다면 자유롭게 작성해주세요.',
    type: '주관식',
    required: true
  }
]

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

const wordCloudData = [
  { word: '매칭', count: 12 },
  { word: '클라이언트', count: 8 },
  { word: '버그', count: 7 },
  { word: '최적화', count: 6 },
  { word: 'AFK', count: 5 }
]

function getWordCloudStyle(item: { word: string; count: number }, i: number) {
  const minFont = 16
  const maxFont = 36
  const minCount = Math.min(...wordCloudData.map(w => w.count))
  const maxCount = Math.max(...wordCloudData.map(w => w.count))
  const size = minFont + ((item.count - minCount) / (maxCount - minCount || 1)) * (maxFont - minFont)
  
  // 원형 레이아웃을 위한 각도 계산
  const angle = (i / wordCloudData.length) * 2 * Math.PI
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

onMounted(() => {
  fetchSurveyDetail()
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
