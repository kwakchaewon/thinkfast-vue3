<template>
  <!-- No changes to template section -->
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vue-snackbar'
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

    const handleLogin = async () => {
      if (!form.value.validate()) return

      loading.value = true
      try {
        const response = await authApi.login(form.value.email, form.value.password)
        await store.dispatch('login', {
          user: response.username,
          accessToken: response.accessToken
        })
        showSuccess('로그인 성공!')
        router.push('/main')
      } catch (error) {
        showError('로그인에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleLogin
    }
  }
}
</script>

<style>
  /* No changes to style section */
</style> 