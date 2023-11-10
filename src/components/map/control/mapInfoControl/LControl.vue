<script lang="ts">
import { latLng } from 'leaflet'
import { defineComponent, ref, watch } from 'vue'
import * as turf from '@turf/turf'
import { useLMap } from '@/hooks/app/useLMap'

export default defineComponent({
  name: 'LControl',
  setup() {
    const { lMap, lMapZoom, lMapCenter } = useLMap()
    const mapZoom = ref<number>(0)
    const mapCenter = ref<string>('0,0')
    watch(
      () => lMapZoom.value,
      (v) => {
        mapZoom.value = v
      },
      {
        immediate: true,
      },
    )
    watch(
      () => lMapCenter.value,
      (v) => {
        const { lat, lng } = v
        const point = turf.point([lng, lat])
        const options = { precision: 7, coordinates: 2 }
        const coord = turf.getCoord(turf.truncate(point, options))
        mapCenter.value = `${coord[1]},${coord[0]}`
      },
      {
        immediate: true,
      },
    )
    return {
      mapZoom,
      mapCenter,
    }
  },
})
</script>

<template>
  <VCard class="mapInfoControl max-auto pa-2" elevation="8" rounded="lg">
    <v-row no-gutters>
      <v-col sm="4">
        <VTextField v-model="mapZoom" class="mapZoom" label="zoom" />
      </v-col>
      <v-col sm="8">
        <VTextField v-model="mapCenter" class="mapCenter" label="center" size="x-mall" />
      </v-col>
      <v-col sm="12">
        <VBtn>确定</VBtn>
        <VBtn>取消</VBtn>
      </v-col>
    </v-row>
  </VCard>
</template>
