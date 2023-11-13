import { computed } from 'vue'
import type { Layer } from 'leaflet'
import { useAppStore } from '@/store/app'

export function useLMap() {
  const appStore = useAppStore()
  const lMap = computed(() => appStore.getLMap)
  const lMapZoom = computed(() => appStore.getLMapZoom)
  const lMapCenter = computed(() => appStore.getLMapCenter)
  const layerGroup = computed(() => appStore.getLayerGroup)
  const featureGroup = computed(() => appStore.getFeatureGroup)
  const geoJSON = computed(() => appStore.getGeoJSON)

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

  function addGeoJSON(layer: Layer) {
    appStore.geoJSON.addLayer(layer)
  }

  function removeGeoJSON(layer: Layer | undefined) {
    if (layer)
      appStore.geoJSON.removeLayer(layer)
    else
      appStore.geoJSON.clearLayers()
  }

  return {
    lMap,
    lMapZoom,
    lMapCenter,
    layerGroup,
    featureGroup,
    geoJSON,
    addLayerGroup,
    removeLayerGroup,
    addFeatureGroup,
    removeFeatureGroup,
    addGeoJSON,
    removeGeoJSON,
  }
}
