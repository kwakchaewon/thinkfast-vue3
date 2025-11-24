<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-4 pb-24 max-w-4xl">
      <!-- 설문 정보 헤더 -->
      <Card class="mb-4 shadow-md border border-gray-200 bg-white">
        <CardHeader class="px-6 py-4">
          <Badge
            :variant="survey.status === 'active' ? 'default' : 'destructive'"
            class="mb-3"
          >
            {{ survey.status === 'active' ? '진행중' : '종료' }}
          </Badge>
          <CardTitle class="text-xl font-semibold text-gray-800 mb-2">{{ survey.title }}</CardTitle>
          <p class="text-sm text-gray-600 mb-2">{{ survey.description }}</p>
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <Clock class="h-4 w-4" />
            <span>마감일: {{ survey.endDate }} {{ survey.endTime }}</span>
          </div>
        </CardHeader>
      </Card>

      <!-- 설문 질문 목록 -->
      <form @submit.prevent="submitResponse" class="space-y-4">
        <Card
          v-for="(question, index) in survey.questions"
          :key="question.id"
          class="shadow-md border border-gray-200 bg-white"
        >
          <CardContent class="p-6">
            <div class="flex items-start gap-2 mb-4 flex-wrap">
              <span class="text-lg font-semibold text-gray-800">{{ index + 1 }}.</span>
              <h3 class="text-lg font-semibold text-gray-800 flex-1 min-w-0">{{ question.content }}</h3>
              <Badge
                v-if="question.required"
                variant="destructive"
                class="text-xs"
              >
                필수
              </Badge>
            </div>

            <!-- 객관식 질문 -->
            <div v-if="question.type === 'MULTIPLE_CHOICE'" class="mt-4">
              <RadioGroup
                v-model="answers[question.id]"
                class="space-y-3"
              >
                <div
                  v-for="option in question.options"
                  :key="option.id"
                  class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  :class="{ 'border-primary-400 bg-primary-50': answers[question.id] === option.id }"
                >
                  <RadioGroupItem :value="option.id" :id="`option-${option.id}`" />
                  <label
                    :for="`option-${option.id}`"
                    class="flex-1 text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    {{ option.content }}
                  </label>
                </div>
              </RadioGroup>
              <p v-if="errors[question.id]" class="text-xs text-red-500 mt-2">
                {{ errors[question.id] }}
              </p>
            </div>

            <!-- 주관식 질문 -->
            <div v-else-if="question.type === 'SUBJECTIVE'" class="mt-4">
              <Textarea
                v-model="answers[question.id]"
                placeholder="답변을 입력하세요"
                class="min-h-[100px] bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 resize-none"
                :class="{ 'border-red-500': errors[question.id] }"
                rows="3"
              />
              <p v-if="errors[question.id]" class="text-xs text-red-500 mt-2">
                {{ errors[question.id] }}
              </p>
            </div>

            <!-- 척도형 질문 -->
            <div v-else-if="question.type === 'SCALE'" class="mt-4">
              <div class="px-2">
                <Slider
                  v-model="answers[question.id]"
                  :min="1"
                  :max="5"
                  :step="1"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                  <span>매우 불만족</span>
                  <span class="font-medium text-gray-800">
                    {{ Array.isArray(answers[question.id]) ? answers[question.id][0] : (answers[question.id] || 3) }}
                  </span>
                  <span>매우 만족</span>
                </div>
              </div>
              <p v-if="errors[question.id]" class="text-xs text-red-500 mt-2">
                {{ errors[question.id] }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 제출 버튼 (하단 고정) -->
        <div class="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <Button
            type="submit"
            class="w-full h-12 text-base font-medium bg-primary-400 hover:bg-primary-500 text-white rounded-lg shadow-sm transition-colors"
            :disabled="!isFormValid || isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <Loader2 class="h-4 w-4 animate-spin" />
              제출 중...
            </span>
            <span v-else>설문 제출하기</span>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter, useRoute } from 'vue-router'
import { surveyApi } from '@/apis/surveyApi'
import { CreateAnswerRequest } from '@/interfaces/surveyInterface'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Clock, Loader2 } from 'lucide-vue-next'

interface Question {
  id: number
  content: string
  type: string
  required: boolean
  options?: Array<{ id: number; content: string }>
}

const { showSuccess, showError } = useSnackbar()
const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const answers = ref<Record<number, any>>({})
const isLoading = ref(true)
const errors = ref<Record<number, string>>({})

