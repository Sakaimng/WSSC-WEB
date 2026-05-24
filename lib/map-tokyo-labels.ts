import type mapboxgl from "mapbox-gl";

const HIDDEN_PLACE_LABEL_LAYERS = [
  "continent-label",
  "country-label",
  "state-label",
] as const;

const HIDDEN_SETTLEMENT_LABEL_LAYERS = [
  "settlement-minor-label",
  "settlement-major-label",
  "settlement-subdivision-label",
] as const;

const ROAD_LABEL_ID_HINTS = ["road", "street", "shield", "motorway", "trunk"];

function hideLayer(map: mapboxgl.Map, layerId: string) {
  if (!map.getLayer(layerId)) return;
  try {
    map.setLayoutProperty(layerId, "visibility", "none");
  } catch {
    // Layer may be managed by the Standard basemap import.
  }
}

function hideRoadLabelLayers(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers;
  if (!layers) return;

  for (const layer of layers) {
    if (layer.type !== "symbol") continue;
    const id = layer.id.toLowerCase();
    if (ROAD_LABEL_ID_HINTS.some((hint) => id.includes(hint))) {
      hideLayer(map, layer.id);
    }
  }
}

/** Hide map text labels — venue/metro markers are the only labels on the map. */
export function restrictMapLabelsToTokyo(map: mapboxgl.Map) {
  try {
    map.setConfigProperty("basemap", "showRoadLabels", false);
    map.setConfigProperty("basemap", "showPlaceLabels", false);
    map.setConfigProperty("basemap", "showTransitLabels", false);
    map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
  } catch {
    // Standard basemap import may be unavailable on some styles.
  }

  for (const layerId of HIDDEN_PLACE_LABEL_LAYERS) {
    hideLayer(map, layerId);
  }

  for (const layerId of HIDDEN_SETTLEMENT_LABEL_LAYERS) {
    hideLayer(map, layerId);
  }

  hideRoadLabelLayers(map);

  try {
    map.setConfigProperty("place-labels", "states", false);
  } catch {
    // Import config namespace varies by style version.
  }
}
