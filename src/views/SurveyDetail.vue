<template>
  <v-layout class="rounded rounded-md">
    <!-- 모바일: AppBar + 상단 block 메뉴만 (Sidebar 절대 렌더링 안함) -->
    <div v-if="isMobile">
      <v-app-bar color="#e0e3e8" flat app>
        <v-app-bar-nav-icon @click="menuOpen = !menuOpen" :class="{ 'menu-active': menuOpen }" />
        <v-toolbar-title class="font-weight-bold">ThinkFast</v-toolbar-title>
      </v-app-bar>
      <v-slide-y-transition>
        <v-sheet v-if="menuOpen" class="mobile-header-bar elevation-1">
          <v-list nav>
            <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="대시보드" @click="menuOpen = false" />
            <v-list-item to="/create-survey" prepend-icon="mdi-plus" title="새 설문 만들기" @click="menuOpen = false" />
            <v-list-item to="/all-surveys" prepend-icon="mdi-poll" title="전체 설문" @click="menuOpen = false" />
            <v-list-item to="/my-surveys" prepend-icon="mdi-poll" title="내 설문" @click="menuOpen = false" />
            <v-list-item to="/available" prepend-icon="mdi-vote" title="참여 가능한 설문" @click="menuOpen = false" />
            <v-divider class="my-2" />
            <v-list-item to="/results" prepend-icon="mdi-chart-box" title="설문 결과" @click="menuOpen = false" />
            <v-list-item to="/insights" prepend-icon="mdi-chart-timeline-variant" title="인사이트" @click="menuOpen = false" />
            <v-divider class="my-2" />
            <v-list-item prepend-icon="mdi-logout" title="로그아웃" @click="handleLogout" />
          </v-list>
        </v-sheet>
      </v-slide-y-transition>
    </div>
    <!-- 데스크탑: 고정 사이드바만 (모바일에서는 절대 렌더링 안함) -->
    <Sidebar v-if="!isMobile" />
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
                  @click="goToResults"
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
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getQuestionsResponse, GetSurveyDetailResponse } from '@/interfaces/surveyInterface'
import Sidebar from '@/components/common/Sidebar.vue'
import { useDisplay } from 'vuetify'
import { authApi } from '@/apis/authApi'

export default defineComponent({
  name: 'SurveyDetailView',
  components: {
    QrcodeVue,
    Sidebar
  },
  setup() {
    const { showSuccess, showError } = useSnackbar()
    const router = useRouter()
    const route = useRoute()
    const surveyId = computed(() => Number(route.params.id))
    const showResults = ref(false)
    const showDeleteDialog = ref(false)
    const isLoading = ref(false)
    const menuOpen = ref(false) // 모바일 메뉴 상태

    const survey = ref<GetSurveyDetailResponse>({
      id: 0,
      title: '',
      description: '',
      isActive: false,
      endTime: '',
      responseCount: 0,
      questions: []
    })

    const shareUrl = computed(() => `http://localhost:5173/survey/${route.params.id}/create-response`)

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
      } catch (error) {
        router.push('/')
      } finally {
        isLoading.value = false
      }
    }

    const goToResults = () => {
      router.push(`/survey/${surveyId.value}/results`)
    }

    const { smAndDown } = useDisplay()
    const isMobile = computed(() => smAndDown.value)

    const handleLogout = async () => {
      try {
        await authApi.logout()
        showSuccess('로그아웃에 성공했습니다.')
        menuOpen.value = false
      } catch (error) {
        console.error('Logout failed:', error)
      }
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

    return {
      survey,
      showResults,
      questionTypeLabels,
      handleDelete,
      showDeleteDialog,
      confirmDelete,
      shareUrl,
      copyShareUrl,
      goToResults,
      menuOpen,
      handleLogout,
      isMobile
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

.content-card {
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.content-card .v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

.mobile-header-bar {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
  left: 0;
  z-index: 10;
}

.menu-active {
  background: #d1d5db !important;
  border-radius: 50%;
}

@media (max-width: 600px) {
  .mobile-header-bar {
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    width: 100vw;
    left: 0;
  }
}
</style> 