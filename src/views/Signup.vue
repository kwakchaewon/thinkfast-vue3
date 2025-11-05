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
                <div class="relative">
                  <CalendarIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    v-bind="componentField"
                    ref="dateInputRef"
                    type="text"
                    placeholder="생년월일 (YYMMDD)"
                    readonly
                    class="flex h-12 w-full pl-10 pr-10 rounded-lg border bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:border-primary-400 cursor-pointer border-gray-300"
                    :class="{ 'border-destructive': errorMessage }"
                    @click="() => flatpickrInstance?.open()"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    @click="() => flatpickrInstance?.open()"
                  >
                    <CalendarIcon class="h-5 w-5" />
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
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
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
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

const router = useRouter()
const { navigateWithDelay } = useDelayedRouter(router)
const { showError, showSuccess } = useSnackbar()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const dateInputRef = ref<HTMLInputElement | null>(null)
const flatpickrInstance = ref<flatpickr.Instance | null>(null)

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

// Flatpickr 초기화
onMounted(() => {
  nextTick(() => {
    if (dateInputRef.value) {
      // 한국어 로케일 설정
      flatpickr.localize({
        firstDayOfWeek: 0,
        weekdays: {
          shorthand: ['일', '월', '화', '수', '목', '금', '토'],
          longhand: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        },
        months: {
          shorthand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          longhand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        }
      })

      flatpickrInstance.value = flatpickr(dateInputRef.value, {
        dateFormat: 'Y-m-d', // 내부적으로는 Y-m-d 형식 사용
        maxDate: new Date(), // 오늘 이후 날짜 선택 불가
        defaultDate: undefined,
        onChange: (selectedDates, dateStr) => {
          if (selectedDates.length > 0) {
            const date = selectedDates[0]
            const formatted = formatBirthDate(date)
            // Input에 YYMMDD 형식으로 표시
            if (dateInputRef.value) {
              dateInputRef.value.value = formatted
              // v-model 업데이트를 위한 이벤트 발생
              dateInputRef.value.dispatchEvent(new Event('input', { bubbles: true }))
            }
            // form 값 업데이트
            setValue('birthDate', formatted)
          }
        },
        onReady: (selectedDates, dateStr, instance) => {
          // 초기화 시 기존 값이 있으면 YYMMDD 형식으로 표시
          if (selectedDates.length > 0 && dateInputRef.value) {
            dateInputRef.value.value = formatBirthDate(selectedDates[0])
          }
        },
        onValueUpdate: (selectedDates, dateStr, instance) => {
          // 값이 업데이트될 때 YYMMDD 형식으로 표시
          if (selectedDates.length > 0 && dateInputRef.value) {
            dateInputRef.value.value = formatBirthDate(selectedDates[0])
          }
        },
      })
    }
  })
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (flatpickrInstance.value) {
    flatpickrInstance.value.destroy()
  }
})

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
/* Flatpickr 스타일 커스터마이징 */
:deep(.flatpickr-calendar) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

:deep(.flatpickr-day.selected) {
  background: #5C6BC0;
  border-color: #5C6BC0;
  color: white;
}

:deep(.flatpickr-day.selected:hover) {
  background: #3949AB;
  border-color: #3949AB;
}

:deep(.flatpickr-day.today) {
  border-color: #5C6BC0;
}

:deep(.flatpickr-day.today:hover) {
  background: #E8EAF6;
  border-color: #5C6BC0;
}

:deep(.flatpickr-months .flatpickr-month) {
  color: #1f2937;
}

:deep(.flatpickr-weekday) {
  color: #6b7280;
  font-weight: 600;
}

:deep(.flatpickr-day):hover {
  background: #f3f4f6;
}
</style>
