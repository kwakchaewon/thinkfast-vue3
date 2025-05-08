<template>
  <v-container class="pa-0">
    <!-- 상단 헤더 -->
    <v-app-bar
      color="primary"
      density="compact"
      class="px-4"
    >
      <v-app-bar-title class="text-subtitle-1">
        설문 완료
      </v-app-bar-title>
    </v-app-bar>

    <!-- 완료 메시지 -->
    <div class="completion-container">
      <div class="text-center mb-8">
        <v-icon
          size="64"
          color="success"
          class="mb-4"
        >
          mdi-check-circle
        </v-icon>
        <h1 class="text-h5 mb-2">
          설문 응답이 완료되었습니다
        </h1>
        <p class="text-body-1 text-grey mb-1">
          "{{ surveyTitle }}"에 대한
        </p>
        <p class="text-body-1 text-grey">
          응답이 성공적으로 제출되었습니다.
        </p>
      </div>

      <!-- 감사 메시지 -->
      <v-card class="mx-4 mb-8 rounded-lg" elevation="0">
        <v-card-text class="text-center">
          <p class="text-body-1 mb-2">
            참여해 주셔서 감사합니다.
          </p>
          <p class="text-caption text-grey">
            여러분의 소중한 의견은 더 나은 서비스를 만드는데 큰 도움이 됩니다.
          </p>
        </v-card-text>
      </v-card>

      <!-- 메인으로 이동 버튼 -->
      <div class="px-4">
        <v-btn
          block
          color="primary"
          size="large"
          class="mb-2"
          @click="goToMain"
        >
          메인으로 이동
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SurveyCompletion',
  setup() {
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

    return {
      surveyTitle,
      goToMain
    }
  }
})
</script>

<style scoped>
.completion-container {
  padding: 24px 0;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
</style> 