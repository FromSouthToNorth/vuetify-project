<script lang="ts">
import { LatLng, latLng } from 'leaflet'
import { defineComponent, ref, watch } from 'vue'
import { useLMap } from '@/hooks/app/useLMap'
import { isNumber, isString } from '@/utils/is'
import { truncate } from '@/utils/geo'

export default defineComponent({
  name: 'LControl',
  setup() {
    const { lMap, lMapZoom, lMapCenter } = useLMap()
    console.log('lMap: ', lMap);

    const mapZoom = ref<number>(0)
    const mapCenter = ref<string>('0,0')
    watch(
      () => lMapZoom.value,
      (v: Number) => {
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
    function zoomInput(e: InputEvent) {
      if (e.target.value)
        lMap.value.setZoom(e.target.value)
    }

    function centerInput(e: InputEvent) {
      const { value } = e.target
      if (value) {
        console.log(value);

        const c = [',', '/']
        console.log(value.includes('/'));

        let center
        for (const s of c) {
          if (value.includes(s)) {
            center = value?.split(s)
            console.log(center);
            break
          }
        }
        console.log(center);

        if (center && center.length === 2) {
          const zoom = lMap.value.getZoom()
          lMap.value.setView(center, zoom)
        }
      }
    }
    return {
      mapZoom,
      mapCenter,
      zoomInput,
      centerInput,
      isNumber,
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
            <VBtn>确定</VBtn>
            <VBtn>取消</VBtn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </VCard>
</template>
