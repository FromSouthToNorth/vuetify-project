<script lang="ts" setup>
import LMap from '@/components/map/LMap.vue'
</script>

<template>
  <LMap ref="map" :zoom="4" :center="[0, 0]" />
</template>
