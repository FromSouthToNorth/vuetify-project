<script lang="ts" setup>
import type { Layer } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { onMounted, reactive, ref } from 'vue'
import { createMapInfoLControl } from './control/mapInfoControl/index'
import { useAppStore } from '@/store/app'
import { behaviorHash } from '@/hooks/web/map/useHash'
import { layerData } from '@/data'
import { geometryToLayer, randomPoint, rectangle } from '@/utils/geo'
import { useLMap } from '@/hooks/app/useLMap'

const props = defineProps<{
  zoom: number
  center: L.LatLngExpression
}>()

const { featureGroup, addFeatureGroup, addMarkercluster } = useLMap()

let map = reactive<L.Map | object>({})
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
onMounted(async () => {
  const { zoom, center } = props
  map = L.map(mapContainer.value, {
    zoom,
    center,
    maxZoom: 18,
  })
  appStore.setLMap(map)

  const hash = behaviorHash({ map })
  hash()

  tileLayers.forEach(({ tileUrl, options }) => {
    L.tileLayer(tileUrl, options).addTo(map)
  })

  L.Control.MyControl = L.Control.extend({
    onAdd() {
      const c = L.DomUtil.create('div', 'mapInfoControl')
      createMapInfoLControl(c)
      return c
    },
  })

  const myControl = new L.Control.MyControl({ position: 'bottomleft' })
  myControl.addTo(map)
  layerData.forEach((el) => {
    const layer = rectangle(el.latlng)
    addFeatureGroup(layer)
  })

  const bounds = featureGroup.value.getBounds()
  const geoJSONMarker = randomPoint(60, [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat])
  const marker: Layer[] = []
  console.time('geometryToLayer')
  geoJSONMarker.features.forEach((e) => {
    marker.push(geometryToLayer(e))
  })
  console.timeEnd('geometryToLayer')
  // console.time('addMarkercluster')
  addMarkercluster(marker)
  // console.timeEnd('addMarkercluster')
})
</script>

<template>
  <div id="map-container" ref="mapContainer" />
</template>
