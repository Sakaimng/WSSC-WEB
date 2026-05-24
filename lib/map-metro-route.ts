import mapboxgl from "mapbox-gl";
import {
  NEAREST_METRO_STATION,
  VENUE_LAT,
  VENUE_LNG,
} from "@/lib/config";

const ROUTE_SOURCE_ID = "wssc-metro-route";
const ROUTE_GLOW_LAYER_ID = "wssc-metro-route-glow";
const ROUTE_CASE_LAYER_ID = "wssc-metro-route-case";
const ROUTE_LINE_LAYER_ID = "wssc-metro-route-line";

/** Cached walking path venue → Kinshicho Station (Mapbox Directions). */
const STATIC_METRO_WALK_ROUTE: GeoJSON.LineString = {
  type: "LineString",
  coordinates: [
    [139.814038, 35.695974],
    [139.814044, 35.696273],
    [139.814807, 35.69631],
    [139.814834, 35.696589],
    [139.814764, 35.697755],
    [139.81395, 35.697736],
    [139.813942, 35.697281],
    [139.813996, 35.697222],
    [139.813984, 35.697035],
  ],
};

const STATIC_METRO_WALK_DURATION_SEC = 329;
const STATIC_METRO_WALK_DISTANCE_M = 420;

type WalkingRoute = {
  geometry: GeoJSON.LineString;
  durationSec: number;
  distanceM: number;
};

function createMetroMarkerElement(label: string) {
  const root = document.createElement("div");
  root.className = "cyber-map-metro-marker";
  root.setAttribute("aria-label", label);
  root.innerHTML = `
    <span class="cyber-map-metro-marker__ring" aria-hidden="true"></span>
    <span class="cyber-map-metro-marker__core" aria-hidden="true">M</span>
    <span class="cyber-map-metro-marker__label">${label}</span>
  `;
  return root;
}

async function fetchWalkingRoute(
  token: string,
  from: [number, number],
  to: [number, number],
): Promise<WalkingRoute | null> {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}`,
  );
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("access_token", token);

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      routes?: {
        geometry: GeoJSON.LineString;
        duration: number;
        distance: number;
      }[];
    };

    const route = data.routes?.[0];
    if (!route?.geometry) return null;

    return {
      geometry: route.geometry,
      durationSec: route.duration,
      distanceM: route.distance,
    };
  } catch {
    return null;
  }
}

function routeInsertBefore(map: mapboxgl.Map): string | undefined {
  const candidates = [
    "settlement-minor-label",
    "settlement-major-label",
    "wssc-road-minor",
    "building",
  ];
  for (const id of candidates) {
    if (map.getLayer(id)) return id;
  }
  return undefined;
}

function removeRouteLayers(map: mapboxgl.Map) {
  for (const layerId of [
    ROUTE_LINE_LAYER_ID,
    ROUTE_CASE_LAYER_ID,
    ROUTE_GLOW_LAYER_ID,
  ]) {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  }
  if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
}

function addRouteLayers(map: mapboxgl.Map, geometry: GeoJSON.LineString) {
  removeRouteLayers(map);

  map.addSource(ROUTE_SOURCE_ID, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry,
    },
  });

  const lineLayout = {
    "line-join": "round" as const,
    "line-cap": "round" as const,
  };

  const beforeId = routeInsertBefore(map);
  const layerDefs: mapboxgl.LayerSpecification[] = [
    {
      id: ROUTE_GLOW_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: lineLayout,
      paint: {
        "line-color": "#f1f1f1",
        "line-opacity": 0.35,
        "line-width": 18,
        "line-blur": 4,
      },
    },
    {
      id: ROUTE_CASE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: lineLayout,
      paint: {
        "line-color": "#f1f1f1",
        "line-opacity": 0.85,
        "line-width": 10,
      },
    },
    {
      id: ROUTE_LINE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: lineLayout,
      paint: {
        "line-color": "#ffffff",
        "line-opacity": 1,
        "line-width": 5,
      },
    },
  ];

  const addWithSlot = (slot: string | undefined) => {
    for (const layer of layerDefs) {
      const spec = slot ? { ...layer, slot } : layer;
      if (beforeId && map.getLayer(beforeId)) {
        map.addLayer(spec, beforeId);
      } else {
        map.addLayer(spec);
      }
    }
  };

  try {
    addWithSlot("top");
  } catch {
    removeRouteLayers(map);
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry },
    });
    try {
      addWithSlot("middle");
    } catch {
      removeRouteLayers(map);
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry },
      });
      addWithSlot(undefined);
    }
  }
}

export type MetroRouteResult = {
  durationMin: number;
  distanceM: number;
};

export type MetroRouteHandle = {
  result: MetroRouteResult;
  cleanup: () => void;
};

/** Walking route from venue to Kinshicho Station. */
export async function loadMetroWalkingRoute(
  map: mapboxgl.Map,
  token: string,
  metroLabel: string,
): Promise<MetroRouteHandle> {
  const venue: [number, number] = [VENUE_LNG, VENUE_LAT];
  const metro: [number, number] = [
    NEAREST_METRO_STATION.lng,
    NEAREST_METRO_STATION.lat,
  ];

  let metroMarker: mapboxgl.Marker | null = null;

  const cleanup = () => {
    metroMarker?.remove();
    metroMarker = null;
    removeRouteLayers(map);
  };

  const walking =
    (await fetchWalkingRoute(token, venue, metro)) ?? {
      geometry: STATIC_METRO_WALK_ROUTE,
      durationSec: STATIC_METRO_WALK_DURATION_SEC,
      distanceM: STATIC_METRO_WALK_DISTANCE_M,
    };

  addRouteLayers(map, walking.geometry);

  metroMarker = new mapboxgl.Marker({
    element: createMetroMarkerElement(metroLabel),
    anchor: "center",
  })
    .setLngLat(metro)
    .addTo(map);

  return {
    result: {
      durationMin: Math.max(
        1,
        Math.round(
          (walking.durationSec || STATIC_METRO_WALK_DURATION_SEC) / 60,
        ),
      ),
      distanceM: Math.round(
        walking.distanceM || STATIC_METRO_WALK_DISTANCE_M,
      ),
    },
    cleanup,
  };
}
