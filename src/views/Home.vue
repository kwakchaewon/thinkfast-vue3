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
            <h1 class="text-h4 font-weight-bold primary--text">ThinkFast</h1>
            <p class="text-subtitle-1 grey--text">AI 기반 실시간 설문조사 플랫폼</p>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="이메일"
                type="email"
                prepend-icon="mdi-account"
                :rules="emailRules"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="비밀번호"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="passwordRules"
                outlined
                dense
                class="mb-4"
              ></v-text-field>

              <v-btn
                color="primary"
                block
                x-large
                type="submit"
                :loading="loading"
                class="mb-4"
                height="48"
                :disabled="!isFormValid || loading"
              >
                로그인
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 grey--text">계정이 없으신가요? </span>
                <a 
                  href="#" 
                  class="text-body-2 primary--text text-decoration-none"
                  @click.prevent="$router.push('/signup')"
                >
                  회원가입
                </a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 스낵바 -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="2000"
        >
          {{ snackbar.text }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/apis/authApi'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const form = ref<any>(null)
    const isFormValid = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)

    // 폼 데이터
    const email = ref('')
    const password = ref('')

    // 유효성 검사 규칙
    const emailRules = [
      (v: string) => !!v || '이메일을 입력해주세요.',
      (v: string) => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다.'
    ]

    const passwordRules = [
      (v: string) => !!v || '비밀번호를 입력해주세요.',
      (v: string) => v.length >= 8 || '비밀번호는 최소 8자 이상이어야 합니다.'
    ]

    // 스낵바 상태
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })

    const showError = (message: string) => {
      snackbar.value = {
        show: true,
        text: message,
        color: 'error'
      }
    }

    const handleLogin = async () => {
      if (!form.value?.validate()) return

      loading.value = true
      try {
        await authApi.login(email.value, password.value)
        router.push('/main')
      } catch (error: any) {
        showError(error.response?.data?.message || '로그인에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      isFormValid,
      loading,
      email,
      password,
      showPassword,
      emailRules,
      passwordRules,
      snackbar,
      handleLogin
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

:deep(.v-application) {
  background: linear-gradient(135deg, #E8EAF6 0%, #5C6BC0 100%);
}

a:hover {
  text-decoration: underline !important;
}
</style> 