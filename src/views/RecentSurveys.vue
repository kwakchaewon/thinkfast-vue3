<template>
  <v-layout class="rounded rounded-md">
    <!-- 사이드바 -->
    <Sidebar />

    <!-- 메인 컨텐츠 -->
    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pb-16">
        <v-card class="content-card">
          <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
            <span class="text-h6">최근 설문</span>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" size="small" to="/create-survey">
              새 설문 만들기
              <v-icon end>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-table>
              <thead>
                <tr>
                  <th class="text-subtitle-2">설문 제목</th>
                  <th class="text-subtitle-2" width="100">상태</th>
                  <th class="text-subtitle-2" width="100">응답수</th>
                  <th class="text-subtitle-2" width="120">생성일</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="survey in recentSurveys" 
                  :key="survey.id"
                  class="survey-row"
                  @click="goToSurveyDetail(survey.id)"
                >
                  <td class="text-body-1">{{ survey.title }}</td>
                  <td>
                    <v-chip
                      :color="survey.isActive ? 'success' : 'error'"
                      size="small"
                      class="font-weight-medium"
                    >
                      {{ survey.isActive === true ? '진행중' : '종료' }}
                    </v-chip>
                  </td>
                  <td class="text-body-1">{{ survey.responseCount }}개</td>
                  <td class="text-body-1">{{ survey.createdAt }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter } from 'vue-router'
import { recentSurvey } from '@/interfaces/surveyInterface'
import Sidebar from '@/components/common/Sidebar.vue'

export default defineComponent({
  name: 'RecentSurveysView',
  components: {
    Sidebar
  },
  setup() {
    const router = useRouter()
    const { showError } = useSnackbar()
    const recentSurveys = ref<recentSurvey[]>([])
    const isLoading = ref(false)

    const fetchRecentSurveys = async () => {
      try {
        isLoading.value = true
        const response = await surveyApi.getRecentSurveys()
        console.log(response)
        recentSurveys.value = response.data
      } catch (error) {
        console.error('Failed to fetch recent surveys:', error)
        showError('최근 설문 목록을 불러오는데 실패했습니다.')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      fetchRecentSurveys()
    })

    const goToSurveyDetail = (surveyId: number) => {
      router.push(`/survey/${surveyId}`)
    }

    return {
      recentSurveys,
      isLoading,
      goToSurveyDetail
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

.survey-row {
  cursor: pointer;
}

.survey-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style> 