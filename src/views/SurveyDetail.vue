<template>
  <v-layout class="rounded rounded-md">
    <!-- 사이드바 -->
    <v-navigation-drawer
      permanent
      color="grey-lighten-4"
      width="280"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="userName"
          :subtitle="userEmail"
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

            <!-- 알림 메뉴 -->
            <v-menu
              v-model="showNotifications"
              :close-on-content-click="false"
              location="bottom end"
              offset="10"
            >
              <v-card min-width="300" max-width="400" class="notification-menu">
                <div class="d-flex align-center px-4 py-2 bg-grey-lighten-4">
                  <span class="text-h6">알림</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    density="compact"
                    size="small"
                    @click="showNotifications = false"
                  >
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-divider></v-divider>
                <v-list>
                  <v-list-subheader class="d-flex align-center px-4">
                    <v-btn
                      variant="text"
                      density="compact"
                      color="primary"
                      class="text-caption px-0"
                      @click="markAllAsRead"
                    >
                      모두 읽음 처리
                    </v-btn>
                  </v-list-subheader>
                  <v-list-item
                    v-for="notification in notifications"
                    :key="notification.id"
                    :subtitle="notification.time"
                    class="py-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="notification.color" size="36">
                        <v-icon color="white" size="small">
                          {{ notification.icon }}
                        </v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2 mb-1">
                      {{ notification.title }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="notifications.length === 0">
                    <v-list-item-title class="text-center text-subtitle-1 py-4">
                      새로운 알림이 없습니다
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="대시보드"
          value="dashboard"
          to="/"
        ></v-list-item>
        
        <v-list-subheader>설문 관리</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-plus"
          title="새 설문 만들기"
          value="create"
          to="/create-survey"
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

    <!-- 메인 컨텐츠 -->
    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pb-16">
        <!-- 설문 정보 헤더 -->
        <v-card class="mb-4">
          <v-card-item>
            <div class="d-flex align-center justify-space-between">
              <div>
                <v-chip
                  :color="survey.isActive == true ? 'success' : 'error'"
                  size="small"
                  class="mb-2"
                >
                  {{ survey.isActive == true ? '진행중' : '종료' }}
                </v-chip>
                <h1 class="text-h4 mb-2">{{ survey.title }}</h1>
                <p class="text-body-1 text-grey">{{ survey.description }}</p>
              </div>
              <div class="text-right">
                <div class="text-caption text-grey mb-1">마감일</div>
                <div class="text-body-2 mb-4">{{ survey.endTime }}</div>
                <div class="d-flex justify-end gap-2">
                  <!-- <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-pencil"
                    @click="handleEdit"
                  >
                    수정
                  </v-btn> -->
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-delete"
                    @click="handleDelete"
                  >
                    삭제
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>

        <!-- 통계 카드 -->
<!--        <v-row>-->
<!--          <v-col cols="12" sm="6" lg="3">-->
<!--            <v-card class="stat-card">-->
<!--              <v-card-item>-->
<!--                <v-card-title class="text-subtitle-1 mb-2">총 응답수</v-card-title>-->
<!--                <div class="d-flex align-center">-->
<!--&lt;!&ndash;                  <span class="text-h4">{{ survey.responseCount }}</span>&ndash;&gt;-->
<!--                  <span class="text-h4">10</span>-->
<!--                  <v-icon color="success" class="ms-3">mdi-trending-up</v-icon>-->
<!--                </div>-->
<!--              </v-card-item>-->
<!--            </v-card>-->
<!--          </v-col>-->

<!--          <v-col cols="12" sm="6" lg="3">-->
<!--            <v-card class="stat-card">-->
<!--              <v-card-item>-->
<!--                <v-card-title class="text-subtitle-1 mb-2">응답률</v-card-title>-->
<!--                <div class="d-flex align-center">-->
<!--                  <span class="text-h4"> 100%</span>-->
<!--                  &lt;!&ndash; <span class="text-h4">{{ survey.responseRate }}%</span> &ndash;&gt;-->
<!--                  <v-chip color="success" size="small" class="ms-3">+5%</v-chip>-->
<!--                </div>-->
<!--              </v-card-item>-->
<!--            </v-card>-->
<!--          </v-col>-->

<!--          <v-col cols="12" sm="6" lg="3">-->
<!--            <v-card class="stat-card">-->
<!--              <v-card-item>-->
<!--                <v-card-title class="text-subtitle-1 mb-2">평균 응답 시간</v-card-title>-->
<!--                <div class="d-flex align-center">-->
<!--                  <span class="text-h4">10분</span>-->
<!--                  &lt;!&ndash; <span class="text-h4">{{ survey.avgResponseTime }}분</span> &ndash;&gt;-->
<!--                  <v-icon color="info" class="ms-3">mdi-information</v-icon>-->
<!--                </div>-->
<!--              </v-card-item>-->
<!--            </v-card>-->
<!--          </v-col>-->

<!--          <v-col cols="12" sm="6" lg="3">-->
<!--            <v-card class="stat-card">-->
<!--              <v-card-item>-->
<!--                <v-card-title class="text-subtitle-1 mb-2">완료율</v-card-title>-->
<!--&lt;!&ndash;                <div class="d-flex align-center">&ndash;&gt;-->
<!--&lt;!&ndash;                  <span class="text-h4">{{ survey.completionRate }}%</span>&ndash;&gt;-->
<!--&lt;!&ndash;                  <v-chip color="warning" size="small" class="ms-3">New</v-chip>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--                <div class="d-flex align-center">-->
<!--                  <span class="text-h4">95%</span>-->
<!--                  <v-chip color="warning" size="small" class="ms-3">New</v-chip>-->
<!--                </div>-->
<!--              </v-card-item>-->
<!--            </v-card>-->
<!--          </v-col>-->
<!--        </v-row>-->

        <!-- 설문 공유 -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="content-card">
              <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
                <span class="text-h6">설문 공유</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-content-copy"
                  @click="copyShareUrl"
                >
                  URL 복사
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="4" class="text-center">
                    <div class="mb-4">
                      <qrcode-vue
                        :value="shareUrl"
                        :size="200"
                        level="H"
                        class="mx-auto"
                      />
                    </div>
                    <div class="text-caption text-grey">
                      QR 코드를 스캔하여 설문에 참여하세요
                    </div>
                  </v-col>
                  <v-col cols="12" md="8">
                    <div class="d-flex flex-column h-100">
                      <div class="mb-4">
                        <div class="text-subtitle-2 mb-2">공유 URL</div>
                        <v-text-field
                          :model-value="shareUrl"
                          readonly
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="mb-2"
                        >
                          <template v-slot:append>
                            <v-btn
                              icon="mdi-content-copy"
                              variant="text"
                              size="small"
                              @click="copyShareUrl"
                            ></v-btn>
                          </template>
                        </v-text-field>
                        <div class="text-caption text-grey">
                          URL을 복사하여 설문을 공유하세요
                        </div>
                      </div>
                      <div class="mt-auto">
                        <div class="text-subtitle-2 mb-2">응답 현황</div>
                        <!-- <v-progress-linear
                          :model-value="survey.responseRate"
                          color="primary"
                          height="8"
                          rounded
                        ></v-progress-linear> -->
                        <!-- <div class="d-flex justify-space-between mt-2">
                          <span class="text-caption text-grey">응답률</span>
                          <span class="text-caption">{{ survey.responseRate }}%</span>
                        </div> -->
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 설문 질문 목록 -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="content-card">
              <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
                <span class="text-h6">설문 질문</span>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="showResults = true"
                >
                  결과 보기
                  <v-icon end>mdi-chart-bar</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list>
                  <v-list-item
                    v-for="(question, index) in survey.questions"
                    :key="question.id"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <div class="question-number">{{ index + 1 }}</div>
                    </template>
                    <v-list-item-title class="text-h6 mb-2">
                      {{ question.content }}
                      <!-- <v-chip
                        v-if="question.required"
                        color="error"
                        size="small"
                        class="ms-2"
                      > -->
                      <v-chip
                        color="error"
                        size="small"
                        class="ms-2"
                      >
                        필수
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption text-grey mb-2">
                      {{ questionTypeLabels[question.type] }}
                    </v-list-item-subtitle>
                    <v-list-item-text>
                      <div v-if="question.type === 'MULTIPLE_CHOICE'">
                        <v-chip
                          v-for="option in question.options"
                          :key="option.id"
                          class="me-2 mb-2"
                        >
                          {{ option.content }}
                        </v-chip>
                      </div>
                      <div v-else-if="question.type === 'SCALE'">
                        <v-slider
                          :min="1"
                          :max="5"
                          :step="1"
                          readonly
                          class="mt-4"
                        ></v-slider>
                        <div class="d-flex justify-space-between text-caption text-grey">
                          <span>매우 불만족</span>
                          <span>매우 만족</span>
                        </div>
                      </div>
                      <div v-else>
                        <v-textarea
                          placeholder="주관식 응답"
                          readonly
                          auto-grow
                          rows="1"
                        ></v-textarea>
                      </div>
                    </v-list-item-text>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>

  <!-- 삭제 확인 다이얼로그 -->
  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">설문 삭제</v-card-title>
      <v-card-text>
        정말로 이 설문을 삭제하시겠습니까?<br>
        삭제된 설문은 복구할 수 없습니다.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="showDeleteDialog = false"
        >
          취소
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="confirmDelete"
        >
          삭제
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getQuestionsResponse, GetSurveyDetailResponse } from '@/interfaces/surveyInterface'

