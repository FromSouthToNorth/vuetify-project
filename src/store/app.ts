// Utilities
import { defineStore } from 'pinia'
import type { Map } from 'leaflet'

export const useAppStore = defineStore(
  {
    id: 'app',
    state: () => ({
      lMap: {},
      lMapZoom: 0,
      lMapCenter: { lat: 0, lng: 0 },
    }),
    getters: {
      getLMap(state): object {
        return state.lMap
      },
      getLMapZoom(state): number {
        return state.lMapZoom
      },
      getLMapCenter(state): object {
        return state.lMapCenter
      },
    },
    actions: {
      setLMap(lMap: Map) {
        lMap.on('moveend', (e) => {
          const { sourceTarget } = e
          this.lMapZoom = sourceTarget.getZoom()
          this.lMapCenter = sourceTarget.getCenter()
        })
        this.lMapZoom = lMap.getZoom()
        this.lMapCenter = lMap.getCenter()
        this.lMap = lMap
      },
      setLMapZoom(lMapZoom) {
        this.lMapZoom = lMapZoom
      },
      setLMapCenter(lMapCenter) {
        this.lMapCenter = lMapCenter
      },
    },
  },
)
