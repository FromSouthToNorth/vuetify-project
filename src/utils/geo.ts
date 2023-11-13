import type { LatLng, LatLngBoundsExpression, LatLngExpression, Layer, LayerOptions, PolylineOptions } from 'leaflet'
import L from 'leaflet'
import * as turf from '@turf/turf'

export function truncate(latLng: LatLng, options?: {
  precision?: number
  coordinates?: number
  mutate?: boolean
}): number[] {
  const point = turf.point([latLng.lng, latLng.lat])
  options = options || { precision: 8, coordinates: 2 }
  return turf.getCoord(turf.truncate(point, options))
}

export function marker(latLng: LatLngExpression, options?: LayerOptions): Layer {
  return L.marker(latLng, options)
}

export function polyline(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions): Layer {
  return L.polyline(latlngs, options)
}

export function polygon(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions): Layer {
  return L.polygon(latlngs, options)
}

export function rectangle(bounds: LatLngBoundsExpression, options?: PolylineOptions): Layer {
  return L.rectangle(bounds, options)
}
