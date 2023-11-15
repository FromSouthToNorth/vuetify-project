import { computed, toRaw } from 'vue'
import L, { GeoJSON } from 'leaflet'
import type { FeatureGroup, Layer, LayerGroup, LeafletEvent, MarkerClusterGroup } from 'leaflet'

import type { GeoJsonObject } from 'geojson'

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

type Group = LayerGroup | FeatureGroup | GeoJSON | MarkerClusterGroup

export const mapLayer: Map<string, Group> = new Map()
mapLayer.set('layerGroup', layerGroup)
mapLayer.set('featureGroup', featureGroup)
mapLayer.set('geoJSON', geoJSON)
mapLayer.set('markerClusterGroup', markerClusterGroup)

export function setLayerArray(key: string, group: Group) {
  mapLayer.set(key, group)
}

export function hasLayerMap(key: string): Group | undefined {
  return mapLayer.has(key) ? mapLayer.get(key) : undefined
}

function initLayerGroups() {
  const map = toRaw(lMap.value)
  mapLayer.forEach((value) => {
    value.addTo(map)
  })
}

export function useLMap() {
  function addLayer(layers: Layer | Layer[] | GeoJsonObject, key?: string) {
    key = key || 'featureGroup'
    const group = mapLayer.get(key)
    if (!group)
      return
    if (group instanceof GeoJSON) {
      if (isArray(layers)) {
        layers.forEach((layer) => {
          group.addData(layer)
        })
      }
      else {
        group.addData(layers)
      }
      return
    }
    if (isArray(layers)) {
      layers.forEach((layer) => {
        group.addLayer(layer)
      })
    }
    else {
      group.addLayer(layers as Layer)
    }
  }

  function clearLayer(layers?: Layer | Layer[] | LeafletEvent, key?: string) {
    key = key || 'featureGroup'
    const group = mapLayer.get(key)
    if (!group)
      return
    if (isArray(layers)) {
      layers.forEach((layer) => {
        group.removeLayer(layer)
      })
    }
    else if (isLayers(layers)) {
      group.removeLayer(layers as Layer)
    }
    else if (isLeafletEvent(layers)) {
      const { sourceTarget } = layers as LeafletEvent
      group.removeLayer(sourceTarget)
    }
    else {
      group.clearLayers()
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
    addLayer,
    clearLayer,
    hasLayerMap,
  }
}
