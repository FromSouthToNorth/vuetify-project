<script lang="ts" setup>
import type {
  LatLngBoundsExpression,
  LatLngExpression,
  Layer,
  Map,
  TileLayerOptions,
} from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { onMounted, ref, toRaw } from 'vue'
import { createMapInfoLControl } from './control/mapInfoControl/index'
import { useAppStore } from '@/store/app'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { basePoint, layerData, lineData } from '@/data'
import {
  geometryToLayer,
  imageOverlay,
  marker,
  randomPoint,
  rectangle,
} from '@/utils/geo'
import { useLMap } from '@/hooks/web/map/useLMap'

const props = defineProps<{
  zoom: number
  center: LatLngExpression
}>()
const map = ref<Map>()
const mapContainer = ref<string | HTMLElement>('')
interface tileLayer {
  tileUrl: string
  options?: TileLayerOptions
}
const accessToken = 'pk.eyJ1IjoiaHlzZSIsImEiOiJjbGVwcWg0bDkwZXNlM3pvNXNleWUzcTQ0In0.S3VTf9vqYTAAF725ukcDjQ'
const tileLayers: Array<tileLayer> = [
  {
    tileUrl: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg?access_token={accessToken}',
    options: {
      accessToken,
    },
  },
  {
    tileUrl: 'https://api.mapbox.com/styles/v1/openstreetmap/ckasmteyi1tda1ipfis6wqhuq/tiles/256/{z}/{x}/{y}?access_token={accessToken}',
    options: {
      accessToken,
    },
  },
]

const appStore = useAppStore()

const { initLayerGroups, markerClusterGroup, addLayer, hasLayerMap } = useLMap()

onMounted(async () => {
  const { zoom, center } = props
  map.value = L.map(mapContainer.value, {
    zoom,
    center,
    minZoom: 3,
    maxZoom: 25,
  })
  const toRawMap = toRaw(map.value)
  appStore.setLMap(toRawMap)
  initLayerGroups()

  const hash = behaviorHash({ map: toRawMap })
  hash()

  tileLayers.forEach(({ tileUrl, options }) => {
    L.tileLayer(tileUrl, options).addTo(toRawMap)
  })

  L.Control.MyControl = L.Control.extend({
    onAdd() {
      const c = L.DomUtil.create('div', 'mapInfoControl')
      createMapInfoLControl(c)
      return c
    },
  })

  const myControl = new L.Control.MyControl({ position: 'bottomleft' })
  myControl.addTo(toRawMap)
  layerData.forEach(({ name, key, latlng, options }) => {
    const { url } = options
    const color = url ? '#4CAF50' : '#FF5722'
    const _key = `rectangle-${key}-clippath`
    const layer = rectangle(
      latlng as LatLngBoundsExpression,
      { color, key: _key, fill: false, weight: 60, opacity: 0.6 },
    )
      .bindPopup(`<h5>${key}</h5><h4>${name}</h4>`)
    addLayer(layer)
    layer._path.setAttribute('clip-path', `url(#${_key})`)

    if (url)
      addLayer(imageOverlay(options.url, latlng))
  })
  const markers: Layer[] = []

  // const bounds = featureGroup.getBounds()
  // const geoJSONMarker = randomPoint(20, [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat])
  // geoJSONMarker.features.forEach((e: any) => {
  //   marker.push(geometryToLayer(e).bindPopup('markerClusterGroup'))
  // })
  basePoint.forEach((point) => {
    markers.push(marker([point.lat, point.lng])
      .bindPopup(`<h4>${point.devicePosition}</h4>`)
      .bindTooltip(`${point.deviceID}`, { permanent: true }))
  })
  // console.time('addLayers')
  addLayer(markers, 'markerClusterGroup')
  // console.timeEnd('addLayers')
  toRawMap.fitBounds(markerClusterGroup.getBounds())
  lineData.forEach((geojson) => {
    addLayer(geojson, 'geoJSON')
  })
  const hasLayer = hasLayerMap('geoJSON')
  console.log('hasLayerMap: ', hasLayer)
  if (hasLayer) {
    hasLayer.setStyle({
      weight: 2,
    })
    hasLayer?.bindPopup(({ feature }) => {
      return `<h3>${feature.properties.name}</h3>`
    })
  }
})
</script>

<template>
  <div id="map-container" ref="mapContainer" />
</template>
