<template>
  <v-container class="pa-0">
    <!-- 설문 정보 헤더 -->
    <v-card class="mb-4" flat>
      <v-card-item class="pa-4">
        <v-chip
          :color="survey.status === 'active' ? 'success' : 'error'"
          size="small"
          class="mb-2"
        >
          {{ survey.status === 'active' ? '진행중' : '종료' }}
        </v-chip>
        <h1 class="text-h5 mb-2">{{ survey.title }}</h1>
        <p class="text-body-2 text-grey">{{ survey.description }}</p>
        <div class="d-flex align-center mt-2">
          <v-icon size="small" class="me-1">mdi-clock-outline</v-icon>
          <span class="text-caption text-grey">마감일: {{ survey.endDate }} {{ survey.endTime }}</span>
        </div>
      </v-card-item>
    </v-card>

    <!-- 설문 질문 목록 -->
    <v-form ref="form" @submit.prevent="submitResponse">
      <v-card v-for="(question, index) in survey.questions" :key="question.id" class="mb-4" flat>
        <v-card-item class="pa-4">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-1 font-weight-medium">{{ index + 1 }}.</span>
            <span class="text-subtitle-1 ms-2">{{ question.content }}</span>
            <v-chip
              v-if="question.required"
              color="error"
              size="small"
              class="ms-2"
            >
              필수
            </v-chip>
          </div>

          <!-- 객관식 질문 -->
          <div v-if="question.type === 'MULTIPLE_CHOICE'" class="mt-4">
            <v-radio-group
              v-model="answers[question.id]"
              :rules="question.required ? [v => !!v || '필수 응답입니다'] : []"
            >
              <v-radio
                v-for="option in question.options"
                :key="option.id"
                :label="option.content"
                :value="option.id"
                class="mb-2"
              ></v-radio>
            </v-radio-group>
          </div>

          <!-- 주관식 질문 -->
          <div v-else-if="question.type === 'SUBJECTIVE'" class="mt-4">
            <v-textarea
              v-model="answers[question.id]"
              :rules="question.required ? [v => !!v || '필수 응답입니다'] : []"
              variant="outlined"
              density="compact"
              placeholder="답변을 입력하세요"
              auto-grow
              rows="3"
              hide-details="auto"
            ></v-textarea>
          </div>

          <!-- 척도형 질문 -->
          <div v-else-if="question.type === 'SCALE'" class="mt-4">
            <v-slider
              v-model="answers[question.id]"
              :rules="question.required ? [v => !!v || '필수 응답입니다'] : []"
              :min="1"
              :max="5"
              :step="1"
              thumb-label
              color="primary"
              class="mt-4"
            >
              <template v-slot:thumb-label="{ modelValue }">
                {{ modelValue }}
              </template>
            </v-slider>
            <div class="d-flex justify-space-between text-caption text-grey mt-1">
              <span>매우 불만족</span>
              <span>매우 만족</span>
            </div>
          </div>
        </v-card-item>
      </v-card>

      <!-- 제출 버튼 -->
      <div class="sticky-bottom pa-4 bg-white">
        <v-btn
          block
          color="primary"
          size="large"
          type="submit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          설문 제출하기
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter, useRoute } from 'vue-router'
import { surveyApi } from '@/apis/surveyApi'
import { CreateAnswerRequest } from '@/interfaces/surveyInterface'

interface Question {
  id: number
  content: string
  type: string
  required: boolean
  options?: any[]
}

export default defineComponent({
  name: 'SurveyResponseView',
  setup() {
    const { showSuccess, showError } = useSnackbar()
    const router = useRouter()
    const route = useRoute()
    const form = ref()
    const isSubmitting = ref(false)
    const answers = ref<Record<string, any>>({})
    const isLoading = ref(true)

    const survey = ref({
      id: 0,
      title: '',
      description: '',
      status: '',
      endTime: '',
      questions: [] as Question[]
    })

    const fetchSurveyData = async () => {
      try {
        const surveyId = Number(route.params.id)
        const response = await surveyApi.getSurveyDetail(surveyId)
        const questions = await surveyApi.getQuestionsBySurveyId(surveyId)

        survey.value = {
          id: surveyId,
          title: response.title,
          description: response.description,
          status: response.isActive ? 'active' : 'inactive',
          endTime: response.endTime,
          questions: questions
        }
      } catch (error: any) {
        showError(error.response?.data?.message || '설문을 불러오는데 실패했습니다.')
        router.push('/')
      } finally {
        isLoading.value = false
      }
    }

    const isFormValid = computed(() => {
      return survey.value.questions.every((question: Question) => {
        if (!question.required) return true
        return answers.value[question.id] !== undefined && answers.value[question.id] !== ''
      })
    })

    const submitResponse = async () => {
      const { valid } = await form.value.validate()
      if (!valid) return

      isSubmitting.value = true
      try {
        const payload: CreateAnswerRequest = {
          answers: survey.value.questions.map((question: Question) => ({
            questionId: question.id,
            type: question.type,
            optionId: question.type === 'MULTIPLE_CHOICE' ? answers.value[question.id] : null,
            content: question.type === 'SUBJECTIVE' ? answers.value[question.id] : null
          }))
        }

        const response = await surveyApi.createAnswer(survey.value.id, payload)
        if (response.data.success === true) {
          showSuccess('설문이 성공적으로 제출되었습니다.')
          router.push('/')
        } else {
          showError(response.data.message)
        }
      } catch (error) {
        showError('설문 제출에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      fetchSurveyData()
    })

    return {
      form,
      survey,
      answers,
      isSubmitting,
      isFormValid,
      submitResponse,
      isLoading
    }
  }
})
</script>

<style scoped>
.sticky-bottom {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 