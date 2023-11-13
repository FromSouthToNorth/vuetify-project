// Utilities
import { defineStore } from 'pinia'
import type { FeatureGroup, GeoJSON, LatLng, LatLngBounds, LayerGroup, Map, MarkerClusterGroup } from 'leaflet'
import L from 'leaflet'

export const useAppStore = defineStore(
  {
    id: 'app',
    state: () => ({
      lMap: {},
      lMapZoom: 0,
      lMapCenter: { lat: 0, lng: 0 },
      layerGroup: L.layerGroup(),
      lMapBounds: [],
      featureGroup: L.featureGroup(),
      geoJSON: L.geoJSON(),
      markercluster: L.markerClusterGroup({ chunkedLoading: true }),
    }),
    getters: {
      getLayerGroup(state): LayerGroup {
        return state.layerGroup
      },
      getFeatureGroup(state): FeatureGroup {
        return state.featureGroup
      },
      getGeoJSON(state): GeoJSON {
        return state.geoJSON
      },
      getMarkercluster(state): MarkerClusterGroup {
        return state.markercluster
      },
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
        this.layerGroup.addTo(lMap)
        this.featureGroup.addTo(lMap)
        this.geoJSON.addTo(lMap)
        this.markercluster.addTo(lMap)
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
