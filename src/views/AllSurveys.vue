<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white">
      <div class="px-6 py-8">
        <Card class="shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <CardTitle class="text-xl font-semibold text-gray-800">전체 설문</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                class="text-primary-400 hover:bg-primary-400 hover:text-white"
                as-child
              >
                <router-link to="/create-survey" class="flex items-center gap-2">
                  새 설문 만들기
                  <Plus class="h-4 w-4" />
                </router-link>
              </Button>
            </div>
          </CardHeader>

          <!-- 검색 및 필터 -->
          <CardContent class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 검색 -->
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  v-model="search"
                  placeholder="설문 검색"
                  class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
                  @input="handleSearch"
                />
              </div>
              <!-- 상태 필터 -->
              <Select v-model="statusFilter" @update:model-value="handleFilter">
                <SelectTrigger class="h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent class="bg-white">
                  <SelectItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    class="bg-white hover:bg-gray-50"
                  >
                    {{ option.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <!-- 정렬 -->
              <Select v-model="sortBy" @update:model-value="handleSort">
                <SelectTrigger class="h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent class="bg-white">
                  <SelectItem
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                    class="bg-white hover:bg-gray-50"
                  >
                    {{ option.title }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <!-- 설문 목록: 데스크탑은 테이블, 모바일은 카드 -->
          <CardContent class="p-6 pt-0">
            <!-- 로딩 상태 -->
            <div v-if="isLoading" class="mb-4">
              <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary-400 animate-pulse" style="width: 100%"></div>
              </div>
            </div>

            <!-- 데스크탑: 테이블 -->
            <div v-if="!isMobile" class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설문 제목</TableHead>
                    <TableHead class="w-[100px]">상태</TableHead>
                    <TableHead class="w-[100px]">응답수</TableHead>
                    <TableHead class="w-[120px]">생성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="survey in paginatedSurveys"
                    :key="survey.id"
                    class="cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="goToSurveyDetail(survey.id)"
                  >
                    <TableCell class="font-medium">{{ survey.title }}</TableCell>
                    <TableCell>
                      <div class="flex flex-col gap-1">
                        <Badge
                          :variant="survey.isActive === true ? 'default' : 'destructive'"
                        >
                          {{ survey.isActive === true ? '진행중' : '종료' }}
                        </Badge>
                        <Badge
                          v-if="survey.showResults !== undefined"
                          :variant="survey.showResults ? 'default' : 'secondary'"
                          :class="survey.showResults ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'"
                        >
                          {{ survey.showResults ? '공개' : '비공개' }}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{{ survey.responseCount }}개</TableCell>
                    <TableCell>{{ survey.createdAt }}</TableCell>
                  </TableRow>
                  <TableRow v-if="paginatedSurveys.length === 0">
                    <TableCell colspan="4" class="text-center py-8 text-gray-500">
                      설문이 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- 모바일: 카드 리스트 -->
            <div v-else class="space-y-3">
              <Card
                v-for="survey in paginatedSurveys"
                :key="survey.id"
                class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                @click="goToSurveyDetail(survey.id)"
              >
                <CardContent class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-base font-semibold text-gray-800">{{ survey.title }}</span>
                    <Badge
                      :variant="survey.isActive === true ? 'default' : 'destructive'"
                    >
                      {{ survey.isActive === true ? '진행중' : '종료' }}
                    </Badge>
                  </div>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>응답수: {{ survey.responseCount }}개</span>
                    <span>생성일: {{ survey.createdAt }}</span>
                  </div>
                </CardContent>
              </Card>
              <div v-if="paginatedSurveys.length === 0" class="text-center py-8 text-gray-500">
                설문이 없습니다.
              </div>
            </div>

            <!-- 페이지네이션 -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  </HeaderMenu>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus } from 'lucide-vue-next'

interface Survey {
  id: number
  title: string
  isActive: boolean
  responseCount: number
  createdAt: string
  showResults?: boolean
}

const router = useRouter()
const { showError } = useSnackbar()
const search = ref('')
const statusFilter = ref('all')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)
const isMobile = ref(false)

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

// 반응형 체크
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  fetchSurveys()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

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
    console.log(error)
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

// 페이지네이션 표시 범위 계산
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = isMobile.value ? 3 : 7
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToSurveyDetail = (surveyId: number) => {
  router.push(`/survey/${surveyId}`)
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
