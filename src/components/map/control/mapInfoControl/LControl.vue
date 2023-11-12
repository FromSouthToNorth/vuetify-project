<script lang="ts">
import type { LatLng } from 'leaflet'
import { defineComponent, ref, watch } from 'vue'
import L from 'leaflet'
import { useLMap } from '@/hooks/app/useLMap'
import { isNumber } from '@/utils/is'
import { truncate } from '@/utils/geo'

export default defineComponent({
  name: 'LControl',
  setup() {
    const { lMap, lMapZoom, lMapCenter } = useLMap()
    console.log('lMap: ', lMap)

    const mapZoom = ref<number>(0)
    const mapCenter = ref<string>('0,0')
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
    function zoomInput() {
    }
    function centerInput() {
    }
    function ok() {
      const latLng = mapCenter.value.split(',')
      lMap.value.setView({ lat: Number(latLng[0]), lng: Number(latLng[1]) }, mapZoom.value)
    }
    const res = 1982.3
    console.log(res + 4 + 20 + 0.15 * res + (res + 0.15 * res) * 0.13)

    return {
      mapZoom,
      mapCenter,
      zoomInput,
      centerInput,
      isNumber,
      ok,
    }
  },
})
</script>

<template>
  <VCard class="mapInfoControl max-auto pa-2" elevation="8" rounded="lg">
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
      </v-row>
      <v-row>
        <v-col class="pa-1">
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
