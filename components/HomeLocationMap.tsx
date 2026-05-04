"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { GOOGLE_MAPS_URL } from "@/lib/config";

const MATRIX_STREAMS = [
  { left: "8%", delay: 0, chars: "0101TOKYO" },
  { left: "19%", delay: 0.12, chars: "35.696N" },
  { left: "31%", delay: 0.24, chars: "139.814E" },
  { left: "47%", delay: 0.08, chars: "KINSHICHO" },
  { left: "62%", delay: 0.18, chars: "WSSC" },
  { left: "78%", delay: 0.04, chars: "LOCKED" },
  { left: "91%", delay: 0.28, chars: "ROUTE01" },
] as const;

export function HomeLocationMap() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const copy = el.querySelectorAll(".map-copy");
      const viewport = el.querySelector(".map-viewport");
      const rings = el.querySelectorAll(".map-ring");
      const marker = el.querySelector(".map-marker");
      const streams = el.querySelectorAll(".map-stream");
      const scanLines = el.querySelectorAll(".map-scan-line");
      const grid = el.querySelector(".map-grid");
      const dataBits = el.querySelectorAll(".map-data-bit");

      gsap.set(copy, { autoAlpha: 0, y: 28 });
      gsap.set(viewport, { autoAlpha: 0, scale: 1.24, filter: "blur(10px)" });
      gsap.set(grid, { autoAlpha: 0, backgroundPosition: "0px 0px" });
      gsap.set(streams, { autoAlpha: 0, yPercent: -120 });
      gsap.set(scanLines, { autoAlpha: 0 });
      gsap.set(dataBits, { autoAlpha: 0, y: 10 });
      gsap.set(rings, { autoAlpha: 0, scale: 0.65 });
      gsap.set(marker, { autoAlpha: 0, scale: 0.6 });

      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .to(copy, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 })
        .to(
          streams,
          {
            autoAlpha: 0.55,
            yPercent: 18,
            duration: 1.1,
            stagger: (_, target) => Number((target as HTMLElement).dataset.delay ?? 0),
            ease: "steps(10)",
          },
          "-=0.55",
        )
        .to(
          viewport,
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "expo.out",
          },
          "-=0.9",
        )
        .to(grid, { autoAlpha: 1, duration: 0.35 }, "-=1")
        .to(
          grid,
          {
            backgroundPosition: "44px 44px",
            duration: 1.8,
            ease: "none",
          },
          "-=0.8",
        )
        .fromTo(
          scanLines,
          { autoAlpha: 0.8, scaleX: 0 },
          {
            autoAlpha: 0,
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.72,
            stagger: 0.12,
            ease: "power2.inOut",
          },
          "-=1.1",
        )
        .to(
          dataBits,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.75",
        )
        .to(
          rings,
          {
            autoAlpha: 0.9,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
          },
          "-=0.65",
        )
        .to(marker, { autoAlpha: 1, scale: 1, duration: 0.45 }, "-=0.35")
        .to(streams, { autoAlpha: 0.16, duration: 0.5 }, "-=0.45");

      gsap.to(rings, {
        scale: 1.08,
        autoAlpha: 0.28,
        duration: 1.8,
        stagger: 0.22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          intro.play();
          observer.disconnect();
        },
        { threshold: 0.32 },
      );

      observer.observe(el);

      return () => observer.disconnect();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[100dvh] overflow-hidden border-t border-white/10 bg-black px-[2vw] py-20 sm:py-24"
    >
      <div className="grid min-h-[calc(100dvh-10rem)] items-center gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="max-w-xl">
          <p className="map-copy text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Location lock
          </p>
          <h2 className="map-copy mt-4 font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Find the room in Kinshicho.
          </h2>
          <p className="map-copy mt-6 leading-relaxed text-neutral-400">
            English stand-up, open mic energy, and one drink minimum at Moxy Tokyo Kinshicho.
            Tap through for the exact route before showtime.
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="map-copy mt-8 inline-flex rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Open Google Maps
          </a>
        </div>

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="map-viewport group relative block min-h-[55vh] overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-white/5"
          aria-label="Open Why So Serious Comedy location in Google Maps"
        >
          <div className="map-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
          {MATRIX_STREAMS.map((stream) => (
            <div
              key={stream.left}
              data-delay={stream.delay}
              className="map-stream pointer-events-none absolute top-0 z-10 flex flex-col gap-1 font-mono text-[0.62rem] font-semibold leading-none text-white/45"
              style={{ left: stream.left }}
            >
              {stream.chars.split("").map((char, index) => (
                <span key={`${stream.left}-${index}`}>{char}</span>
              ))}
            </div>
          ))}
          <div className="map-scan-line absolute left-0 top-[28%] z-20 h-px w-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.8)]" />
          <div className="map-scan-line absolute left-0 top-[54%] z-20 h-px w-full bg-white/50 shadow-[0_0_18px_rgba(255,255,255,0.65)]" />
          <div className="map-scan-line absolute left-0 top-[72%] z-20 h-px w-full bg-white/40 shadow-[0_0_18px_rgba(255,255,255,0.55)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(255,255,255,0.2),transparent_12%),radial-gradient(circle_at_48%_55%,rgba(255,255,255,0.1),transparent_22%),linear-gradient(135deg,transparent_0_45%,rgba(255,255,255,0.08)_45%_46%,transparent_46%_100%)]" />
          <div className="absolute left-1/2 top-1/2 h-[150%] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/15" />
          <div className="absolute left-1/2 top-1/2 h-[130%] w-px -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-white/10" />
          <div className="map-data-bit absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-neutral-400 backdrop-blur">
            Constructing route
          </div>
          <div className="map-data-bit absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-neutral-400 backdrop-blur">
            Coordinates locked
          </div>
          <div className="absolute left-[58%] top-[45%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 map-ring" />
          <div className="absolute left-[58%] top-[45%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 map-ring" />
          <div className="absolute left-[58%] top-[45%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 map-ring" />
          <div className="map-marker absolute left-[58%] top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-white shadow-[0_0_32px_rgba(255,255,255,0.9)]" />
            <span className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              Moxy Kinshicho
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-neutral-500">
            <span>Tokyo JP</span>
            <span className="text-white transition group-hover:text-neutral-300">Route</span>
          </div>
        </a>
      </div>
    </section>
  );
}
