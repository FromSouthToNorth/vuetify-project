import type { LatLng } from "leaflet";
import * as turf from '@turf/turf'

export function truncate(latLng: LatLng, options?: {
  precision?: number;
  coordinates?: number;
  mutate?: boolean;
}): number[] {
  const point = turf.point([latLng.lng, latLng.lat])
  options = options ? options : { precision: 8, coordinates: 2 }
  return turf.getCoord(turf.truncate(point, options))
}
