"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { PreloaderLogoMark } from "@/components/PreloaderLogoMark";
import { PRELOADER_VIEW_W } from "@/lib/preloader-logo-paths";

const INTRO_INNER = { y: 36, opacity: 0 };
const INTRO_SVG = { y: 8, opacity: 0.25, filter: "blur(12px)", scale: 0.94 };
const HOLD_AFTER_FILL_S = 0.5;
const WIPE_DURATION_S = 0.85;
const OVERLAY_FADE_DURATION_S = 1.15;
export const PAGE_PRELOADER_DONE_EVENT = "wssc:page-preloader-done";

function preparePathStrokes(paths: SVGPathElement[]) {
  paths.forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, {
      fill: "none",
      stroke: "#ffffff",
      strokeWidth: 1.35,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: len,
      strokeDashoffset: len,
    });
  });
}

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);

  const root = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    let cancelled = false;

    const el = root.current;
    const innerEl = innerRef.current;
    const svgEl = svgRef.current;
    const clipRect = clipRectRef.current;

    if (!el || !innerEl || !svgEl || !clipRect) {
      document.body.style.overflow = "";
      setVisible(false);
      return;
    }

    const paths = [...innerEl.querySelectorAll<SVGPathElement>(".preloader-path")];
    preparePathStrokes(paths);

    contextRef.current?.revert();
    contextRef.current = null;
    timelineRef.current?.kill();

    contextRef.current = gsap.context(() => {
      gsap.set(el, { opacity: 1 });
      gsap.set(innerEl, INTRO_INNER);
      gsap.set(svgEl, INTRO_SVG);
      gsap.set(clipRect, { attr: { width: 0 } });

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;
          document.body.style.overflow = "";
          window.dispatchEvent(new Event(PAGE_PRELOADER_DONE_EVENT));
          setVisible(false);
        },
      });

      timelineRef.current = tl;

      tl.to(innerEl, {
        opacity: 1,
        y: 0,
        duration: 1.65,
        ease: "power3.out",
      });

      tl.to(
        svgEl,
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          duration: 1.75,
          ease: "back.out(1.2)",
        },
        0.1,
      );

      tl.to(
        clipRect,
        {
          attr: { width: PRELOADER_VIEW_W },
          duration: 1.5,
          ease: "power2.inOut",
        },
        0,
      );

      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 0.95,
          stagger: { each: 0.028, from: "start" },
          ease: "power2.inOut",
        },
        0.06,
      );

      tl.to(
        paths,
        {
          fill: "#f1f1f1",
          stroke: "rgba(255,255,255,0)",
          strokeWidth: 0,
          duration: 0.52,
          stagger: { each: 0.02, from: "start" },
          ease: "power2.out",
        },
        "-=0.42",
      );

      tl.to(paths, {
        fill: "#ffffff",
        duration: 0.22,
        stagger: { each: 0.012, from: "center" },
        ease: "sine.out",
      });

      tl.to({}, { duration: HOLD_AFTER_FILL_S });

      tl.to(clipRect, {
        attr: { width: 0 },
        duration: WIPE_DURATION_S,
        ease: "power2.in",
      });

      tl.to(el, {
        opacity: 0,
        duration: OVERLAY_FADE_DURATION_S,
        ease: "power3.inOut",
      });
    }, root);

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      timelineRef.current = null;
      contextRef.current?.revert();
      contextRef.current = null;
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={root}
      data-page-preloader
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
      aria-busy="true"
      aria-label="Loading site"
    >
      <div
        ref={innerRef}
        className="flex w-[min(92vw,820px)] justify-center px-6 opacity-0 [&_svg]:select-none"
      >
        <PreloaderLogoMark svgRef={svgRef} clipRectRef={clipRectRef} />
      </div>
    </div>
  );
}
