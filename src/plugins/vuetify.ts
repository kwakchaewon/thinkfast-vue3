import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Labs components
import { VDatePicker } from 'vuetify/components/VDatePicker'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#3949AB', // 딥 인디고
    secondary: '#5C6BC0', // 밝은 인디고
    accent: '#1A237E', // 진한 인디고
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
}

export default createVuetify({
  components: {
    ...components,
    VDatePicker,
  },
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  display: {
    mobileBreakpoint: 'sm',
  },
}) 