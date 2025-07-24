<template>
  <HeaderMenu>
    <v-container fluid class="py-8">
      <v-row>
        <v-col cols="12" lg="8">
          <!-- 설문 기본 정보 -->
          <v-card class="mb-6 content-card">
            <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
              <span class="text-h6">
                <v-icon color="primary" class="mr-2">mdi-file-document-edit</v-icon>
                설문 기본 정보
              </span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-text-field
                v-model="survey.title"
                label="설문 제목"
                required
                class="mb-4"
                variant="outlined"
                prepend-icon="mdi-format-title"
                hide-details
              ></v-text-field>

              <v-textarea
                v-model="survey.description"
                label="설문 설명"
                rows="3"
                class="mb-4"
                variant="outlined"
                prepend-icon="mdi-text"
                hide-details
              ></v-textarea>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="survey.endDate"
                    label="응답 종료 날짜"
                    type="date"
                    :min="minDate"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <v-select
                      v-model="selectedHour"
                      label="시"
                      :items="hours"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="mr-2"
                      style="max-width: 100px"
                    ></v-select>
                    <v-select
                      v-model="selectedMinute"
                      label="분"
                      :items="minutes"
                      variant="outlined"
                      density="compact"
                      hide-details
                      style="max-width: 100px"
                    ></v-select>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- 질문 목록 -->
          <v-card class="content-card">
            <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
              <span class="text-h6">
                <v-icon color="primary" class="mr-2">mdi-format-list-checks</v-icon>
                질문 목록
              </span>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addQuestion"
                variant="text"
              >
                질문 추가
              </v-btn>
            </v-card-title>

            <v-card-text class="pa-4">
              <div v-if="survey.questions.length === 0" class="text-center py-12 text-grey">
                <v-icon size="48" class="mb-2">mdi-playlist-plus</v-icon>
                <div class="text-h6">질문을 추가해주세요</div>
                <div class="text-body-2">오른쪽 상단의 '질문 추가' 버튼을 클릭하여 새로운 질문을 추가할 수 있습니다.</div>
              </div>

              <v-expansion-panels v-else>
                <v-expansion-panel
                  v-for="(question, index) in survey.questions"
                  :key="index"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <span class="text-subtitle-1">질문 {{ index + 1 }}</span>
                      <v-chip
                        :color="question.required ? 'error' : 'grey'"
                        size="small"
                        class="ml-2"
                      >
                        {{ question.required ? '필수' : '선택' }}
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="question.content"
                          label="질문"
                          required
                          variant="outlined"
                          prepend-icon="mdi-help-circle"
                          hide-details
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="question.type"
                          :items="questionTypes"
                          label="질문 유형"
                          required
                          variant="outlined"
                          prepend-icon="mdi-format-list-bulleted-type"
                          hide-details
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-switch
                          v-model="question.required"
                          label="필수 질문"
                          color="primary"
                          class="mt-4"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>

                    <v-row v-if="question.type === QuestionType.MULTIPLE_CHOICE" class="mt-4">
                      <v-col cols="12">
                        <v-card variant="outlined" class="pa-4">
                          <div class="text-subtitle-2 mb-2">선택 옵션</div>
                          <div
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="d-flex align-center mb-2"
                          >
                            <v-text-field
                              v-model="question.options[optionIndex]"
                              :label="`옵션 ${optionIndex + 1}`"
                              variant="outlined"
                              density="compact"
                              hide-details
                              class="mr-2"
                              placeholder="옵션 내용을 입력하세요"
                            ></v-text-field>
                            <v-btn
                              icon="mdi-delete"
                              variant="text"
                              color="error"
                              density="compact"
                              @click="removeOption(index, optionIndex)"
                              :disabled="question.options.length <= 2"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-btn
                            variant="text"
                            color="primary"
                            class="mt-2"
                            prepend-icon="mdi-plus"
                            @click="addOption(index)"
                          >
                            옵션 추가
                          </v-btn>
                          <div v-if="question.options.length < 2" class="text-caption text-error mt-2">
                            객관식 질문은 최소 2개 이상의 옵션이 필요합니다
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row class="mt-4">
                      <v-col cols="12" class="text-right">
                        <v-btn
                          color="error"
                          variant="text"
                          prepend-icon="mdi-delete"
                          @click="removeQuestion(index)"
                        >
                          질문 삭제
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <!-- 설문 설정 -->
          <v-card class="content-card">
            <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
              <span class="text-h6">
                <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
                설문 설정
              </span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-account-multiple</v-icon>
                  </template>
                  <v-list-item-title>응답자 수</v-list-item-title>
                  <template v-slot:append>
                    <v-chip color="primary" size="small">무제한</v-chip>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-clock-outline</v-icon>
                  </template>
                  <v-list-item-title>응답 시간 제한</v-list-item-title>
                  <template v-slot:append>
                    <v-chip color="grey" size="small">없음</v-chip>
                  </template>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-eye</v-icon>
                  </template>
                  <v-list-item-title>결과 공개</v-list-item-title>
                  <template v-slot:append>
                    <v-switch
                      v-model="survey.showResults"
                      color="primary"
                      hide-details
                    ></v-switch>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                size="large"
                @click="handleCreateSurvey"
                prepend-icon="mdi-content-save"
              >
                설문 저장
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
     </HeaderMenu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { useStore } from 'vuex'
