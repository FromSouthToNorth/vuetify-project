import { computed } from 'vue'
import type { Layer } from 'leaflet'
import type * as geojson from 'geojson'

import { useAppStore } from '@/store/app'
import { isArray } from '@/utils/is'

export function useLMap() {
  const appStore = useAppStore()
  const lMap = computed(() => appStore.getLMap)
  const lMapZoom = computed(() => appStore.getLMapZoom)
  const lMapCenter = computed(() => appStore.getLMapCenter)
  const lMapBounds = computed(() => appStore.getLMapBounds)
  const layerGroup = computed(() => appStore.getLayerGroup)
  const featureGroup = computed(() => appStore.getFeatureGroup)
  const geoJSON = computed(() => appStore.getGeoJSON)
  const markercluster = computed(() => appStore.getMarkercluster)

  function addLayerGroup(layer: Layer) {
    appStore.layerGroup.addLayer(layer)
  }

  function removeLayerGroup(layer: Layer | undefined) {
    if (layer)
      appStore.layerGroup.removeLayer(layer)
    else
      appStore.layerGroup.clearLayers()
  }

  function addFeatureGroup(layer: Layer) {
    appStore.featureGroup.addLayer(layer)
  }

  function removeFeatureGroup(layer: Layer | undefined) {
    if (layer)
      appStore.featureGroup.removeLayer(layer)
    else
      appStore.featureGroup.clearLayers()
  }

  function addGeoJSON(layer: geojson.GeoJsonObject) {
    appStore.geoJSON.addData(layer)
  }

  function removeGeoJSON(layer: Layer | undefined) {
    if (layer)
      appStore.geoJSON.removeLayer(layer)
    else
      appStore.geoJSON.clearLayers()
  }

  function addMarkercluster(layers: Layer | Layer[]) {
    if (isArray(layers)) {
      appStore.markercluster.clearLayers()
      appStore.markercluster.addLayers(layers)
    }
    else {
      appStore.markercluster.addLayer(layers)
    }
  }

  return {
    lMap,
    lMapZoom,
    lMapCenter,
    lMapBounds,
    layerGroup,
    featureGroup,
    geoJSON,
    markercluster,
    addLayerGroup,
    removeLayerGroup,
    addFeatureGroup,
    removeFeatureGroup,
    addGeoJSON,
    removeGeoJSON,
    addMarkercluster,
  }
}
