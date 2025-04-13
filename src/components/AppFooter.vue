<template>
  <v-footer class="bg-grey-lighten-1">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        <span class="text-caption">
          © {{ new Date().getFullYear() }} <strong>Andrew Kwak</strong>. All rights reserved.
        </span>
        <span class="text-caption mx-4">|</span>
        <span class="text-caption">
          <strong>ThinkFast</strong> — Smart Surveys, Better Insights
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFooter'
})
</script>

<style scoped>
.v-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8px 0;
}
</style> 