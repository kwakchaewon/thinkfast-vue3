import { ref } from 'vue'

interface SnackbarOptions {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export const useSnackbar = () => {
  const snackbar = ref({
    show: false,
    message: '',
    color: 'error',
    timeout: 3000
  })

  const showMessage = ({ message, color = 'error', timeout = 3000 }: SnackbarOptions) => {
    snackbar.value = {
      show: true,
      message,
      color,
      timeout
    }
  }

  const showError = (message: string) => {
    showMessage({ message, color: 'error' })
  }

  const showSuccess = (message: string) => {
    showMessage({ message, color: 'success' })
  }

  return {
    snackbar,
    showMessage,
    showError,
    showSuccess
  }
} 