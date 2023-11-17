// Utilities
import { defineStore } from 'pinia'
import L, { Polygon } from 'leaflet'
import type { LatLng, LatLngBounds, Map } from 'leaflet'
import { featureGroup } from '@/hooks/web/map/useLMap'

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
          const layers = featureGroup.getLayers()
          const svg = document.querySelector('svg.leaflet-zoom-animated')
          const surfaceDefs = document.querySelector('svg.leaflet-zoom-animated .surfaceDefs')
          if (!surfaceDefs) {
            if (svg) {
              const _surfaceDefs = document.createElement('defs')
              _surfaceDefs.setAttribute('class', 'surfaceDefs')
              svg.appendChild(_surfaceDefs)
            }
          }
          // M438 751L438 392L1033 392L1033 751z
          // M438 751L438 418L1033 418L1033 751z
          layers.forEach((layer) => {
            if (surfaceDefs && layer instanceof Polygon) {
              const { key } = layer.options
              console.log(key)

              const d: string = layer._path.getAttribute('d')
              const clipPath = document.querySelector(`#${key}`)
              if (clipPath) {
                clipPath.children[0].setAttribute('d', d)
              }
              else {
                const parser = new DOMParser()
                const _clipPath = parser.parseFromString('<clipPath></clipPath>', 'text/xml')
                console.log(_clipPath)

                _clipPath.setAttribute('id', `${key}`)
                const _path = document.createElement('path')
                _path.setAttribute('d', d)
                _clipPath.append(_path)
                surfaceDefs.append(_clipPath)
              }
            }
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
