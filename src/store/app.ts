// Utilities
import { defineStore } from 'pinia'
import type { LatLng, Layer, Map } from 'leaflet'
import L from 'leaflet'

export const useAppStore = defineStore(
  {
    id: 'app',
    state: () => ({
      lMap: {},
      lMapZoom: 0,
      lMapCenter: { lat: 0, lng: 0 },
      layerGroup: L.layerGroup(),
      featureGroup: L.featureGroup(),
      geoJSON: L.geoJSON(),
    }),
    getters: {
      getLayerGroup(state): Layer[] {
        return state.layerGroup.getLayers()
      },
      getFeatureGroup(state): Layer[] {
        return state.featureGroup.getLayers()
      },
      getGeoJSON(state): Layer[] {
        return state.geoJSON.getLayers()
      },
      getLMap(state): Map {
        return state.lMap
      },
      getLMapZoom(): number {
        return this.getLMap.getZoom()
      },
      getLMapCenter(): LatLng {
        return this.getLMap.getCenter()
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
        this.layerGroup.addTo(lMap)
        this.featureGroup.addTo(lMap)
        this.geoJSON.addTo(lMap)
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
