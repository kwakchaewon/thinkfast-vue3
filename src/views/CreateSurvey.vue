<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer
      permanent
      color="grey-lighten-4"
      width="280"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="username"
          class="profile-item"
        >
          <template v-slot:append>
            <div class="d-flex align-center">
              <v-badge
                :content="notifications.length.toString()"
                :model-value="notifications.length > 0"
                color="error"
                offset-x="12"
              >
                <v-btn
                  icon="mdi-bell"
                  variant="text"
                  @click="showNotifications = true"
                  class="notification-btn"
                >
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </v-badge>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="대시보드"
          value="dashboard"
          to="/main"
        ></v-list-item>
        
        <v-list-subheader>설문 관리</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-plus"
          title="새 설문 만들기"
          value="create"
          active
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-poll"
          title="내 설문"
          value="my-surveys"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-vote"
          title="참여 가능한 설문"
          value="available"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-subheader>분석</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-chart-box"
          title="설문 결과"
          value="results"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-chart-timeline-variant"
          title="인사이트"
          value="insights"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>
        
        <v-list-item
          prepend-icon="mdi-logout"
          title="로그아웃"
          value="logout"
          @click="handleLogout"
          class="logout-item"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list-item class="copyright-item">
        <v-list-item-title class="text-caption text-grey">
          © 2024 Andrew Kwak. All rights reserved.
        </v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-3">
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
                    <v-text-field
                      v-model="survey.endTime"
                      label="종료 시각"
                      type="time"
                      prepend-inner-icon="mdi-clock"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
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
                            v-model="question.text"
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

                      <v-row v-if="question.type === 'multiple_choice'" class="mt-4">
                        <v-col cols="12">
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
                            ></v-text-field>
                            <v-btn
                              icon="mdi-delete"
                              variant="text"
                              color="error"
                              density="compact"
                              @click="removeOption(question, optionIndex)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-btn
                            variant="text"
                            color="primary"
                            class="mt-2"
                            prepend-icon="mdi-plus"
                            @click="addOption(question)"
                          >
                            옵션 추가
                          </v-btn>
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
                  @click="saveSurvey"
                  prepend-icon="mdi-content-save"
                >
                  설문 저장
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { useStore } from 'vuex'

export default {
  name: 'CreateSurvey',
  setup() {
    const router = useRouter()
    const store = useStore()
    const { showSuccess, showError } = useSnackbar()

    const showDatePicker = ref(false)
    const showTimePicker = ref(false)
    const minDate = new Date().toISOString().substr(0, 10)
    const showNotifications = ref(false)
    const notifications = ref([])

    const username = computed(() => store.state.username || '사용자')

    const questionTypes = [
      { text: '객관식', value: 'multiple_choice' },
      { text: '주관식', value: 'text' },
      { text: '단답형', value: 'short_text' },
      { text: '장문형', value: 'long_text' }
    ]

    const survey = ref({
      title: '',
      description: '',
      endDate: new Date().toISOString().substr(0, 10),
      endTime: '00:00',
      showResults: false,
      questions: []
    })

    const addQuestion = () => {
      survey.value.questions.push({
        text: '',
        type: 'multiple_choice',
        required: false,
        options: ['옵션 1', '옵션 2']
      })
    }

    const removeQuestion = (index) => {
      survey.value.questions.splice(index, 1)
    }

    const addOption = (question) => {
      question.options.push('')
    }

    const removeOption = (question, index) => {
      question.options.splice(index, 1)
    }

    const handleLogout = () => {
      store.dispatch('logout')
      router.push('/')
    }

    const handleDateSelect = (date) => {
      survey.value.endDate = date
      showDatePicker.value = false
    }

    const handleTimeSelect = (time) => {
      survey.value.endTime = time
      showTimePicker.value = false
    }

    const saveSurvey = async () => {
      try {
        // TODO: API 호출로 설문 저장
        showSuccess('설문이 저장되었습니다.')
        router.push('/main')
      } catch (error) {
        showError('설문 저장에 실패했습니다.')
      }
    }

    return {
      showDatePicker,
      showTimePicker,
      minDate,
      questionTypes,
      survey,
      showNotifications,
      notifications,
      username,
      addQuestion,
      removeQuestion,
      addOption,
      removeOption,
      handleLogout,
      saveSurvey,
      handleDateSelect,
      handleTimeSelect
    }
  }
}
</script>

<style scoped>
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style> 