export default defineComponent({
  name: 'SurveyDetailView',
  components: {
    QrcodeVue
  },
  setup() {
    const { showSuccess, showError } = useSnackbar()
    const router = useRouter()
    const route = useRoute()
    const surveyId = Number(route.params.id)
    const userName = ref('Andrew Kwak')
    const userEmail = ref('andrew@example.com')
    const showNotifications = ref(false)
    const showResults = ref(false)
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

    const notifications = ref([
      {
        id: 1,
        title: '"직장인 커피 소비 습관" 설문이 종료되었습니다',
        time: '방금 전',
        icon: 'mdi-poll',
        color: 'primary'
      },
      {
        id: 2,
        title: '"재택근무 만족도 조사"에 새로운 응답이 있습니다',
        time: '10분 전',
        icon: 'mdi-message-reply',
        color: 'success'
      }
    ])

    const shareUrl = computed(() => `http://localhost:5173/survey/${route.params.id}/create-response`)

    const markAllAsRead = () => {
      notifications.value = []
      showNotifications.value = false
    }

    const handleLogout = async () => {
      try {
        await authApi.logout()
        showSuccess('로그아웃에 성공했습니다.')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    const handleEdit = () => {
      router.push(`/edit-survey/${survey.value.id}`)
    }

    const handleDelete = () => {
      showDeleteDialog.value = true
    }

    const confirmDelete = async () => {
      try {
        await surveyApi.deleteSurvey(surveyId)
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
        const surveyDetail = await surveyApi.getSurveyDetail(surveyId)
        const questions = await surveyApi.getQuestionsBySurveyId(surveyId)
        
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
      } catch (error) {
        router.push('/')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchSurveyDetail()
    })

    return {
      userName,
      userEmail,
      notifications,
      showNotifications,
      markAllAsRead,
      handleLogout,
      survey,
      showResults,
      questionTypeLabels,
      handleEdit,
      handleDelete,
      showDeleteDialog,
      confirmDelete,
      shareUrl,
      copyShareUrl
    }
  }
})
</script>

<style scoped>
.v-main {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
}

.v-container {
  min-height: 100%;
  padding-bottom: 32px;
}

.profile-item {
  min-height: 72px;
  padding: 12px 16px;
}

.profile-item :deep(.v-list-item__prepend) {
  padding-right: 16px;
}

.notification-btn {
  margin-left: 8px;
}

.notification-menu {
  margin-top: 8px;
}

.v-list-item-title {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stat-card {
  height: 100%;
}

.stat-card .v-card-item {
  height: 100px;
  padding: 16px;
}

.stat-card .v-card-title {
  opacity: 0.7;
}

.content-card {
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.content-card .v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.logout-item {
  margin-top: auto;
  color: #FF5252;
}

.logout-item :deep(.v-list-item__prepend) {
  color: #FF5252;
}

.copyright-item {
  padding: 8px 16px;
  opacity: 0.7;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: grey-lighten-4;
}

.question-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-weight: 500;
}

.gap-2 {
  gap: 8px;
}

.h-100 {
  height: 100%;
}
</style> 