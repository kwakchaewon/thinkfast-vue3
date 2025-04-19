<template>
  <v-app>
    <router-view></router-view>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      class="text-center"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'

export default defineComponent({
  name: 'App',
  setup() {
    const { snackbar } = useSnackbar()
    return {
      snackbar
    }
  }
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

.v-snackbar__content {
  justify-content: center;
  text-align: center;
}
</style> 