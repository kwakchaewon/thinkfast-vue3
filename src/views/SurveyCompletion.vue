<template>
  <div class="min-h-screen bg-white">
    <!-- 상단 헤더 -->
    <div class="bg-primary-400 px-4 py-3">
      <h1 class="text-base font-semibold text-white">설문 완료</h1>
    </div>

    <!-- 완료 메시지 -->
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <div class="text-center mb-8 max-w-md">
        <!-- 체크 아이콘 -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle class="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <!-- 완료 메시지 -->
        <h1 class="text-2xl font-semibold text-gray-800 mb-3">
          설문 응답이 완료되었습니다
        </h1>
        <p class="text-base text-gray-600 mb-1">
          "{{ surveyTitle }}"에 대한
        </p>
        <p class="text-base text-gray-600">
          응답이 성공적으로 제출되었습니다.
        </p>
      </div>

      <!-- 감사 메시지 카드 -->
      <Card class="w-full max-w-md mb-8 shadow-md border border-gray-200 bg-white">
        <CardContent class="p-6 text-center">
          <p class="text-base text-gray-700 mb-2">
            참여해 주셔서 감사합니다.
          </p>
          <p class="text-xs text-gray-500">
            여러분의 소중한 의견은 더 나은 서비스를 만드는데 큰 도움이 됩니다.
          </p>
        </CardContent>
      </Card>

      <!-- 메인으로 이동 버튼 -->
      <div class="w-full max-w-md px-4">
        <Button
          class="w-full h-12 text-base font-medium bg-primary-400 hover:bg-primary-500 text-white rounded-lg shadow-sm transition-colors"
          @click="goToMain"
        >
          메인으로 이동
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const surveyTitle = ref('')

onMounted(() => {
  // URL에서 설문 제목 가져오기
  const title = route.query.title as string
  if (title) {
    try {
      surveyTitle.value = decodeURIComponent(title)
    } catch (error) {
      console.error('Failed to decode survey title:', error)
      surveyTitle.value = '설문'
    }
  }
})

const goToMain = () => {
  router.push('/')
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
