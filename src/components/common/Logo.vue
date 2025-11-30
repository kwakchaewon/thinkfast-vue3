<template>
  <router-link to="/" class="flex items-center justify-center hover:opacity-80 transition-opacity" :class="containerClass">
    <img
      :src="thinkfastLogo"
      alt="ThinkFast 로고"
      :class="imageClass"
    />
  </router-link>
</template>

<script lang="ts" setup>
import thinkfastLogo from '@/assets/thinkfast-logo.svg'

interface Props {
  size?: 'small' | 'medium' | 'large'
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  containerClass: ''
})

const imageClasses = {
  small: 'h-8 w-8 rounded-xl shadow-sm',
  medium: 'h-10 w-10 rounded-2xl shadow-sm',
  large: 'h-20 w-20 rounded-2xl shadow-lg'
}

const imageClass = imageClasses[props.size]
</script>

