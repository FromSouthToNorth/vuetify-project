import { computed } from 'vue'
import { useAppStore } from '@/store/app'

export function useLMap() {
  const appStore = useAppStore()
  const lMap = computed(() => appStore.getLMap)
  const lMapZoom = computed(() => appStore.getLMapZoom)
  const lMapCenter = computed(() => appStore.getLMapCenter)

  return {
    lMap,
    lMapZoom,
    lMapCenter,
  }
}
