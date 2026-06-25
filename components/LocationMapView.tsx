"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import {
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_LOCAL_PATH,
  MAPBOX_STYLE_URL,
  VENUE_CITY,
  VENUE_COORDINATES,
  VENUE_LAT,
  VENUE_LNG,
  VENUE_MAP_FLY_DURATION_MS,
  VENUE_MAP_INTRO_BEARING,
  VENUE_MAP_INTRO_PITCH,
  VENUE_MAP_INTRO_ZOOM,
  VENUE_MAP_ZOOM,
  NEAREST_METRO_STATION,
  VENUE_NAME,
  VENUE_NEIGHBORHOOD,
  VENUE_REGION,
  VENUE_STREET,
} from "@/lib/config";
import { loadMetroWalkingRoute } from "@/lib/map-metro-route";
import { restrictMapLabelsToTokyo } from "@/lib/map-tokyo-labels";
import {
  flyToVenueMaximum,
  lockMapToVenue,
  runVenueFlyIn,
} from "@/lib/map-venue-view";

type Props = {
  mapUnavailableLabel: string;
  mapUnavailableHint: string;
  venueMarkerLabel: string;
  metroStationLabel: string;
  walkToMetroLabel: (minutes: number) => string;
};

const MAP_MIN_HEIGHT = "calc(100dvh - 4rem)";

function resolveStyleUrl(): string {
  const useHosted =
    process.env.NEXT_PUBLIC_MAPBOX_USE_HOSTED_STYLE === "true";

  if (typeof window !== "undefined" && !useHosted) {
    return `${window.location.origin}${MAPBOX_STYLE_LOCAL_PATH}`;
  }

  return MAPBOX_STYLE_URL;
}

function waitForMapStyle(map: mapboxgl.Map, timeoutMs = 8000): Promise<void> {
  if (map.isStyleLoaded()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      map.off("load", onLoad);
      reject(new Error("Map style timed out"));
    }, timeoutMs);

    const onLoad = () => {
      window.clearTimeout(timer);
      resolve();
    };

    map.once("load", onLoad);
  });
}

const BASEMAP_CONFIG: Record<string, boolean | string> = {
  showPlaceLabels: false,
  showRoadLabels: false,
  showPedestrianRoads: true,
  showTransitLabels: false,
  showAdminBoundaries: true,
  show3dObjects: false,
  show3dBuildings: false,
  show3dFacades: false,
  showPointOfInterestLabels: false,
  colorLand: "hsl(0, 0%, 9%)",
  colorWater: "hsl(0, 0%, 14%)",
  colorGreenspace: "hsl(0, 0%, 16%)",
  colorRoads: "hsl(0, 0%, 62%)",
  colorTrunks: "hsl(0, 0%, 78%)",
  colorMotorways: "hsl(0, 0%, 90%)",
};

function disableMapTerrain(map: mapboxgl.Map) {
  try {
    map.setTerrain(null);
  } catch {
    // Style may not define terrain.
  }
}

function enableBasemapDetail(map: mapboxgl.Map) {
  disableMapTerrain(map);

  for (const [key, value] of Object.entries(BASEMAP_CONFIG)) {
    try {
      map.setConfigProperty("basemap", key, value);
    } catch {
      // Standard basemap import may be unavailable on some styles.
    }
  }

  disableMapTerrain(map);
}

function enhanceBuildingExtrusion(map: mapboxgl.Map) {
  if (!map.getLayer("building")) return;

  try {
    map.setPaintProperty("building", "fill-extrusion-opacity", 0.94);
    map.setPaintProperty("building", "fill-extrusion-height", [
      "interpolate",
      ["linear"],
      ["zoom"],
      11,
      0,
      12,
      ["coalesce", ["get", "height"], 12],
      16,
      ["*", ["coalesce", ["get", "height"], 14], 1.1],
    ]);
  } catch {
    // Layer paint may differ on hosted styles.
  }
}

function createMarkerElement(label: string, onActivate: () => void) {
  const root = document.createElement("button");
  root.type = "button";
  root.className = "cyber-map-marker";
  root.setAttribute("aria-label", label);
  root.innerHTML = `
    <span class="cyber-map-marker__pulse" aria-hidden="true"></span>
    <span class="cyber-map-marker__core" aria-hidden="true"></span>
    <span class="cyber-map-marker__label">${label}</span>
  `;
  root.addEventListener("click", (event) => {
    event.stopPropagation();
    onActivate();
  });
  return root;
}

