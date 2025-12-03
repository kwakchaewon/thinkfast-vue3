<template>
  <div class="min-h-screen bg-white">
    <!-- 헤더 -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              :src="thinkfastLogo"
              alt="ThinkFast 로고"
              class="h-8 w-8 rounded-xl shadow-sm"
            />
            <span class="text-xl font-bold text-gray-900 tracking-tight">ThinkFast</span>
          </div>
          <div class="flex items-center gap-3">
            <template v-if="isAuthenticated">
              <router-link
                to="/main"
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                마이 페이지
              </router-link>
              <Button
                variant="outline"
                size="sm"
                @click="handleLogout"
                class="text-gray-700 hover:bg-primary-400 hover:text-white hover:border-primary-400 transition-colors"
              >
                로그아웃
              </Button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                로그인
              </router-link>
              <Button
                variant="default"
                size="sm"
                as-child
                class="bg-primary-400 hover:bg-primary-500 text-white"
              >
                <router-link to="/signup">회원가입</router-link>
              </Button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 히어로 섹션 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">ThinkFast</h1>
        <p class="text-lg text-gray-600 mb-6">
          설문에 참여하고 AI 인사이트를 확인해보세요.
        </p>
        <div class="flex justify-center gap-4">
          <Input
            v-model="searchQuery"
            placeholder="설문 검색..."
            class="max-w-md h-12"
            @keyup.enter="handleSearch"
          />
          <Button
            @click="handleSearch"
            class="bg-primary-400 hover:bg-primary-500 text-white h-12 px-6"
          >
            <Search class="h-5 w-5 mr-2" />
            검색
          </Button>
        </div>
      </div>

      <!-- 필터 및 정렬 -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <Select v-model="sortBy" @update:model-value="handleSortChange">
          <SelectTrigger class="w-full sm:w-[200px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent class="select-content-custom bg-white">
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="oldest">오래된순</SelectItem>
            <SelectItem value="responses">응답 많은순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-primary-400" />
      </div>

      <!-- 공개 설문 목록 -->
      <div v-else-if="publicSurveys.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card
          v-for="survey in publicSurveys"
          :key="survey.id"
          class="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
          @click="goToSurveyDetail(survey.id)"
        >
          <CardHeader>
            <div class="flex items-start justify-between gap-2">
              <Badge variant="default" class="bg-green-500 text-white">
                공개
              </Badge>
              <Badge
                :variant="survey.isActive ? 'default' : 'destructive'"
                :class="survey.isActive ? 'bg-primary-400 text-white' : ''"
              >
                {{ survey.isActive ? '진행중' : '종료' }}
              </Badge>
            </div>
            <CardTitle class="text-xl font-semibold text-gray-800 mt-2 line-clamp-2">
              {{ survey.title }}
            </CardTitle>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ survey.description }}
            </p>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <Users class="h-4 w-4" />
                  {{ survey.responseCount }}명 참여
                </span>
                <span class="flex items-center gap-1">
                  <User class="h-4 w-4" />
                  {{ survey.ownerName }}
                </span>
              </div>
              <span class="text-xs text-gray-500">
                {{ formatDate(survey.createdAt) }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="text-center py-12">
        <p class="text-lg text-gray-500 mb-4">아직 공개된 설문이 없습니다.</p>
        <p class="text-sm text-gray-400">
          {{ searchQuery ? '검색 결과가 없습니다.' : '첫 번째 공개 설문을 만들어보세요!' }}
        </p>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          이전
        </Button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="
              page === currentPage
                ? 'bg-primary-400 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            "
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          다음
        </Button>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import store from '@/store'
import { authApi } from '@/apis/authApi'
import thinkfastLogo from '@/assets/thinkfast-logo.svg'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2, Users, User } from 'lucide-vue-next'
import type { PublicSurvey } from '@/interfaces/surveyInterface'

const router = useRouter()
const { showError, showSuccess } = useSnackbar()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const publicSurveys = ref<PublicSurvey[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref<'newest' | 'oldest' | 'responses'>('newest')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(0)
const totalCount = ref(0)

// 페이지네이션 표시 범위 계산
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = 7
  const pages: number[] = []

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, current + half)

    if (end - start < maxVisible - 1) {
      if (start === 1) {
        end = Math.min(total, start + maxVisible - 1)
      } else {
        start = Math.max(1, end - maxVisible + 1)
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// 공개 설문 목록 조회
const fetchPublicSurveys = async () => {
  try {
    isLoading.value = true
    const response = await surveyApi.getPublicSurveys(
      currentPage.value,
      pageSize.value,
      sortBy.value,
      searchQuery.value || undefined
    )
    publicSurveys.value = response.surveys
    totalPages.value = response.pagination.totalPages
    totalCount.value = response.pagination.totalCount
  } catch (error: any) {
    console.error('Failed to fetch public surveys:', error)
    if (error.response?.status !== 404) {
      showError('공개 설문 목록을 불러오는데 실패했습니다.')
    }
    publicSurveys.value = []
    totalPages.value = 0
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}

// 검색
const handleSearch = () => {
  currentPage.value = 1
  fetchPublicSurveys()
}

// 정렬 변경
const handleSortChange = () => {
  currentPage.value = 1
  fetchPublicSurveys()
}

// 페이지 변경
const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchPublicSurveys()
}

// 설문 상세 페이지로 이동
const goToSurveyDetail = (surveyId: number) => {
  router.push(`/survey/${surveyId}`)
}

// 날짜 포맷팅
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 로그아웃
const handleLogout = async () => {
  try {
    await authApi.logout()
    showSuccess('로그아웃에 성공했습니다.')
    window.location.reload()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 페이지 변경 감지
watch(currentPage, () => {
  fetchPublicSurveys()
})

onMounted(() => {
  fetchPublicSurveys()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Select 필터 배경색 흰색 - 투명도 제거 */
:deep(.select-content-custom) {
  background-color: white !important;
  background: white !important;
}

:deep(.select-content-custom [data-reka-select-viewport]) {
  background-color: white !important;
  background: white !important;
}

/* Select 필터 호버 스타일 - primary-400 = #5C6BC0 */
/* 모든 가능한 선택자 패턴 적용 */
:deep(.select-content-custom *:hover) {
  color: white !important;
}

:deep(.select-content-custom [data-highlighted] *),
:deep(.select-content-custom [data-highlighted="true"] *) {
  color: white !important;
}

/* 배경색 적용 */
:deep(.select-content-custom button:hover),
:deep(.select-content-custom [data-highlighted]),
:deep(.select-content-custom li:hover),
:deep(.select-content-custom [role="option"]:hover) {
  background-color: #5C6BC0 !important;
}
</style>
