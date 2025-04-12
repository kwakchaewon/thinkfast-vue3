<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center">
            <v-img
              src="@/assets/thinkfast-logo.svg"
              alt="ThinkFast"
              max-height="80"
              contain
              class="mb-2"
            ></v-img>
            <h1 class="text-h4 font-weight-bold primary--text">회원가입</h1>
            <p class="text-subtitle-1 grey--text">ThinkFast에 오신 것을 환영합니다</p>
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              @submit.prevent="handleSignup"
              lazy-validation
            >
              <v-text-field
                v-model="email"
                label="이메일"
                prepend-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="비밀번호"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, rules.min]"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="비밀번호 확인"
                prepend-icon="mdi-lock-check"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPassword ? 'text' : 'password'"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.required, rules.passwordMatch]"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="name"
                label="이름"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="birthDate"
                label="생년월일 (YYMMDD)"
                prepend-icon="mdi-calendar"
                :rules="[rules.required, rules.birthDate]"
                outlined
                dense
                class="mb-2"
                placeholder="예: 960327"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                x-large
                type="submit"
                :loading="loading"
                class="mb-4"
                height="48"
              >
                회원가입
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 grey--text">이미 계정이 있으신가요? </span>
                <router-link 
                  to="/"
                  class="text-body-2 primary--text text-decoration-none"
                >
                  로그인
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
      class="text-center"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/apis/authApi.ts'
import { useDelayedRouter } from '@/composables/useDelayedRouter'
import { useSnackbar } from '@/composables/useSnackbar'

export default defineComponent({
  name: 'SignupView',
  setup() {
    const router = useRouter()
    const { navigateWithDelay } = useDelayedRouter(router)
    const { snackbar, showError, showSuccess } = useSnackbar()
    const form = ref<any>(null)
    const isFormValid = ref(false)
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const name = ref('')
    const birthDate = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const loading = ref(false)

    const rules = {
      required: (value: string) => !!value || '필수 입력 항목입니다.',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '올바른 이메일 형식이 아닙니다.'
      },
      min: (value: string) => value.length >= 8 || '비밀번호는 8자 이상이어야 합니다.',
      passwordMatch: (value: string) => value === password.value || '비밀번호가 일치하지 않습니다.',
      birthDate: (value: string) => {
        const pattern = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
        if (!pattern.test(value)) {
          return '생년월일은 YYMMDD 형식으로 입력해주세요 (예: 960327)'
        }
        
        // 날짜 유효성 검사
        const year = parseInt(value.substring(0, 2))
        const month = parseInt(value.substring(2, 4))
        const day = parseInt(value.substring(4, 6))
        
        const date = new Date(2000 + year, month - 1, day)
        if (date.getFullYear() !== 2000 + year || 
            date.getMonth() !== month - 1 || 
            date.getDate() !== day) {
          return '올바른 날짜를 입력해주세요'
        }
        
        return true
      }
    }

    const handleSignup = async () => {
      const isValid = await form.value?.validate()
      if (isValid.valid === false) {
        showError('입력 내용을 다시 확인해주세요.')
        return
      }

      loading.value = true
      try {
        const response = await authApi.signup({
          username: email.value,
          password: password.value,
          name: name.value,
          birthDate: birthDate.value
        })
        
        if (response.success === false) {
          showError(response.message || '회원가입에 실패했습니다.')
          return
        }
        
        showSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
        await navigateWithDelay('/')
      } catch (error) {
        showError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      isFormValid,
      email,
      password,
      confirmPassword,
      name,
      birthDate,
      showPassword,
      showConfirmPassword,
      loading,
      snackbar,
      rules,
      handleSignup
    }
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  transform: translateY(-5%);
}

.v-card-title {
  padding: 1.5rem 1rem;
}

.v-card-text {
  padding: 1rem 2rem 2rem;
}

/* 배경 그라데이션을 인디고 계열로 변경 */
:deep(.v-application) {
  background: linear-gradient(135deg, #E8EAF6 0%, #5C6BC0 100%);
}

/* 로그인 링크 호버 효과 */
a:hover {
  text-decoration: underline !important;
}

/* 스낵바 메시지 중앙 정렬 */
:deep(.v-snackbar__content) {
  text-align: center;
  justify-content: center;
}

:deep(.v-snackbar__actions) {
  margin-inline-start: 0;
}
</style> 