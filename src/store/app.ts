// Utilities
import { defineStore } from 'pinia'
import L, { Polygon } from 'leaflet'
import type { LatLng, LatLngBounds, Map } from 'leaflet'
import { featureGroup } from '@/hooks/web/map/useLMap'
import { drawClipPath } from '@/utils/geo'

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
        const _defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        lMap.on('moveend', (e) => {
          const { sourceTarget } = e
          this.lMapZoom = sourceTarget.getZoom()
          this.lMapCenter = sourceTarget.getCenter()
          this.lMapBounds = sourceTarget.getBounds()
          const layers = featureGroup.getLayers()
          const svg = document.querySelector('svg.leaflet-zoom-animated')

          layers.forEach((layer) => {
            if (svg && layer instanceof Polygon)
              drawClipPath(layer)
          })
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
