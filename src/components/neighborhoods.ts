/** Geographic coordinate pair. */
interface LatLng {
  lat: number;
  lng: number;
}

/** Approximate map center for each known neighborhood label. */
export const NEIGHBORHOOD_COORDS: Record<string, LatLng> = {
  "Pacific Heights": { lat: 37.7925, lng: -122.4382 },
  "Cow Hollow": { lat: 37.7986, lng: -122.4379 },
  "Nob Hill": { lat: 37.7920, lng: -122.4156 },
  "North Beach": { lat: 37.8060, lng: -122.4103 },
  "Presidio Heights": { lat: 37.7870, lng: -122.4530 },
  "Laurel Heights": { lat: 37.7845, lng: -122.4497 },
  "Japantown / Lower Pac Heights": { lat: 37.7852, lng: -122.4295 },
  "Western Addition": { lat: 37.7810, lng: -122.4320 },
  "Western Addition / Lower Pac Heights": { lat: 37.7830, lng: -122.4310 },
  "Cathedral Hill": { lat: 37.7835, lng: -122.4220 },
  "Cathedral Hill / Pac Heights": { lat: 37.7865, lng: -122.4280 },
  "Hayes Valley": { lat: 37.7765, lng: -122.4243 },
  "SoMa": { lat: 37.7785, lng: -122.3957 },
  "Mission / SoMa border": { lat: 37.7755, lng: -122.4050 },
  "Mission / Hayes Valley": { lat: 37.7680, lng: -122.4200 },
  "Duboce Triangle / Mission": { lat: 37.7700, lng: -122.4290 },
  "Sea Cliff / Outer Richmond": { lat: 37.7860, lng: -122.4900 },
  "Presidio": { lat: 37.7989, lng: -122.4662 },
  "San Francisco (unspecified)": { lat: 37.7749, lng: -122.4194 },
  "Oakland / East Bay": { lat: 37.8044, lng: -122.2712 },
  "Marin County": { lat: 37.8800, lng: -122.5200 },
  "Hillsborough (Peninsula)": { lat: 37.5741, lng: -122.3486 },
  "London": { lat: 51.5074, lng: -0.1278 },
};

/** Fallback map center (downtown SF) used when a school has no coordinates. */
export const SF_CENTER: LatLng = { lat: 37.7849, lng: -122.4294 };
/** Initial zoom level for the neighborhood map. */
export const DEFAULT_ZOOM = 13;