export function LocationMapView({
  mapUnavailableLabel,
  mapUnavailableHint,
  venueMarkerLabel,
  metroStationLabel,
  walkToMetroLabel,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const metroRouteCleanupRef = useRef<(() => void) | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [walkToMetro, setWalkToMetro] = useState<string | null>(null);

  const token =
    MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  useEffect(() => {
    const shell = shellRef.current;
    const container = containerRef.current;
    if (!token || !shell || !container) return;

    let cancelled = false;

    const resizeMap = () => {
      mapRef.current?.resize();
    };

    const initMap = () => {
      if (cancelled || mapRef.current) return;

      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container,
        style: resolveStyleUrl(),
        center: [VENUE_LNG, VENUE_LAT],
        zoom: VENUE_MAP_INTRO_ZOOM,
        pitch: VENUE_MAP_INTRO_PITCH,
        bearing: VENUE_MAP_INTRO_BEARING,
        antialias: true,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("style.load", () => {
        disableMapTerrain(map);
        restrictMapLabelsToTokyo(map);
      });

      map.on("error", (event) => {
        const message =
          event.error?.message ??
          (typeof event.error === "string" ? event.error : "Map failed to load");
        setMapError(message);
      });

      let experienceBooted = false;

      const startMapExperience = async () => {
        if (cancelled || !mapRef.current || experienceBooted) return;

        try {
          await waitForMapStyle(map);
          if (cancelled || !mapRef.current) return;
          experienceBooted = true;

          resizeMap();
          setMapLoaded(true);

          try {
            enableBasemapDetail(map);
            restrictMapLabelsToTokyo(map);
            enhanceBuildingExtrusion(map);
          } catch (setupError) {
            console.warn("Map style tweaks skipped:", setupError);
          }

          await runVenueFlyIn(map, VENUE_MAP_ZOOM, VENUE_MAP_FLY_DURATION_MS);

          if (cancelled || !mapRef.current) return;

          lockMapToVenue(map);

          const metroRoute = await loadMetroWalkingRoute(
            map,
            token,
            metroStationLabel,
          );

          if (cancelled || !mapRef.current) {
            metroRoute.cleanup();
            return;
          }

          metroRouteCleanupRef.current = metroRoute.cleanup;
          setWalkToMetro(walkToMetroLabel(metroRoute.result.durationMin));

          if (!markerRef.current) {
            markerRef.current = new mapboxgl.Marker({
              element: createMarkerElement(venueMarkerLabel, () =>
                flyToVenueMaximum(map),
              ),
              anchor: "center",
            })
              .setLngLat([VENUE_LNG, VENUE_LAT])
              .addTo(map);
          }

          map.resize();
        } catch (error) {
          console.error("Map experience failed:", error);
          setMapError(
            error instanceof Error ? error.message : "Map failed to start",
          );
          if (!cancelled) setMapLoaded(true);
        }
      };

      const queueExperience = () => {
        void startMapExperience();
      };

      map.once("load", queueExperience);
      window.setTimeout(queueExperience, 2000);

      if (map.loaded()) queueExperience();
    };

    const observer = new ResizeObserver(() => {
      if (shell.offsetWidth > 0 && shell.offsetHeight > 0) {
        initMap();
        resizeMap();
      }
    });

    observer.observe(shell);
    window.addEventListener("resize", resizeMap);

    requestAnimationFrame(() => {
      requestAnimationFrame(initMap);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", resizeMap);
      metroRouteCleanupRef.current?.();
      metroRouteCleanupRef.current = null;
      markerRef.current?.remove();
      markerRef.current = null;
      setWalkToMetro(null);
      mapRef.current?.remove();
      mapRef.current = null;
      setMapLoaded(false);
      setMapError(null);
    };
  }, [token, venueMarkerLabel, metroStationLabel, walkToMetroLabel]);

  if (!token) {
    return (
      <div
        className="cyber-map-fallback relative flex w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-center"
        style={{ minHeight: MAP_MIN_HEIGHT }}
      >
        <p className="relative z-10 text-sm font-semibold text-white">
          {mapUnavailableLabel}
        </p>
        <p className="relative z-10 mt-3 max-w-md text-sm text-neutral-400">
          {mapUnavailableHint}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className="cyber-map-shell relative w-full overflow-hidden bg-black"
      style={{ minHeight: MAP_MIN_HEIGHT, height: "100%" }}
    >
      <div ref={containerRef} className="cyber-map-canvas absolute inset-0" />

      {!mapLoaded && !mapError ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950">
          <p className="text-sm text-neutral-500">Loading map…</p>
        </div>
      ) : null}

      {mapError ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 px-6 text-center">
          <p className="text-sm text-neutral-300">{mapError}</p>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${
          mapLoaded ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(241,241,241,0.1),transparent_42%)]" />
      </div>

      <div className="map-venue-panel pointer-events-none absolute inset-x-0 z-20 border-t border-white/10 bg-gradient-to-t from-black/92 via-black/80 to-transparent p-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-neutral-500">
          {VENUE_NAME}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.68rem] font-medium text-neutral-200 sm:grid-cols-4">
          <p className="min-w-0">{VENUE_STREET}</p>
          <p className="whitespace-nowrap">{VENUE_NEIGHBORHOOD}</p>
          <p className="whitespace-nowrap">{VENUE_CITY}</p>
          <p className="whitespace-nowrap text-right sm:text-left">{VENUE_REGION}</p>
        </div>
        <p className="mt-2 flex items-center justify-between gap-3 text-[0.62rem] text-neutral-500">
          <span className="min-w-0">
            {walkToMetro ? (
              <>
                <span className="text-neutral-400">{walkToMetro}</span>
                <span className="text-neutral-600"> · </span>
                <span className="whitespace-nowrap">{NEAREST_METRO_STATION.name}</span>
              </>
            ) : (
              <span className="whitespace-nowrap">{NEAREST_METRO_STATION.name}</span>
            )}
          </span>
          <span className="shrink-0">{VENUE_COORDINATES}</span>
        </p>
      </div>
    </div>
  );
}
