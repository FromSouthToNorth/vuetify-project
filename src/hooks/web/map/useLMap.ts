import { computed, toRaw } from 'vue'
import type { FeatureGroup, GeoJSON, Layer, LayerGroup, LeafletEvent, MarkerClusterGroup } from 'leaflet'
import L from 'leaflet'
import { useAppStore } from '@/store/app'
import { isArray, isLayers, isLeafletEvent } from '@/utils/is'

export const appStore = useAppStore()
export const lMap = computed(() => appStore.getLMap)
export const lMapZoom = computed(() => appStore.getLMapZoom)
export const lMapCenter = computed(() => appStore.getLMapCenter)
export const lMapBounds = computed(() => appStore.getLMapBounds)

export const layerGroup: LayerGroup = L.layerGroup()
export const featureGroup: FeatureGroup = L.featureGroup()
export const geoJSON: GeoJSON = L.geoJSON()
export const markerClusterGroup: MarkerClusterGroup = L.markerClusterGroup()

function initLayerGroups() {
  const map = toRaw(lMap.value)
  layerGroup.addTo(map)
  featureGroup.addTo(map)
  geoJSON.addTo(map)
  markerClusterGroup.addTo(map)
}

export function useLMap() {
  function addLayerGroup(layers: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        layerGroup.addLayer(layer)
      })
    }
    else {
      layerGroup.addLayer(layers)
    }
  }

  function clearLayerGroup(layers?: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        layerGroup.removeLayer(layer)
      })
    }
    else if (layers) {
      layerGroup.removeLayer(layers)
    }
    else {
      layerGroup.clearLayers()
    }
  }

  function addFeatureGroup(layers: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        featureGroup.addLayer(layer)
      })
    }
    else {
      featureGroup.addLayer(layers)
    }
  }

  function clearFeatureGroup(layers?: Layer | Layer[] | LeafletEvent) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        featureGroup.removeLayer(layer)
      })
    }
    else if (layers && isLayers(layers)) {
      featureGroup.removeLayer(layers)
    }
    else if (isLeafletEvent(layers)) {
      featureGroup.removeLayer(layers.sourceTarget)
    }
    else {
      featureGroup.clearLayers()
    }
  }

  function addGeoJSON(layers: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        geoJSON.addLayer(layer)
      })
    }
    else {
      geoJSON.addLayer(layers)
    }
  }

  function clearGeoJSON(layers?: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        geoJSON.removeLayer(layer)
      })
    }
    else if (layers && isLayers(layers)) {
      geoJSON.removeLayer(layers)
    }
    else if (isLeafletEvent(layers)) {
      geoJSON.removeLayer(layers.sourceTarget)
    }
    else {
      geoJSON.clearLayers()
    }
  }

  function addMarkerClusterGroup(layers: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        markerClusterGroup.addLayer(layer)
      })
    }
    else {
      markerClusterGroup.addLayer(layers)
    }
  }

  function clearMarkerClusterGroup(layers?: Layer | Layer[]) {
    if (isArray(layers)) {
      layers.forEach((layer) => {
        markerClusterGroup.removeLayer(layer)
      })
    }
    else if (layers && isLayers(layers)) {
      markerClusterGroup.removeLayer(layers)
    }
    else if (isLeafletEvent(layers)) {
      markerClusterGroup.removeLayer(layers.sourceTarget)
    }
    else {
      markerClusterGroup.clearLayers()
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
    markerClusterGroup,
    initLayerGroups,
    addMarkerClusterGroup,
    clearMarkerClusterGroup,
    addLayerGroup,
    clearLayerGroup,
    addFeatureGroup,
    clearFeatureGroup,
    addGeoJSON,
    clearGeoJSON,
  }
}
