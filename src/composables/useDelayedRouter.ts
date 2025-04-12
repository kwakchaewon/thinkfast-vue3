import { Router } from 'vue-router'

export const useDelayedRouter = (router: Router) => {
  const navigateWithDelay = (path: string, delay: number = 2000) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        router.push(path)
        resolve()
      }, delay)
    })
  }

  return {
    navigateWithDelay
  }
} 