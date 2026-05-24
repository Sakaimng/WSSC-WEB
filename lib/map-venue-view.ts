import type mapboxgl from "mapbox-gl";
import {
  VENUE_LAT,
  VENUE_LNG,
  VENUE_MAP_BEARING,
  VENUE_MAP_INTRO_BEARING,
  VENUE_MAP_INTRO_PITCH,
  VENUE_MAP_INTRO_ZOOM,
  VENUE_MAP_MAX_ZOOM,
  VENUE_MAP_MIN_ZOOM,
  VENUE_MAP_PITCH,
  VENUE_MAP_ZOOM,
} from "@/lib/config";

const VENUE_CENTER: [number, number] = [VENUE_LNG, VENUE_LAT];

const mapAnimating = new WeakMap<mapboxgl.Map, boolean>();

function isMapAnimating(map: mapboxgl.Map) {
  return mapAnimating.get(map) ?? false;
}

function setMapAnimating(map: mapboxgl.Map, value: boolean) {
  mapAnimating.set(map, value);
}

/** Flat overview when zoomed out; tilt in as you zoom toward street level. */
export function pitchForZoom(zoom: number): number {
  if (zoom <= VENUE_MAP_MIN_ZOOM) return 0;
  if (zoom >= VENUE_MAP_ZOOM) return VENUE_MAP_PITCH;
  const t =
    (zoom - VENUE_MAP_MIN_ZOOM) /
    Math.max(VENUE_MAP_ZOOM - VENUE_MAP_MIN_ZOOM, 0.001);
  return VENUE_MAP_PITCH * t;
}

/** Zoom in/out only — venue stays centered (no pan). Call after intro fly-in. */
export function lockMapToVenue(map: mapboxgl.Map) {
  map.setMinZoom(VENUE_MAP_MIN_ZOOM);
  map.setMaxZoom(VENUE_MAP_MAX_ZOOM);

  map.dragPan.disable();
  map.dragRotate.disable();
  map.touchPitch.disable();
  map.boxZoom.disable();
  map.keyboard.disable();

  map.scrollZoom.enable({ around: "center" });
  map.touchZoomRotate.enable({ around: "center" });
  map.touchZoomRotate.disableRotation();

  let programmaticMove = false;

  const snapToVenue = () => {
    if (programmaticMove || isMapAnimating(map)) return;

    const center = map.getCenter();
    const drifted =
      Math.abs(center.lng - VENUE_LNG) > 0.00001 ||
      Math.abs(center.lat - VENUE_LAT) > 0.00001;

    if (!drifted) return;

    programmaticMove = true;
    const zoom = map.getZoom();
    map.jumpTo({
      center: VENUE_CENTER,
      zoom,
      pitch: pitchForZoom(zoom),
      bearing: VENUE_MAP_BEARING,
    });
    programmaticMove = false;
  };

  map.on("moveend", snapToVenue);
  map.on("zoomend", snapToVenue);
  map.on("zoom", () => {
    if (programmaticMove || isMapAnimating(map)) return;
    programmaticMove = true;
    map.setPitch(pitchForZoom(map.getZoom()));
    programmaticMove = false;
  });
}

/** Wide Tokyo view → street-level venue (easeTo for reliable animation). */
export function runVenueFlyIn(
  map: mapboxgl.Map,
  zoom: number,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    setMapAnimating(map, true);

    map.jumpTo({
      center: VENUE_CENTER,
      zoom: VENUE_MAP_INTRO_ZOOM,
      pitch: VENUE_MAP_INTRO_PITCH,
      bearing: VENUE_MAP_INTRO_BEARING,
    });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      map.off("moveend", onMoveEnd);
      window.clearTimeout(timer);
      setMapAnimating(map, false);
      resolve();
    };

    const onMoveEnd = () => {
      if (Math.abs(map.getZoom() - zoom) < 0.4) finish();
    };

    const timer = window.setTimeout(finish, duration + 600);

    requestAnimationFrame(() => {
      map.on("moveend", onMoveEnd);
      map.easeTo({
        center: VENUE_CENTER,
        zoom,
        pitch: pitchForZoom(zoom),
        bearing: VENUE_MAP_BEARING,
        duration,
        essential: true,
      });
    });
  });
}

/** Click venue — fly to max zoom with full 3D tilt. */
export function flyToVenueMaximum(map: mapboxgl.Map) {
  if (isMapAnimating(map)) return;
  if (map.getZoom() >= VENUE_MAP_MAX_ZOOM - 0.05) return;

  setMapAnimating(map, true);

  const onEnd = () => {
    map.off("moveend", onEnd);
    setMapAnimating(map, false);
  };

  map.on("moveend", onEnd);
  map.easeTo({
    center: VENUE_CENTER,
    zoom: VENUE_MAP_MAX_ZOOM,
    pitch: pitchForZoom(VENUE_MAP_MAX_ZOOM),
    bearing: VENUE_MAP_BEARING,
    duration: 1200,
    essential: true,
  });
}
