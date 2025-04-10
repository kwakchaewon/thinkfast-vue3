<template>
  <div class="about">
    <h1>About</h1>
    <p>This is the about page of your application.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView'
})
</script>

<style scoped>
.about {
  padding: 2rem;
  text-align: center;
}
</style> 