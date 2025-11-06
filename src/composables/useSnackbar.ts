import { toast } from 'vue-sonner'
import type { ToastOptions } from 'vue-sonner'

interface SnackbarOptions extends Omit<ToastOptions, 'duration'> {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

const DEFAULT_DURATION = 3000

/**
 * Toast/Sonner를 사용한 스낵바 알림 composable
 * Vuetify의 v-snackbar를 대체합니다.
 */
export const useSnackbar = () => {
  /**
   * 범용 메시지 표시 함수
   * @param options - 메시지 옵션
   */
  const showMessage = ({ 
    message, 
    color = 'error', 
    timeout = DEFAULT_DURATION,
    ...restOptions 
  }: SnackbarOptions) => {
    const duration = timeout || DEFAULT_DURATION
    const toastOptions: ToastOptions = {
      duration,
      ...restOptions
    }
    
    switch (color) {
      case 'success':
        toast.success(message, toastOptions)
        break
      case 'error':
        toast.error(message, toastOptions)
        break
      case 'info':
        toast.info(message, toastOptions)
        break
      case 'warning':
        toast.warning(message, toastOptions)
        break
      default:
        toast(message, toastOptions)
    }
  }

  /**
   * 에러 메시지 표시
   * @param message - 에러 메시지
   * @param options - 추가 Toast 옵션
   */
  const showError = (message: string, options?: Omit<ToastOptions, 'duration'>) => {
    toast.error(message, {
      duration: DEFAULT_DURATION,
      ...options
    })
  }

  /**
   * 성공 메시지 표시
   * @param message - 성공 메시지
   * @param options - 추가 Toast 옵션
   */
  const showSuccess = (message: string, options?: Omit<ToastOptions, 'duration'>) => {
    toast.success(message, {
      duration: DEFAULT_DURATION,
      ...options
    })
  }

  /**
   * 정보 메시지 표시
   * @param message - 정보 메시지
   * @param options - 추가 Toast 옵션
   */
  const showInfo = (message: string, options?: Omit<ToastOptions, 'duration'>) => {
    toast.info(message, {
      duration: DEFAULT_DURATION,
      ...options
    })
  }

  /**
   * 경고 메시지 표시
   * @param message - 경고 메시지
   * @param options - 추가 Toast 옵션
   */
  const showWarning = (message: string, options?: Omit<ToastOptions, 'duration'>) => {
    toast.warning(message, {
      duration: DEFAULT_DURATION,
      ...options
    })
  }

  return {
    showMessage,
    showError,
    showSuccess,
    showInfo,
    showWarning
  }
}
