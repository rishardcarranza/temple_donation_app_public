import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0366F7',
          secondary: '#6B7280',
          accent: '#0366F7',
          error: '#E24B4A',
          info: '#0366F7',
          success: '#1D9E75',
          warning: '#F59E0B',
          background: '#FFFFFF',
          surface: '#F5F7FA',
          'on-background': '#1A1A2E',
          'on-surface': '#1A1A2E',
          'surface-soft': '#E6F1FB'
        }
      }
    }
  }
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')