import type { App } from 'vue'
import { registerPlugins } from '@/plugins/index'

export function createLControl(lControl: App) {
  return registerPlugins(lControl)
}
