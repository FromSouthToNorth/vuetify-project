<script lang="ts" setup>
import type { Layer, Map } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { onMounted, ref, toRaw } from 'vue'
import { createMapInfoLControl } from './control/mapInfoControl/index'
import { useAppStore } from '@/store/app'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { layerData } from '@/data'
import { geometryToLayer, randomPoint, rectangle } from '@/utils/geo'
import { useLMap } from '@/hooks/web/map/useLMap'

const props = defineProps<{
  zoom: number
  center: L.LatLngExpression
}>()
const map = ref<Map>()
const mapContainer = ref<string | HTMLElement>('')
interface tileLayer {
  tileUrl: string
  options?: L.TileLayerOptions
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

const { initLayerGroups, featureGroup, addFeatureGroup, addMarkerClusterGroup } = useLMap()

onMounted(async () => {
  const { zoom, center } = props
  map.value = L.map(mapContainer.value, {
    zoom,
    center,
    maxZoom: 18,
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
  layerData.forEach((el) => {
    const layer = rectangle(el.latlng).bindPopup('rectangle')
    addFeatureGroup(layer)
  })

  const bounds = featureGroup.getBounds()
  const geoJSONMarker = randomPoint(20, [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat])
  const marker: Layer[] = []
  geoJSONMarker.features.forEach((e: any) => {
    marker.push(geometryToLayer(e).bindPopup('markerClusterGroup'))
  })
  // console.time('addLayers')
  addMarkerClusterGroup(marker)
  // console.timeEnd('addLayers')
})
</script>

<template>
  <div id="map-container" ref="mapContainer" />
</template>
