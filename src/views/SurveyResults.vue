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
    Sidebar
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
      isLoading
    }
  }
})
</script>

<style scoped>
.v-main {
  min-height: 100vh;
}

.content-card {
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.content-card .v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style> 