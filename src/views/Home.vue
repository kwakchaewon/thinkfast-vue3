<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="text-h4 text-center">
      Welcome to Vue 3 + TypeScript
    </v-card-title>
    <v-card-text class="text-body-1 text-center">
      This is the home page of your application.
    </v-card-text>
  </v-card>
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