import { surveyApi } from '@/apis/surveyApi'
import { QuestionType, CreateSurveyRequest } from '@/interfaces/surveyInterface'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'

const router = useRouter()
const store = useStore()
const { showSuccess, showError } = useSnackbar()


const showDatePicker = ref(false)
const showTimePicker = ref(false)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})
const showNotifications = ref(false)
const notifications = ref([])

const username = computed(() => store.state.username || '사용자')

const questionTypes = [
  { title: '객관식', value: QuestionType.MULTIPLE_CHOICE },
  { title: '주관식', value: QuestionType.SUBJECTIVE }
]

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

const selectedHour = ref('00')
const selectedMinute = ref('00')

const survey = ref<CreateSurveyRequest>({
  title: '',
  description: '',
  endDate: '',
  endTime: '00:00',
  showResults: true,
  questions: [],
})

// 시간 선택이 변경될 때마다 survey.endTime을 업데이트
watch([selectedHour, selectedMinute], ([hour, minute]) => {
  survey.value.endTime = `${hour}:${minute}`
})

const addQuestion = () => {
  survey.value.questions.push({
    content: '',
    type: QuestionType.SUBJECTIVE,
    required: false,
    options: ['', ''],
    orderIndex: survey.value.questions.length + 1
  })
}

const removeQuestion = (index: number) => {
  survey.value.questions.splice(index, 1)
  // 질문이 삭제된 후 남은 질문들의 orderIndex를 재정렬
  survey.value.questions.forEach((question, idx) => {
    question.orderIndex = idx + 1
  })
}

const addOption = (questionIndex: number) => {
  survey.value.questions[questionIndex].options?.push('')
}

const removeOption = (questionIndex: number, optionIndex: number) => {
  survey.value.questions[questionIndex].options?.splice(optionIndex, 1)
}



const handleDateSelect = (date: string) => {
  survey.value.endDate = date
  showDatePicker.value = false
}

const handleTimeSelect = (time: string) => {
  survey.value.endTime = time
  showTimePicker.value = false
}

const handleCreateSurvey = async () => {
  try {
    // 필수 필드 검증
    if (!survey.value.title) {
      showError('설문 제목을 입력해주세요')
      return
    }

    if (!survey.value.endDate) {
      showError('응답 종료 날짜를 지정해주세요')
      return
    }

    if (!survey.value.endTime) {
      showError('응답 종료 시각을 지정해주세요')
      return
    }

    // 종료 날짜와 시각이 현재보다 이전인지 확인
    const endDateTime = new Date(survey.value.endDate)
    endDateTime.setHours(parseInt(survey.value.endTime.split(':')[0]))
    endDateTime.setMinutes(parseInt(survey.value.endTime.split(':')[1]))
    const now = new Date()
    if (endDateTime <= now) {
      showError('종료 날짜와 시각은 현재보다 이후여야 합니다')
      return
    }

    if (survey.value.questions.length === 0) {
      showError('최소 하나 이상의 질문을 추가해주세요')
      return
    }

    // 질문 내용 검증
    for (const question of survey.value.questions) {
      if (!question.content) {
        showError('모든 질문의 내용을 입력해주세요')
        return
      }

      if (question.type === QuestionType.MULTIPLE_CHOICE && 
          (!question.options || question.options.length < 2)) {
        showError('객관식 질문은 최소 2개 이상의 옵션이 필요합니다')
        return
      }
    }

    // API 호출
    await surveyApi.createSurvey(survey.value)
    showSuccess('설문이 성공적으로 생성되었습니다')
    router.push('/main')
  } catch (error) {
    showError('설문 생성 중 오류가 발생했습니다')
    console.error(error)
  }
}


</script>

<style scoped>
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.question-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.add-option-btn {
  border: 2px dashed #ccc;
  color: #666;
}

.add-option-btn:hover {
  border-color: #1976d2;
  color: #1976d2;
}

.profile-item {
  min-height: 64px;
}

.notification-btn {
  margin-right: -8px;
}

.logout-item {
  margin-top: auto;
}

.copyright-item {
  padding: 8px 16px;
  opacity: 0.7;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: grey-lighten-4;
}

.v-expansion-panels {
  background: transparent;
}

.v-expansion-panel {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  margin-bottom: 8px;
}

.v-expansion-panel:last-child {
  margin-bottom: 0;
}

:deep(.v-date-picker) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.v-time-picker) {
  border: none !important;
  box-shadow: none !important;
}

/* 스크롤 관련 스타일 추가 */
.v-main {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
}

.v-container {
  min-height: 100%;
  padding-bottom: 32px;
}

.v-navigation-drawer {
  height: 100vh !important;
  position: fixed !important;
}

.v-navigation-drawer__content {
  overflow-y: auto;
}

.time-input :deep(input) {
  text-align: center;
  font-family: monospace;
}
</style> 