// Utilities
import { defineStore } from 'pinia'
import type { LatLng, LatLngBounds, Map } from 'leaflet'

export const useAppStore = defineStore(
  {
    id: 'app',
    state: () => ({
      lMap: {},
      lMapZoom: 0,
      lMapCenter: { lat: 0, lng: 0 },
      lMapBounds: {},
    }),
    getters: {
      getLMap(state): Map {
        return state.lMap
      },
      getLMapZoom(): number {
        return this.lMapZoom
      },
      getLMapCenter(): LatLng {
        return this.lMapCenter
      },
      getLMapBounds(): LatLngBounds {
        return this.lMapBounds
      },
    },
    actions: {
      setLMap(lMap: Map) {
        lMap.on('moveend', (e) => {
          const { sourceTarget } = e
          this.lMapZoom = sourceTarget.getZoom()
          this.lMapCenter = sourceTarget.getCenter()
          this.lMapBounds = sourceTarget.getBounds()
        })
        this.lMapZoom = lMap.getZoom()
        this.lMapCenter = lMap.getCenter()
        this.lMapBounds = lMap.getBounds()
        this.lMap = lMap
      },
      setLMapZoom(lMapZoom: number) {
        this.lMapZoom = lMapZoom
      },
      setLMapCenter(lMapCenter: { lat: number; lng: number }) {
        this.lMapCenter = lMapCenter
      },
    },
  },
)
