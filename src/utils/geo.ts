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
  Point,
  Polygon,
  PolylineOptions,
} from 'leaflet'
import L from 'leaflet'
import * as turf from '@turf/turf'
import type { BBox, FeatureCollection } from '@turf/turf'
import type { Feature } from 'geojson'

import { toRaw } from 'vue'
import { lMap } from '@/hooks/web/map/useLMap'

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

export function latlngToPoint(latlng: LatLngExpression): Point {
  return toRaw(lMap.value).latLngToLayerPoint(latlng)
}

export function latlngsToPath(latlngs: LatLng[]) {
  const points: Point[] = latlngs.map((latlng: LatLngExpression) => {
    return latlngToPoint(latlng)
  })
  let point: Point
  let str: string = ''
  const length = points.length
  for (let i = 0; i < length; i++) {
    point = points[i]
    str += `${(i ? 'L' : 'M') + point.x} ${point.y}`
    if (i === length - 1)
      str += 'z'
  }
  return str
}

export function drawClipPath(layer: Polygon) {
  const svg = document.querySelector('svg.leaflet-zoom-animated')
  const { key } = layer.options
  if (!key)
    return
  const _clipPath = document.querySelector(`#${key} path`)
  const d = latlngsToPath(layer.getLatLngs()[0])
  if (_clipPath) {
    _clipPath.setAttribute('d', d)
  }
  else {
    const _clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
    const _path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    _clipPath.setAttribute('id', `${key}`)
    _path.setAttribute('d', d)
    _clipPath.append(_path)
    svg.append(_clipPath)
  }
}
