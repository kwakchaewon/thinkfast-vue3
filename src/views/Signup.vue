<template>
  <div class="min-h-screen flex items-center justify-center bg-white p-4">
    <Card class="w-full max-w-md shadow-md border border-gray-200">
      <CardHeader class="text-center py-8 px-6">
        <CardTitle class="text-3xl font-bold text-gray-800 mb-2">회원가입</CardTitle>
        <p class="text-sm text-gray-500">ThinkFast에 오신 것을 환영합니다</p>
      </CardHeader>

      <CardContent class="px-6 pb-8">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <FormField v-slot="{ componentField, errorMessage }" name="email">
            <FormItem>
              <FormControl>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="이메일"
                    class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
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
                    class="pl-10 pr-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
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

          <FormField v-slot="{ componentField, errorMessage }" name="confirmPassword">
            <FormItem>
              <FormControl>
                <div class="relative">
                  <LockKeyhole class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    v-bind="componentField"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="비밀번호 확인"
                    class="pl-10 pr-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <Eye v-if="showConfirmPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </FormControl>
              <FormMessage class="text-xs text-red-500 mt-1" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="name">
            <FormItem>
              <FormControl>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    v-bind="componentField"
                    type="text"
                    placeholder="이름"
                    class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400"
                    :class="{ 'border-destructive': errorMessage }"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-xs text-red-500 mt-1" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, errorMessage }" name="birthDate">
            <FormItem>
              <FormControl>
                <Popover v-model:open="isDatePickerOpen" @update:open="handleDatePickerOpen">
                  <PopoverTrigger as-child>
                    <button
                      type="button"
                      class="relative w-full pl-10 pr-10 h-12 bg-white border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 cursor-pointer"
                      :class="{ 'border-destructive': errorMessage }"
                    >
                      <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <span :class="{ 'text-muted-foreground': !selectedDate }">
                        {{ selectedDate ? formatBirthDate(selectedDate) : '생년월일 (YYMMDD)' }}
                      </span>
                      <CalendarIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    class="w-auto p-0 bg-white shadow-lg border border-gray-200" 
                    align="start"
                  >
                    <Calendar 
                      v-model="selectedDate"
                      :calendar-level="calendarLevel"
                      @update:calendar-level="calendarLevel = $event"
                    />
                  </PopoverContent>
                </Popover>
                <!-- Hidden input for form validation -->
                <input
                  type="hidden"
                  v-bind="componentField"
                  :value="formatBirthDate(selectedDate)"
                />
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
              회원가입 중...
            </span>
            <span v-else>회원가입</span>
          </Button>

          <div class="text-center pt-2">
            <span class="text-sm text-gray-600">이미 계정이 있으신가요? </span>
            <router-link
              to="/"
              class="text-sm text-gray-800 hover:text-primary-600 font-medium transition-colors"
            >
              로그인
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { authApi } from '@/apis/authApi'
import { useDelayedRouter } from '@/composables/useDelayedRouter'
import { useSnackbar } from '@/composables/useSnackbar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Mail, Lock, LockKeyhole, User, Calendar as CalendarIcon, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const router = useRouter()
const { navigateWithDelay } = useDelayedRouter(router)
const { showError, showSuccess } = useSnackbar()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const isDatePickerOpen = ref(false)
const selectedDate = ref<Date | undefined>(undefined)
const calendarLevel = ref<'day' | 'month' | 'year'>('day')

// 생년월일 유효성 검사 함수
const validateBirthDate = (value: string): boolean => {
  const pattern = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
  if (!pattern.test(value)) {
    return false
  }
  
  // 날짜 유효성 검사
  const year = parseInt(value.substring(0, 2))
  const month = parseInt(value.substring(2, 4))
  const day = parseInt(value.substring(4, 6))
  
  const date = new Date(2000 + year, month - 1, day)
  if (date.getFullYear() !== 2000 + year || 
      date.getMonth() !== month - 1 || 
      date.getDate() !== day) {
    return false
  }
  
  return true
}

// Zod 스키마 정의
const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, '필수 입력 항목입니다.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(1, '필수 입력 항목입니다.')
      .min(8, '비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .min(1, '필수 입력 항목입니다.'),
    name: z
      .string()
      .min(1, '필수 입력 항목입니다.'),
    birthDate: z
      .string()
      .min(1, '필수 입력 항목입니다.')
      .refine((val) => {
        const pattern = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
        if (!pattern.test(val)) {
          return false
        }
        
        const year = parseInt(val.substring(0, 2))
        const month = parseInt(val.substring(2, 4))
        const day = parseInt(val.substring(4, 6))
        
        const date = new Date(2000 + year, month - 1, day)
        if (date.getFullYear() !== 2000 + year || 
            date.getMonth() !== month - 1 || 
            date.getDate() !== day) {
          return false
        }
        
        return true
      }, '생년월일은 YYMMDD 형식으로 입력해주세요 (예: 960327)'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })
)

// 날짜를 YYMMDD 형식으로 변환
const formatBirthDate = (date: Date | undefined): string => {
  if (!date) return ''
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

// Form 설정
const { handleSubmit, setValue } = useForm({
  validationSchema: schema,
})

// selectedDate가 변경될 때 form 값 업데이트 및 popover 닫기
watch(selectedDate, (newDate, oldDate) => {
  // 새로운 날짜가 선택되었을 때만 처리
  if (newDate && oldDate !== newDate) {
    const formattedDate = formatBirthDate(newDate)
    setValue('birthDate', formattedDate)
    
    // calendar-level이 'day'일 때만 popover 닫기 (년도/월 선택 시에는 닫지 않음)
    if (calendarLevel.value === 'day') {
      nextTick(() => {
        isDatePickerOpen.value = false
      })
    }
  }
})

// datepicker가 열릴 때 년도 선택부터 시작
const handleDatePickerOpen = (open: boolean) => {
  if (open) {
    calendarLevel.value = 'year' // 년도 선택부터 시작
  } else {
    // 닫힐 때 레벨 초기화
    calendarLevel.value = 'day'
  }
}

const handleSignup = handleSubmit(async (values: { 
  email: string
  password: string
  confirmPassword: string
  name: string
  birthDate: string
}) => {
  loading.value = true
  try {
    const response = await authApi.signup({
      username: values.email,
      password: values.password,
      name: values.name,
      birthDate: values.birthDate
    })
    
    if (response.success === false) {
      showError(response.message || '회원가입에 실패했습니다.')
      return
    }
    
    showSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
    await navigateWithDelay('/')
  } catch (error: any) {
    showError(error.response?.data?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 */
</style>
