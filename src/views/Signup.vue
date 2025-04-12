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
            <v-form @submit.prevent="handleSignup">
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
                v-model="name"
                label="이름"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
                outlined
                dense
                class="mb-2"
              ></v-text-field>

              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="birthDate"
                    label="생년월일"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[rules.required]"
                    outlined
                    dense
                    class="mb-4"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="birthDate"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1900-01-01"
                  @change="menu = false"
                ></v-date-picker>
              </v-menu>

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
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SignupView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const name = ref('')
    const birthDate = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const menu = ref(false)

    const rules = {
      required: (value: string) => !!value || '필수 입력 항목입니다.',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '올바른 이메일 형식이 아닙니다.'
      },
      min: (value: string) => value.length >= 8 || '비밀번호는 8자 이상이어야 합니다.',
    }

    const handleSignup = async () => {
      loading.value = true
      try {
        // TODO: 회원가입 로직 구현
        console.log('Signup attempt:', {
          email: email.value,
          password: password.value,
          name: name.value,
          birthDate: birthDate.value
        })
        // 회원가입 성공 시 로그인 페이지로 이동
        router.push('/')
      } catch (error) {
        console.error('Signup error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      name,
      birthDate,
      showPassword,
      loading,
      menu,
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
</style> 