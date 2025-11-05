<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-400 p-4">
    <Card class="w-full max-w-md shadow-xl">
      <CardHeader class="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle class="text-2xl text-center">로그인</CardTitle>
      </CardHeader>
      <CardContent class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <FormField v-slot="{ componentField, errorMessage }" name="email">
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    class="pl-10"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="password">
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="비밀번호를 입력하세요"
                    class="pl-10 pr-10"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full h-12 text-base"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <Loader2 class="h-4 w-4 animate-spin" />
              로그인 중...
            </span>
            <span v-else>로그인</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

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
    await store.dispatch('login', {
      user: response.username,
      accessToken: response.accessToken
    })
    showSuccess('로그인 성공!')
    await router.push('/main')
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
