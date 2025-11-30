<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white p-4">

    <!-- 로그인 폼 -->
    <Card class="w-full max-w-md shadow-md border border-gray-200">
      <CardHeader class="text-center py-8 px-6">
        <!-- 큰 로고 -->
        <Logo size="large" container-class="mb-8" />
        <CardTitle class="text-3xl font-bold text-gray-800 mb-2">로그인</CardTitle>
        <p class="text-sm text-gray-500">ThinkFast에 오신 것을 환영합니다</p>
      </CardHeader>

      <CardContent class="px-6 pb-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <FormField v-slot="{ componentField, errorMessage }" name="email">
            <FormItem>
              <FormControl>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="이메일"
                    class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-xs text-red-500 mt-1" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="password">
            <FormItem>
              <FormControl>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="비밀번호"
                    class="pl-10 pr-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="showPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </FormControl>
              <FormMessage class="text-xs text-red-500 mt-1" />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full h-12 text-base font-medium bg-primary-400 hover:bg-primary-500 text-white rounded-lg shadow-sm transition-colors"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Loader2 class="h-4 w-4 animate-spin" />
              로그인 중...
            </span>
            <span v-else>로그인</span>
          </Button>

          <div class="text-center pt-2">
            <span class="text-sm text-gray-600">계정이 없으신가요? </span>
            <router-link
              to="/signup"
              class="text-sm text-gray-800 hover:text-primary-600 font-medium transition-colors"
            >
              회원가입
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// @ts-ignore - vuex 타입 선언 문제
import { useStore } from 'vuex'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const store = useStore()
const { showError, showSuccess } = useSnackbar()

const showPassword = ref(false)
const loading = ref(false)

// Zod 스키마 정의
const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  })
)

// Form 설정
const { handleSubmit } = useForm({
  validationSchema: schema,
})

const handleLogin = handleSubmit(async (values: { email: string; password: string }) => {
  loading.value = true
  try {
    const response = await authApi.login(values.email, values.password)
    await store.dispatch('setUser', {
      username: response.username,
      realUsername: response.realUsername,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      role: response.role
    })
    showSuccess('로그인 성공!')
    await router.push('/')
  } catch (error) {
    showError('로그인에 실패했습니다.')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
