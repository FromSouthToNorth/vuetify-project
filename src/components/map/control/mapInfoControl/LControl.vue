<script lang="ts">
import type { LatLng, LatLngBounds } from 'leaflet'
import { defineComponent, ref, watch } from 'vue'
import { useLMap } from '@/hooks/app/useLMap'
import { isNumber } from '@/utils/is'
import { marker, truncate } from '@/utils/geo'

export default defineComponent({
  name: 'LControl',
  setup() {
    const { lMap, lMapZoom, lMapCenter, lMapBounds, addFeatureGroup, removeFeatureGroup } = useLMap()

    const mapZoom = ref<number>(0)
    const mapCenter = ref<string>('0,0')
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

      const layer = marker({ lat: Number(latLng[0]), lng: Number(latLng[1]) })

      layer.on('click', (e) => {
        removeFeatureGroup(e.sourceTarget)
      })
      addFeatureGroup(layer)
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
