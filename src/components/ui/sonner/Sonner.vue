<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()

onMounted(async () => {
  console.log('[Sonner] Toaster component mounted')
  await nextTick()
  
  setTimeout(() => {
    const toasterElement = document.querySelector('[data-sonner-toaster]')
    console.log('[Sonner] Toaster element found:', toasterElement)
    
    if (toasterElement) {
      const styles = window.getComputedStyle(toasterElement as Element)
      console.log('[Sonner] Toaster styles:', {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        zIndex: styles.zIndex,
        position: styles.position,
        top: styles.top,
        right: styles.right,
      })
    }
  }, 100)
})
</script>

<template>
  <Sonner
    v-bind="props"
  />
</template>
