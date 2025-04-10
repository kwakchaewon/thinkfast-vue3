<template>
  <div class="home">
    <h1>Welcome to Vue 3 + TypeScript</h1>
    <p>This is the home page of your application.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}
</style> 