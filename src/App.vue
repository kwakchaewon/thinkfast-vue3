<template>
  <div class="min-h-screen w-full bg-background text-foreground">
    <router-view></router-view>
    <Toaster position="top-center" richColors closeButton />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
</script>

<style scoped>
/* 기본 스타일은 style.css에서 처리됨 */
</style> 