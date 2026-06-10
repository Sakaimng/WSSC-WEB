"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { LocationMapView } from "@/components/LocationMapView";
import { useI18n } from "@/components/LanguageProvider";
export function MapPageContent() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const copy = gsap.utils.toArray<HTMLElement>(".map-reveal-copy");
      gsap.fromTo(
        copy,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.15,
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="map-page page-viewport relative w-full"
    >
      <div className="map-stage relative w-full">
        <LocationMapView
          mapUnavailableLabel={t.map.unavailableTitle}
          mapUnavailableHint={t.map.unavailableHint}
          venueMarkerLabel={t.map.venueMarker}
          metroStationLabel={t.map.metroStation}
          walkToMetroLabel={t.map.walkToMetro}
        />

        <div className="map-reveal-copy pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent px-[2vw] pb-8 pt-3 sm:pb-10 sm:pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white">{t.map.eyebrow}</p>
              <h1 className="mt-2 whitespace-nowrap font-sans text-base font-semibold text-white">
                {t.map.title}
              </h1>
            </div>
            <p className="hidden max-w-xs shrink-0 text-right text-xs text-neutral-500 sm:block">
              {t.map.subtitle}
            </p>
          </div>
          <p className="mt-3 max-w-md text-sm text-neutral-400 sm:hidden">
            {t.map.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
