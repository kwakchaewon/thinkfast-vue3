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
                :key="option"
                :label="option"
                :value="option"
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
import { defineComponent, ref, computed } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SurveyResponseView',
  setup() {
    const { showSuccess, showError } = useSnackbar()
    const router = useRouter()
    const form = ref()
    const isSubmitting = ref(false)
    const answers = ref<Record<string, any>>({})

    // 임시 설문 데이터
    const survey = ref({
      id: 1,
      title: '직장인 커피 소비 습관',
      description: '직장인들의 커피 소비 패턴과 선호도를 조사하는 설문입니다.',
      status: 'active',
      endDate: '2024-03-31',
      endTime: '23:59',
      questions: [
        {
          id: 1,
          content: '하루 평균 몇 잔의 커피를 마시나요?',
          type: 'MULTIPLE_CHOICE',
          required: true,
          options: ['1잔', '2잔', '3잔', '4잔 이상']
        },
        {
          id: 2,
          content: '가장 선호하는 커피 종류는 무엇인가요?',
          type: 'MULTIPLE_CHOICE',
          required: true,
          options: ['아메리카노', '라떼', '카푸치노', '에스프레소', '기타']
        },
        {
          id: 3,
          content: '커피를 마시는 주된 이유는 무엇인가요?',
          type: 'SUBJECTIVE',
          required: false
        },
        {
          id: 4,
          content: '커피 맛에 대한 만족도는 어떠신가요?',
          type: 'SCALE',
          required: true
        }
      ]
    })

    const isFormValid = computed(() => {
      return survey.value.questions.every(question => {
        if (!question.required) return true
        return answers.value[question.id] !== undefined && answers.value[question.id] !== ''
      })
    })

    const submitResponse = async () => {
      const { valid } = await form.value.validate()
      if (!valid) return

      isSubmitting.value = true
      try {
        // 임시 제출 처리
        console.log('설문 응답:', answers.value)
        showSuccess('설문이 성공적으로 제출되었습니다.')
        router.push('/')
      } catch (error) {
        showError('설문 제출에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      survey,
      answers,
      isSubmitting,
      isFormValid,
      submitResponse
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