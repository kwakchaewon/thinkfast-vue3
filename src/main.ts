import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-sonner/style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import { loadFonts } from './plugins/webfontloader'

import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)

loadFonts()

app.mount('#app') 