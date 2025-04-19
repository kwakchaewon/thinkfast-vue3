<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>로그인</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.email"
                label="이메일"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                required
                :rules="[v => !!v || '이메일을 입력해주세요', v => /.+@.+\..+/.test(v) || '올바른 이메일 형식이 아닙니다']"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="비밀번호"
                name="password"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
                :rules="[v => !!v || '비밀번호를 입력해주세요', v => v.length >= 6 || '비밀번호는 최소 6자 이상이어야 합니다']"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="handleLogin"
              :loading="loading"
              :disabled="!valid"
            >
              로그인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { ref } from 'vue'
import authApi from '../services/authApi'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { showError, showSuccess } = useSnackbar()
    const form = ref({
      email: '',
      password: ''
    })
    const loading = ref(false)
    const valid = ref(false)
    const formRef = ref(null)

    const handleLogin = async () => {
      if (!formRef.value?.validate()) return

      loading.value = true
      try {
        const response = await authApi.login(form.value.email, form.value.password)
        await store.dispatch('login', {
          user: response.username,
          accessToken: response.accessToken
        })
        showSuccess('로그인 성공!')
        // await router.push('/main')
      } catch (error) {
        showError('로그인에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin,
      valid,
      formRef
    }
  }
}
</script>

<style scoped>
.v-card {
  margin: 0 auto;
}
</style> 