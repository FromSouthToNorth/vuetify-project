import './styles/sass/index.scss'

// Components
import { createApp } from 'vue'
import App from './App.vue'

// Composables

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
