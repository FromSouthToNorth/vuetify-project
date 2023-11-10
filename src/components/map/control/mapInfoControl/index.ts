import { createApp } from 'vue'
import LControlVue from './LControl.vue'
import { createLControl } from './plugins'

export function createMapInfoLControl(container: HTMLDivElement) {
  const app = createApp(LControlVue)
  createLControl(app)
  app.mount(container)
}
