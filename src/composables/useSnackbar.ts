import { toast } from 'vue-sonner'

interface SnackbarOptions {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export const useSnackbar = () => {
  const showMessage = ({ message, color = 'error', timeout = 3000 }: SnackbarOptions) => {
    const duration = timeout || 3000
    
    switch (color) {
      case 'success':
        toast.success(message, { duration })
        break
      case 'error':
        toast.error(message, { duration })
        break
      case 'info':
        toast.info(message, { duration })
        break
      case 'warning':
        toast.warning(message, { duration })
        break
      default:
        toast(message, { duration })
    }
  }

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 })
  }

  const showSuccess = (message: string) => {
    toast.success(message, { duration: 3000 })
  }

  return {
    showMessage,
    showError,
    showSuccess
  }
} 