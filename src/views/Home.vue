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
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="아이디"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
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
                :rules="[rules.required]"
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
              >
                로그인
              </v-btn>

              <div class="text-center">
                <span class="text-body-2 grey--text">계정이 없으신가요? </span>
                <a 
                  href="#" 
                  class="text-body-2 primary--text text-decoration-none"
                  @click.prevent="handleSignup"
                >
                  회원가입
                </a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const username = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const loading = ref(false)

    const rules = {
      required: (value: string) => !!value || '필수 입력 항목입니다.',
    }

    const handleLogin = async () => {
      loading.value = true
      try {
        // TODO: 로그인 로직 구현
        console.log('Login attempt:', { username: username.value, password: password.value })
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSignup = () => {
      // TODO: 회원가입 페이지로 이동
      console.log('Navigate to signup page')
    }

    return {
      username,
      password,
      showPassword,
      loading,
      rules,
      handleLogin,
      handleSignup
    }
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
  transform: translateY(-5%); /* 카드를 약간 위로 올림 (10%에서 5%로 감소) */
}

.v-card-title {
  padding: 1.5rem 1rem; /* 패딩 감소 */
}

.v-card-text {
  padding: 1rem 2rem 2rem;
}

/* 배경 그라데이션을 인디고 계열로 변경 */
:deep(.v-application) {
  background: linear-gradient(135deg, #E8EAF6 0%, #5C6BC0 100%);
}

/* 회원가입 링크 호버 효과 */
a:hover {
  text-decoration: underline !important;
}
</style> 