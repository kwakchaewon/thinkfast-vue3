<template>
  <HeaderMenu>
    <div class="min-h-screen bg-white w-full">
      <div class="px-6 py-8">
        <Card class="shadow-md border border-gray-200 bg-white">
          <CardHeader class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
                <Clock class="h-5 w-5 text-primary-400 mr-2" />
                최근 설문
              </CardTitle>
              <Button
                class="bg-primary-400 hover:bg-primary-500 text-white h-10 px-4 rounded-lg shadow-sm transition-colors"
                as-child
              >
                <router-link to="/create-survey" class="flex items-center gap-2">
                  <Plus class="h-4 w-4" />
                  새 설문 만들기
                </router-link>
              </Button>
            </div>
          </CardHeader>

          <CardContent class="p-6">
            <!-- 로딩 상태 -->
            <div v-if="isLoading" class="mb-6">
              <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-primary-400 animate-pulse" style="width: 100%"></div>
              </div>
            </div>

            <!-- 빈 상태 -->
            <div v-if="!isLoading && recentSurveys.length === 0" class="text-center py-16">
              <FileText class="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <div class="text-lg font-medium text-gray-800 mb-2">설문이 없습니다</div>
              <div class="text-sm text-gray-500 mb-6">
                새로운 설문을 만들어 시작해보세요.
              </div>
              <Button
                class="bg-primary-400 hover:bg-primary-500 text-white h-10 px-6 rounded-lg shadow-sm transition-colors"
                as-child
              >
                <router-link to="/create-survey" class="flex items-center gap-2">
                  <Plus class="h-4 w-4" />
                  새 설문 만들기
                </router-link>
              </Button>
            </div>

            <!-- 데스크탑: 테이블 -->
            <div v-if="!isLoading && recentSurveys.length > 0 && !isMobile" class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="font-semibold text-gray-700">설문 제목</TableHead>
                    <TableHead class="font-semibold text-gray-700 w-[100px]">상태</TableHead>
                    <TableHead class="font-semibold text-gray-700 w-[100px]">응답수</TableHead>
                    <TableHead class="font-semibold text-gray-700 w-[120px]">생성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="survey in recentSurveys"
                    :key="survey.id"
                    class="cursor-pointer hover:bg-gray-50 transition-colors"
                    @click="goToSurveyDetail(survey.id)"
                  >
                    <TableCell class="font-medium text-gray-800">{{ survey.title }}</TableCell>
                    <TableCell>
                      <Badge
                        :variant="survey.isActive === true ? 'default' : 'destructive'"
                        class="font-medium"
                      >
                        {{ survey.isActive === true ? '진행중' : '종료' }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-gray-600">{{ survey.responseCount }}개</TableCell>
                    <TableCell class="text-gray-600">{{ survey.createdAt }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <!-- 모바일: 그리드 레이아웃 (카드) -->
            <div v-if="!isLoading && recentSurveys.length > 0 && isMobile" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                v-for="survey in recentSurveys"
                :key="survey.id"
                class="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-300 bg-white"
                @click="goToSurveyDetail(survey.id)"
              >
                <CardContent class="p-4">
                  <div class="flex items-start justify-between mb-3">
                    <h3 class="text-base font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
                      {{ survey.title }}
                    </h3>
                    <Badge
                      :variant="survey.isActive === true ? 'default' : 'destructive'"
                      class="flex-shrink-0 font-medium"
                    >
                      {{ survey.isActive === true ? '진행중' : '종료' }}
                    </Badge>
                  </div>
                  <div class="space-y-2.5 pt-2 border-t border-gray-100">
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-1.5 text-gray-600">
                        <MessageSquare class="h-4 w-4 text-gray-400" />
                        응답수
                      </span>
                      <span class="font-medium text-gray-800">{{ survey.responseCount }}개</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-1.5 text-gray-600">
                        <Calendar class="h-4 w-4 text-gray-400" />
                        생성일
                      </span>
                      <span class="font-medium text-gray-800">{{ survey.createdAt }}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </HeaderMenu>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { surveyApi } from '@/apis/surveyApi'
import { useRouter } from 'vue-router'
import { recentSurvey } from '@/interfaces/surveyInterface'
import HeaderMenu from '@/components/mobile/HeaderMenu.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, MessageSquare, Calendar, Clock, FileText } from 'lucide-vue-next'

const router = useRouter()
const { showError } = useSnackbar()
const recentSurveys = ref<recentSurvey[]>([])
const isLoading = ref(false)
const isMobile = ref(false)

// 반응형 체크
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  fetchRecentSurveys()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const fetchRecentSurveys = async () => {
  try {
    isLoading.value = true
    const response = await surveyApi.getRecentSurveys()
    recentSurveys.value = (response as any).data || response
  } catch (error) {
    console.error('Failed to fetch recent surveys:', error)
    showError('최근 설문 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const goToSurveyDetail = (surveyId: number) => {
  router.push(`/survey/${surveyId}`)
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
