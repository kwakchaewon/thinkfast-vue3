<template>
  <div class="min-h-screen w-full bg-background text-foreground">
    <router-view></router-view>
    <Toaster position="top-center" richColors closeButton />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import { Toaster } from 'vue-sonner'
import { toast } from 'vue-sonner'

onMounted(async () => {
  console.log('[App] App component mounted')
  console.log('[App] Toaster should be rendered')
  
  await nextTick()
  
  // DOM에서 Toaster 확인
  setTimeout(() => {
    const toasterElement = document.querySelector('[data-sonner-toaster]')
    console.log('[App] Toaster element in DOM:', toasterElement)
    console.log('[App] Toaster element styles:', toasterElement ? window.getComputedStyle(toasterElement as Element) : null)
    
    if (!toasterElement) {
      console.error('[App] Toaster element not found in DOM!')
      console.error('[App] Searching for any sonner elements...')
      const allSonner = document.querySelectorAll('[class*="sonner"]')
      console.log('[App] All sonner elements:', allSonner)
    } else {
      console.log('[App] Toaster found! Checking visibility...')
      const styles = window.getComputedStyle(toasterElement as Element)
      console.log('[App] Toaster display:', styles.display)
      console.log('[App] Toaster visibility:', styles.visibility)
      console.log('[App] Toaster opacity:', styles.opacity)
      console.log('[App] Toaster zIndex:', styles.zIndex)
    }
  }, 200)
  
  // 테스트용: 마운트 후 1초 뒤에 토스트 표시
  setTimeout(() => {
    console.log('[App] Testing toast after mount')
    try {
      const id = toast.success('Toaster가 제대로 작동합니다!')
      console.log('[App] toast.success called, id:', id)
    } catch (error) {
      console.error('[App] toast.success error:', error)
    }
  }, 1000)
})
</script>

<style scoped>
/* 기본 스타일은 style.css에서 처리됨 */
</style> 