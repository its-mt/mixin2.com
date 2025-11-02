import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Pico CSS
import '@picocss/pico/css/pico.min.css'
// Import custom styles
import './assets/custom.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
