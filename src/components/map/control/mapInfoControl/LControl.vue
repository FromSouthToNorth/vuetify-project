<script lang="ts">
import type { LatLng, LatLngBounds } from 'leaflet'
import { defineComponent, ref, watch } from 'vue'
import { useLMap } from '@/hooks/web/map/useLMap'
import { isNumber } from '@/utils/is'
import { circleMarker, icon, marker, truncate } from '@/utils/geo'

import logoUrl from '@/assets/logo.png'

export default defineComponent({
  name: 'LControl',
  setup() {
    const { lMap, lMapZoom, lMapCenter, lMapBounds, addLayer, clearLayer } = useLMap()

    const mapZoom = ref<number>()
    const mapCenter = ref<string>()
    const northEast = ref<string>()
    const southWest = ref<string>()
    watch(
      () => lMapZoom.value,
      (v: number) => {
        mapZoom.value = v
      },
      {
        immediate: true,
      },
    )
    watch(
      () => lMapCenter.value,
      (v: LatLng) => {
        const coord = truncate(v)
        mapCenter.value = `${coord[1]},${coord[0]}`
      },
      {
        immediate: true,
      },
    )
    watch(
      () => lMapBounds.value,
      (v: LatLngBounds) => {
        const _northEast = truncate(v.getNorthEast())
        northEast.value = `${_northEast[1]},${_northEast[0]}`
        const _southWest = truncate(v.getSouthWest())
        southWest.value = `${_southWest[1]},${_southWest[0]}`
      },
      {
        immediate: true,
      },
    )
    function zoomInput() {
    }
    function centerInput() {
    }
    function boundsInput() {
    }
    function ok() {
      const latLng = mapCenter.value.split(',')
      lMap.value.setView({ lat: Number(latLng[0]), lng: Number(latLng[1]) }, mapZoom.value)
      // const _icon = icon({
      //   iconUrl: logoUrl,
      //   iconSize: [38, 38],
      // })
      // console.log(_icon)

      // const layer = marker({ lat: Number(latLng[0]), lng: Number(latLng[1]) }, { icon: _icon })
      const cMarker = circleMarker({ lat: Number(latLng[0]), lng: Number(latLng[1]) }, {
        color: '#FF9800',
        radius: 0,
        weight: 12,
      }).bindPopup(`${latLng[0]},${latLng[1]}<br/><p>双击标记点删除</p>`)

      cMarker.on('dblclick', clearLayer)

      addLayer(cMarker)
    }

    return {
      mapZoom,
      mapCenter,
      northEast,
      southWest,
      zoomInput,
      centerInput,
      boundsInput,
      isNumber,
      ok,
    }
  },
})
</script>

<template>
  <VCard class="max-auto pa-2" elevation="8" rounded="lg">
    <v-container class="pa-1">
      <v-row>
        <v-col sm="3" class="pa-1">
          <v-sheet>
            <VTextField v-model="mapZoom" class="mapZoom" label="zoom" @input="zoomInput" />
          </v-sheet>
        </v-col>
        <v-col sm="9" class="pa-1">
          <v-sheet>
            <VTextField v-model="mapCenter" class="mapCenter" label="center" @input="centerInput" />
          </v-sheet>
        </v-col>
        <v-col sm="9" class="pa-1">
          <v-sheet>
            <VCard>
              <div class="northEast">
                西北:
                {{ northEast }}
              </div>
              <v-divider />
              <div class="southWest">
                东南:
                {{ southWest }}
              </div>
            </VCard>
          </v-sheet>
        </v-col>
        <v-col sm="3" class="pa-1">
          <v-sheet>
            <VBtn @click="ok">
              确定
            </VBtn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </VCard>
</template>
@/hooks/web/map/useLMap
