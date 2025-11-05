import { toast } from 'vue-sonner'

interface SnackbarOptions {
  message: string
  color?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export const useSnackbar = () => {
  const showMessage = ({ message, color = 'error', timeout = 3000 }: SnackbarOptions) => {
    const duration = timeout || 3000
    
    console.log('[useSnackbar] showMessage called:', { message, color, duration })
    console.log('[useSnackbar] toast object:', toast)
    
    try {
      if (!toast) {
        console.error('[useSnackbar] toast is not available')
        alert(message)
        return
      }
      
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
      console.log('[useSnackbar] toast called successfully')
    } catch (error) {
      console.error('[useSnackbar] Toast error:', error)
      // Fallback: 브라우저 alert
      alert(message)
    }
  }

  const showError = (message: string) => {
    console.log('[useSnackbar] showError called with:', message)
    console.log('[useSnackbar] toast object:', toast)
    console.log('[useSnackbar] toast type:', typeof toast)
    console.log('[useSnackbar] toast.error:', toast?.error)
    
    try {
      if (!toast) {
        console.error('[useSnackbar] toast is not available')
        console.error('[useSnackbar] Falling back to alert')
        alert(`Error: ${message}`)
        return
      }
      
      if (typeof toast.error !== 'function') {
        console.error('[useSnackbar] toast.error is not a function')
        console.error('[useSnackbar] toast object:', toast)
        alert(`Error: ${message}`)
        return
      }
      
      const result = toast.error(message, { duration: 3000 })
      console.log('[useSnackbar] toast.error called successfully, result:', result)
    } catch (error) {
      console.error('[useSnackbar] Toast error caught:', error)
      console.error('[useSnackbar] Error stack:', (error as Error).stack)
      // Fallback: 브라우저 alert
      alert(`Error: ${message}`)
    }
  }

  const showSuccess = (message: string) => {
    console.log('[useSnackbar] showSuccess called with:', message)
    
    try {
      if (!toast) {
        console.error('[useSnackbar] toast is not available')
        console.error('[useSnackbar] Falling back to alert')
        alert(`Success: ${message}`)
        return
      }
      
      if (typeof toast.success !== 'function') {
        console.error('[useSnackbar] toast.success is not a function')
        alert(`Success: ${message}`)
        return
      }
      
      const result = toast.success(message, { duration: 3000 })
      console.log('[useSnackbar] toast.success called successfully, result:', result)
    } catch (error) {
      console.error('[useSnackbar] Toast error:', error)
      console.error('[useSnackbar] Error stack:', (error as Error).stack)
      // Fallback: 브라우저 alert
      alert(`Success: ${message}`)
    }
  }

  return {
    showMessage,
    showError,
    showSuccess
  }
} 