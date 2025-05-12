<template>
  <v-layout class="rounded rounded-md">
    <!-- 사이드바 -->
    <Sidebar />

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
                <span class="text-h6">설문 질문</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list>
                  <v-list-item
                    v-for="(question, index) in questions"
                    :key="index"
                    class="mb-4"
                  >
                    <template v-slot:prepend>
                      <div class="question-number">{{ index + 1 }}</div>
                    </template>
                    <v-list-item-title class="text-h6 mb-2">
                      {{ question.content }}
                      <v-chip
                        v-if="question.required"
                        color="error"
                        size="small"
                        class="ms-2"
                      >필수</v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption text-grey mb-2">
                      {{ question.type }}
                    </v-list-item-subtitle>
                    <v-list-item-text>
                      <div v-if="question.type === '객관식'" class="d-flex flex-wrap gap-2">
                        <v-chip
                          v-for="option in question.options"
                          :key="option"
                          class="me-2 mb-2"
                        >{{ option }}</v-chip>
                      </div>
                      <div v-if="question.type === '객관식'" class="d-flex justify-center my-4">
                        <Doughnut :data="chartData" :options="chartOptions" style="width:320px; height:320px;" />
                      </div>
                      <v-textarea
                        v-else
                        placeholder="주관식 응답"
                        readonly
                        auto-grow
                        rows="1"
                      ></v-textarea>
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import Sidebar from '@/components/common/Sidebar.vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

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
    const { showError } = useSnackbar()
    const surveyId = computed(() => Number(route.params.id))
    const isLoading = ref(false)

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
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' }
      }
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
      chartOptions
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
</style> 