const survey = ref({
  id: 0,
  title: '',
  description: '',
  status: '',
  endDate: '',
  endTime: '',
  questions: [] as Question[]
})

const fetchSurveyData = async () => {
  try {
    const surveyId = Number(route.params.id)
    const response = await surveyApi.getSurveyDetail(surveyId)
    const questionsData = await surveyApi.getQuestionsBySurveyId(surveyId)
    
    // required를 boolean으로 변환 (undefined인 경우 false)
    const questions: Question[] = questionsData.map((q) => ({
      ...q,
      required: q.required ?? false
    }))
    
    // endTime 포맷팅 (ISO 형식 또는 공백 구분 형식 처리)
    let endDate = ''
    let endTime = ''
    if (response.endTime) {
      if (response.endTime.includes('T')) {
        // ISO 형식 처리 (예: "2025-11-23T20:00:00")
        const [date, time] = response.endTime.split('T')
        endDate = date
        endTime = time ? time.substring(0, 5) : '' // HH:mm까지만 표시
      } else {
        // 공백으로 구분된 형식 처리
        const parts = response.endTime.split(' ')
        endDate = parts[0] || ''
        endTime = parts[1] ? parts[1].substring(0, 5) : '' // HH:mm까지만 표시
      }
    }
    
    survey.value = {
      id: surveyId,
      title: response.title,
      description: response.description,
      status: response.isActive ? 'active' : 'inactive',
      endDate: endDate,
      endTime: endTime,
      questions: questions
    }

    // 동적 제목 설정
    if (survey.value.title) {
      document.title = `${survey.value.title} 응답하기 :: ThinkFast`
    }

    // 초기값 설정 (척도형 질문은 3으로 초기화)
    questions.forEach((question: Question) => {
      if (question.type === 'SCALE') {
        answers.value[question.id] = [3]
      } else {
        answers.value[question.id] = question.type === 'MULTIPLE_CHOICE' ? null : ''
      }
    })

    if (response.isActive === false) {
      showError('설문이 종료되었습니다.')
      router.push('/')
    }
  } catch (error: any) {
    console.log(error || '설문을 불러오는데 실패했습니다.')
    router.push('/')
  } finally {
    isLoading.value = false
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  survey.value.questions.forEach((question: Question) => {
    if (question.required) {
      const answer = answers.value[question.id]
      if (
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        errors.value[question.id] = '필수 응답입니다'
        isValid = false
      }
    }
  })

  return isValid
}

const isFormValid = computed(() => {
  return survey.value.questions.every((question: Question) => {
    if (!question.required) return true
    const answer = answers.value[question.id]
    return answer !== undefined && answer !== null && answer !== '' && 
           !(Array.isArray(answer) && answer.length === 0)
  })
})

const submitResponse = async () => {
  if (!validateForm()) {
    showError('필수 항목을 모두 입력해주세요.')
    return
  }

  isSubmitting.value = true
  try {
    // 디바이스 ID 생성 (로컬 스토리지에 저장하여 일관성 유지)
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('deviceId', deviceId)
    }

    const payload: CreateAnswerRequest = {
      clientInfo: {
        deviceId: deviceId
      },
      answers: survey.value.questions.map((question: Question) => {
        const answer = answers.value[question.id]
        if (question.type === 'MULTIPLE_CHOICE') {
          return {
            questionId: question.id,
            type: question.type,
            optionId: answer,
            content: null
          }
        } else if (question.type === 'SUBJECTIVE') {
          return {
            questionId: question.id,
            type: question.type,
            optionId: null,
            content: answer
          }
        } else if (question.type === 'SCALE') {
          // Slider는 배열로 값을 반환하므로 첫 번째 값 사용
          const scaleValue = Array.isArray(answer) ? answer[0] : answer
          return {
            questionId: question.id,
            type: question.type,
            optionId: null,
            content: scaleValue?.toString() || null
          }
        }
        return {
          questionId: question.id,
          type: question.type,
          optionId: null,
          content: null
        }
      })
    }

    const response = await surveyApi.createAnswer(survey.value.id, payload)
    if (response.data?.success === true || response.success === true) {
      showSuccess('설문이 성공적으로 제출되었습니다.')
      router.push({
        path: '/survey-completion',
        query: { title: encodeURIComponent(survey.value.title) }
      })
    } else {
      showError(response.data?.message || response.message || '설문 제출에 실패했습니다.')
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      '설문 응답 제출에 실패했습니다.'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchSurveyData()
})
</script>

<style scoped>
.sticky {
  position: sticky;
}
</style>
