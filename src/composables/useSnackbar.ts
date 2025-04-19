import { ref } from 'vue'

interface SnackbarOptions {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

const globalSnackbar = ref({
  show: false,
  message: '',
  color: 'error',
  timeout: 3000
})

export const useSnackbar = () => {
  const showMessage = ({ message, color = 'error', timeout = 3000 }: SnackbarOptions) => {
    globalSnackbar.value = {
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
    snackbar: globalSnackbar,
    showMessage,
    showError,
    showSuccess
  }
} 