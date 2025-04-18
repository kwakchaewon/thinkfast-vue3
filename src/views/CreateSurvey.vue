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
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="py-8">
        <v-card class="content-card">
          <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
            <span class="text-h6">
              <v-icon color="primary" class="mr-2">mdi-plus-circle</v-icon>
              새 설문 만들기
            </span>
          </v-card-title>
          
          <v-card-text class="pa-4">
            <!-- 설문 제목 -->
            <v-text-field
              v-model="survey.title"
              label="설문 제목"
              required
              class="mb-4"
              outlined
              prepend-icon="mdi-format-title"
              hide-details
            ></v-text-field>

            <!-- 설문 설명 -->
            <v-textarea
              v-model="survey.description"
              label="설문 설명"
              rows="3"
              class="mb-4"
              outlined
              prepend-icon="mdi-text"
              hide-details
            ></v-textarea>

            <!-- 응답 제한 시간 -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="survey.endDate"
                      label="응답 종료 날짜"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="survey.endDate"
                    :min="minDate"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="timeMenu"
                  v-model="timeMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="survey.endTime"
                      label="종료 시각"
                      prepend-icon="mdi-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      hide-details
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="survey.endTime"
                    format="24hr"
                    @input="timeMenu = false"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>

            <!-- 질문 목록 -->
            <v-card
              v-for="(question, index) in survey.questions"
              :key="index"
              class="mt-6 mb-4"
              outlined
            >
              <v-card-title class="d-flex align-center px-4 py-2 bg-grey-lighten-5">
                <span class="text-subtitle-1">질문 {{ index + 1 }}</span>
                <v-spacer></v-spacer>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  density="comfortable"
                  color="error"
                  @click="removeQuestion(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="question.text"
                      label="질문"
                      required
                      outlined
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
                      outlined
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

                <!-- 객관식 옵션 -->
                <v-row v-if="question.type === 'multiple_choice'" class="mt-4">
                  <v-col cols="12">
                    <v-text-field
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      v-model="question.options[optionIndex]"
                      :label="`옵션 ${optionIndex + 1}`"
                      class="mb-2"
                      outlined
                      prepend-icon="mdi-checkbox-blank-circle-outline"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          density="comfortable"
                          color="error"
                          @click="removeOption(question, optionIndex)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                    <v-btn
                      variant="text"
                      color="primary"
                      class="mt-2"
                      @click="addOption(question)"
                      prepend-icon="mdi-plus"
                    >
                      옵션 추가
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- 질문 추가 버튼 -->
            <v-btn
              color="primary"
              class="mt-4"
              @click="addQuestion"
              block
              prepend-icon="mdi-plus"
            >
              질문 추가
            </v-btn>
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

    const menu = ref(false)
    const timeMenu = ref(false)
    const minDate = new Date().toISOString().substr(0, 10)
    const showNotifications = ref(false)
    const notifications = ref([])

    // store에서 사용자 정보 가져오기
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
      endDate: '',
      endTime: '',
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
      menu,
      timeMenu,
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
      saveSurvey
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
</style> 