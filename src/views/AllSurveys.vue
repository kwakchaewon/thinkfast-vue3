<template>
  <ResponsiveLayout>
    <v-container fluid class="pb-16">
      <v-card class="content-card">
        <v-card-title class="d-flex align-center px-4 py-3 bg-grey-lighten-4">
          <span class="text-h6">전체 설문</span>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="primary"
            size="small"
            to="/create-survey"
          >
            새 설문 만들기
            <v-icon end>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>

        <!-- 검색 및 필터 -->
        <v-card-text class="pa-4">
          <v-row :class="isMobile ? 'mobile-filter-row' : ''">
            <v-col :cols="12" :sm="4">
              <v-text-field
                v-model="search"
                label="설문 검색"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                @input="handleSearch"
              ></v-text-field>
            </v-col>
            <v-col :cols="12" :sm="4">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="상태"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="handleFilter"
              ></v-select>
            </v-col>
            <v-col :cols="12" :sm="4">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="정렬"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="handleSort"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- 설문 목록: 데스크탑은 테이블, 모바일은 카드 -->
        <v-card-text class="pa-4 pt-0">
          <v-progress-linear
            v-if="isLoading"
            indeterminate
            color="primary"
            class="mb-4"
          ></v-progress-linear>

          <!-- 데스크탑: 테이블 -->
          <v-table v-if="!isMobile">
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
                v-for="survey in paginatedSurveys" 
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
                    {{ survey.isActive ? '진행중' : '종료' }}
                  </v-chip>
                </td>
                <td class="text-body-1">{{ survey.responseCount }}개</td>
                <td class="text-body-1">{{ survey.createdAt }}</td>
              </tr>
              <tr v-if="paginatedSurveys.length === 0">
                <td colspan="4" class="text-center py-4 text-grey">
                  설문이 없습니다.
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- 모바일: 카드 리스트 -->
          <div v-else>
            <v-card
              v-for="survey in paginatedSurveys"
              :key="survey.id"
              class="survey-mobile-card mb-3"
              @click="goToSurveyDetail(survey.id)"
              elevation="1"
            >
              <v-card-item class="pa-3">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-body-1 font-weight-medium">{{ survey.title }}</span>
                  <v-chip
                    :color="survey.isActive ? 'success' : 'error'"
                    size="small"
                    class="font-weight-medium"
                  >
                    {{ survey.isActive ? '진행중' : '종료' }}
                  </v-chip>
                </div>
                <div class="d-flex justify-space-between text-caption text-grey">
                  <span>응답수: {{ survey.responseCount }}개</span>
                  <span>생성일: {{ survey.createdAt }}</span>
                </div>
              </v-card-item>
            </v-card>
            <div v-if="paginatedSurveys.length === 0" class="text-center py-4 text-grey">
              설문이 없습니다.
            </div>
          </div>

          <!-- 페이지네이션 -->
          <div class="d-flex justify-center mt-4">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="isMobile ? 3 : 7"
              @update:model-value="handlePageChange"
            ></v-pagination>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </ResponsiveLayout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import ResponsiveLayout from '@/components/common/ResponsiveLayout.vue'
import { useDisplay } from 'vuetify'

interface Survey {
  id: number
  title: string
  isActive: boolean
  responseCount: number
  createdAt: string
}

export default defineComponent({
  name: 'AllSurveysView',
  components: {
    ResponsiveLayout
  },
  setup() {
    const router = useRouter()
    const { showError } = useSnackbar()
    const search = ref('')
    const statusFilter = ref('all')
    const sortBy = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const isLoading = ref(false)
    const { smAndDown } = useDisplay()
    const isMobile = computed(() => smAndDown.value)

    const surveys = ref<Survey[]>([])

    const statusOptions = [
      { title: '전체', value: 'all' },
      { title: '진행중', value: 'active' },
      { title: '종료', value: 'inactive' }
    ]

    const sortOptions = [
      { title: '최신순', value: 'newest' },
      { title: '오래된순', value: 'oldest' },
      { title: '응답수 많은순', value: 'responses' }
    ]

    // 설문 목록 가져오기
    const fetchSurveys = async () => {
      try {
        isLoading.value = true
        const response = await surveyApi.getSurveys()
        surveys.value = response.map((survey: any) => ({
          id: survey.id,
          title: survey.title,
          isActive: survey.isActive,
          responseCount: survey.responseCount,
          createdAt: new Date(survey.createdAt).toLocaleDateString()
        }))
      } catch (error) {
        console.log(error);
        showError('설문 목록을 불러오는데 실패했습니다.')
      } finally {
        isLoading.value = false
      }
    }

    // 필터링된 설문 목록
    const filteredSurveys = computed(() => {
      let result = [...surveys.value]

      // 검색어 필터링
      if (search.value) {
        result = result.filter(survey => 
          survey.title.toLowerCase().includes(search.value.toLowerCase())
        )
      }

      // 상태 필터링
      if (statusFilter.value !== 'all') {
        result = result.filter(survey => 
          statusFilter.value === 'active' ? survey.isActive : !survey.isActive
        )
      }

      // 정렬
      switch (sortBy.value) {
        case 'oldest':
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'responses':
          result.sort((a, b) => b.responseCount - a.responseCount)
          break
        default: // newest
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return result
    })

    // 페이지네이션
    const totalPages = computed(() => 
      Math.ceil(filteredSurveys.value.length / itemsPerPage)
    )

    const paginatedSurveys = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredSurveys.value.slice(start, end)
    })

    // 이벤트 핸들러
    const handleSearch = () => {
      currentPage.value = 1
    }

    const handleFilter = () => {
      currentPage.value = 1
    }

    const handleSort = () => {
      currentPage.value = 1
    }

    const handlePageChange = (page: number) => {
      currentPage.value = page
    }

    const goToSurveyDetail = (surveyId: number) => {
      router.push(`/survey/${surveyId}`)
    }

    onMounted(() => {
      fetchSurveys()
    })

    return {
      search,
      statusFilter,
      sortBy,
      currentPage,
      totalPages,
      statusOptions,
      sortOptions,
      paginatedSurveys,
      isLoading,
      handleSearch,
      handleFilter,
      handleSort,
      handlePageChange,
      goToSurveyDetail,
      isMobile
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

/* 모바일 카드 스타일 */
.survey-mobile-card {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.survey-mobile-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* 모바일 필터 세로 정렬 */
.mobile-filter-row {
  flex-direction: column !important;
}

@media (max-width: 600px) {
  .content-card {
    padding: 0 !important;
  }
  .v-card-title, .v-card-text {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .survey-mobile-card {
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 