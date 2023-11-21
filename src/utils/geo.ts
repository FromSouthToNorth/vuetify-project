import type {
  CircleMarker,
  CircleMarkerOptions,
  IconOptions,
  ImageOverlay,
  ImageOverlayOptions,
  LatLng,
  LatLngBoundsExpression,
  LatLngExpression,
  Layer,
  LayerOptions,
  PolylineOptions,
} from 'leaflet'
import L from 'leaflet'
import * as turf from '@turf/turf'
import type { BBox, FeatureCollection } from '@turf/turf'
import type { Feature } from 'geojson'

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

export function randomPoint(amount: number, bbox: BBox): FeatureCollection {
  return turf.randomPoint(amount, { bbox })
}

export function geometryToLayer(geoJSON: Feature): Layer {
  return L.GeoJSON.geometryToLayer(geoJSON)
}

export function imageOverlay(imageUrl: string, imageBounds: LatLngBoundsExpression, options?: ImageOverlayOptions): ImageOverlay {
  return L.imageOverlay(imageUrl, imageBounds, options)
}

export function icon(options: IconOptions) {
  return L.icon(options)
}

export function circleMarker(latlng: LatLngExpression, options?: CircleMarkerOptions): CircleMarker {
  return L.circleMarker(latlng, options)
}
