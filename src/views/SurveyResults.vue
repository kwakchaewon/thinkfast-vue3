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
                  :color="survey.isActive ? 'success' : 'error'"
                  size="small"
                  class="mb-2"
                >
                  {{ survey.isActive ? '진행중' : '종료' }}
                </v-chip>
                <h1 class="text-h4 mb-2">{{ survey.title }}</h1>
                <p class="text-body-1 text-grey">{{ survey.description }}</p>
              </div>
              <div class="text-right">
                <div class="text-caption text-grey mb-1">마감일</div>
                <div class="text-body-2 mb-4">{{ survey.endTime }}</div>
              </div>
            </div>
          </v-card-item>
        </v-card>

        <!-- 요약 리포트 카드 -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
            <span class="text-h6">설문 요약 리포트</span>
            <v-spacer></v-spacer>
            <span class="text-caption text-grey">총 {{ survey.responseCount }}명 참여</span>
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="d-flex flex-column gap-6">
              <!-- 주요 포지션 -->
              <div>
                <div class="text-subtitle-1 font-weight-medium mb-3">주요 포지션</div>
                <div class="text-body-1">{{ summary.mainPosition }}</div>
                <div class="text-caption text-grey mt-1">전체 응답자의 45%가 선택</div>
              </div>

              <!-- 개선 사항 -->
              <div>
                <div class="text-subtitle-1 font-weight-medium mb-3">개선 사항</div>
                <div class="d-flex flex-column gap-2">
                  <div 
                    v-for="(item, index) in summary.improvements" 
                    :key="index"
                    class="d-flex align-center"
                  >
                    <span class="text-body-1 me-2">{{ index + 1 }}.</span>
                    <span class="text-body-1">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 설문 질문 섹션 -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card class="content-card">
              <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
                <span class="text-h6">응답 결과</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list>
                  <v-list-item
                    v-for="(question, index) in questions"
                    :key="index"
                    class="mb-6 pa-0"
                    style="background: none; border: none;"
                  >
                    <v-card class="pa-0" style="border-radius: 14px; box-shadow: 0 2px 8px rgba(33,150,243,0.04); border: 1px solid #e0e0e0;">
                      <!-- 헤더 -->
                      <v-card-title class="d-flex align-center justify-space-between px-6 py-4" style="background: #f5f7fa;">
                        <div class="d-flex align-center" style="gap: 12px;">
                          <div class="question-number">{{ index + 1 }}</div>
                          <div class="text-h6">
                            {{ question.content }}
                            <v-chip
                              v-if="question.required"
                              color="error"
                              size="small"
                              class="ms-2"
                            >필수</v-chip>
                          </div>
                        </div>
                        <v-btn
                          variant="text"
                          color="primary"
                          size="small"
                          @click="viewAllResponses(index)"
                        >
                          전체 응답 보기
                          <v-icon end>mdi-eye</v-icon>
                        </v-btn>
                      </v-card-title>
                      <!-- 바디 -->
                      <v-card-text class="pa-6">
                        <div class="text-caption text-grey mb-2">{{ question.type }}</div>
                        <v-list-item-text>
                          <!-- 기존 응답 결과, 차트, 워드클라우드 등 -->
                          <div v-if="question.type === '객관식'" class="d-flex flex-wrap gap-2 mb-2">
                            <!-- <v-chip
                              v-for="option in question.options"
                              :key="option"
                              class="me-2 mb-2"
                            >{{ option }}</v-chip> -->
                          </div>
                          <v-row v-if="question.type === '객관식'" class="graph-insight-row mb-4" align="center">
                            <v-col cols="12" md="6" class="d-flex justify-center">
                              <Doughnut :data="chartData" :options="chartOptions" style="width:380px; height:380px;" />
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex align-center">
                              <div class="insight-text">
                                정글과 미드가 응답자의 절반 이상을 차지하며,<br>
                                원딜, 탑, 서포터는 동일한 비율로 나타났습니다.
                              </div>
                            </v-col>
                          </v-row>
                          <v-row v-if="question.type === '주관식'" class="mt-4" align="center">
                            <v-col cols="12" md="6">
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
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex align-center">
                              <div class="insight-text">
                                응답자들은 '매칭 시스템'에 대한 개선 요청이 가장 많았으며, <br>그 뒤를 '클라이언트 안정성'과 '버그 수정'에 대한 의견이 차지했습니다.
                              </div>
                            </v-col>
                          </v-row>
                        </v-list-item-text>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>

  <!-- 전체 응답 모달 -->
  <v-dialog v-model="showResponsesModal" max-width="500">
    <v-card>
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        전체 응답 보기
        <v-btn icon variant="text" @click="showResponsesModal = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="selectedQuestionIndex !== null">
          <div class="mb-2 text-subtitle-2">질문: {{ questions[selectedQuestionIndex].content }}</div>
          <v-divider class="mb-2"></v-divider>
          <div v-if="allResponses[selectedQuestionIndex] && allResponses[selectedQuestionIndex].length">
            <v-list density="compact">
              <v-list-item v-for="(resp, i) in allResponses[selectedQuestionIndex]" :key="i">
                <v-list-item-content>{{ resp }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div v-else class="text-grey">응답이 없습니다.</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import Sidebar from '@/components/common/Sidebar.vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { useDisplay } from 'vuetify'
import { authApi } from '@/apis/authApi'

Chart.register(ArcElement, Tooltip, Legend)

interface Survey {
  id: number
  title: string
  description: string
  isActive: boolean
  endTime: string
  responseCount: number
}

export default defineComponent({
  name: 'SurveyResultsView',
  components: {
    Sidebar,
    Doughnut
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showError, showSuccess } = useSnackbar()
    const surveyId = computed(() => Number(route.params.id))
    const isLoading = ref(false)
    const { smAndDown } = useDisplay()
    const isMobile = computed(() => smAndDown.value)
    const menuOpen = ref(false)

    // 로그아웃 핸들러
    const handleLogout = async () => {
      try {
        await authApi.logout()
        showSuccess('로그아웃에 성공했습니다.')
        menuOpen.value = false
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

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
      maintainAspectRatio: false,
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
      const minFont = 16, maxFont = 36
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
    const selectedQuestionIndex = ref<number|null>(null)
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

    return {
      survey,
      summary,
      isLoading,
      questions,
      positionResults,
      chartData,
      chartOptions,
      wordCloudData,
      getWordCloudStyle,
      showResponsesModal,
      selectedQuestionIndex,
      allResponses,
      viewAllResponses,
      isMobile,
      menuOpen,
      handleLogout
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
  background-color: #e0e0e0;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  margin-right: 8px;
  box-shadow: none;
  border: none;
}

.graph-insight-row {
  margin-top: 8px;
  margin-bottom: 16px;
}

.insight-text {
  font-size: 20px;
  color: #757575;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.5;
}

.wordcloud-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px 24px;
  background: #fafbfc;
  margin-top: 12px;
  max-width: 420px;
}
.wordcloud-title {
  font-size: 16px;
  font-weight: 700;
  color: #666;
  margin-bottom: 12px;
}
.wordcloud-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wordcloud-row {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: 'Consolas', 'monospace';
}
.wordcloud-keyword {
  width: 90px;
  color: #333;
  font-weight: 500;
}
.wordcloud-bar {
  color: #1976d2;
  margin: 0 8px;
  letter-spacing: 2px;
}
.wordcloud-count {
  color: #888;
  font-size: 15px;
  min-width: 24px;
  text-align: right;
}
.wordcloud-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 24px;
  align-items: flex-end;
  margin-top: 12px;
  margin-bottom: 12px;
}
.wordcloud-item {
  display: inline-flex;
  align-items: flex-end;
  transition: font-size 0.2s;
  line-height: 1.1;
}
.wordcloud-count {
  font-size: 0.85em;
  color: #888;
  margin-left: 2px;
}
.wordcloud-visual {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.08);
  min-height: 400px;
  width: 100%;
  margin-bottom: 12px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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