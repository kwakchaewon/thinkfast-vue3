<template>
  <v-footer class="bg-grey-lighten-4 border-t">
    <v-container>
      <v-row justify="center" no-gutters class="text-center py-2">
        <v-col cols="12" class="mb-2">
          <strong class="text-primary text-h6">ThinkFast</strong>
          <div class="text-subtitle-2 text-medium-emphasis mt-1">
            Smart Surveys, Better Insights
          </div>
        </v-col>
        <v-col cols="12">
          <span class="text-caption text-medium-emphasis">
            © {{ new Date().getFullYear() }} <strong>Andrew Kwak</strong>. All rights reserved.
          </span>
        </v-col>
      </v-row>
    </v-container>
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
  z-index: 1;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style> 