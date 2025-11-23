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
                <div class="text-sm text-gray-800 mb-4">{{ survey.endTime }}</div>
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
              <div class="md:col-span-8 flex flex-col h-full">
                <div class="mb-4">
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
                <div class="mt-auto">
                  <div class="text-sm font-medium text-gray-800 mb-2">응답 현황</div>
                  <div class="text-lg font-semibold text-gray-800">
                    {{ survey.responseCount }}개
                  </div>
                </div>
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
              <Button
                variant="ghost"
                size="sm"
                class="text-primary-400 hover:text-primary-500"
                @click="goToResults"
              >
                결과 보기
                <BarChart class="h-4 w-4 ml-2" />
              </Button>
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
                        class="text-sm"
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
      </div>
    </div>
  </HeaderMenu>

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
  BarChart,
} from 'lucide-vue-next'

const { showSuccess, showError } = useSnackbar()
const router = useRouter()
const route = useRoute()
const surveyId = computed(() => Number(route.params.id))
const showDeleteDialog = ref(false)
const isLoading = ref(false)

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

const copyShareUrl = () => {
  navigator.clipboard.writeText(shareUrl.value)
  showSuccess('URL이 복사되었습니다.')
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

const goToResults = () => {
  router.push(`/survey/${surveyId.value}/results`)
}

// 라우트 파라미터 변경 감지
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchSurveyDetail()
  }
})

onMounted(() => {
  fetchSurveyDetail()
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
