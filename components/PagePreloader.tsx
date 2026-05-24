"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import {
  PreloaderLogoMark,
  type WsscClipRectRefs,
} from "@/components/PreloaderLogoMark";
import {
  LOGO_COMPACT_PATH_ORDER,
  LOGO_COMPACT_PATH_SET,
  LOGO_COMPACT_TARGET_X,
  PRELOADER_VIEW_H,
  PRELOADER_VIEW_W,
} from "@/lib/preloader-logo-paths";

const INTRO_INNER = { y: 22, opacity: 0 };
const INTRO_SVG = {
  y: 0,
  opacity: 0,
  filter: "blur(14px)",
  scale: 1,
};
const OVERLAY_FADE_DURATION_S = 1.05;
export const PAGE_PRELOADER_DONE_EVENT = "wssc:page-preloader-done";

const VIEW_MID_X = PRELOADER_VIEW_W / 2;

/** Exit: slide glyphs down (SVG units). */
const EXIT_SLIDE_Y = PRELOADER_VIEW_H * 0.62;

function compactOffsetsForPaths(wsscPaths: SVGPathElement[]): number[] {
  return wsscPaths.map((path, index) => {
    const box = path.getBBox();
    return LOGO_COMPACT_TARGET_X[index]! - box.x;
  });
}

/**
 * Centers the compact WSSC cluster. `compactX` is applied on wrapper `<g>`s while
 * `getBBox()` on each path is in local space — union uses `b.x + compactX[i]`.
 */
function centerShiftForCompactCluster(
  wsscPaths: SVGPathElement[],
  compactX: number[],
): number {
  let minX = Infinity;
  let maxX = -Infinity;
  wsscPaths.forEach((path, i) => {
    const b = path.getBBox();
    const dx = compactX[i] ?? 0;
    minX = Math.min(minX, b.x + dx);
    maxX = Math.max(maxX, b.x + b.width + dx);
  });
  if (!Number.isFinite(minX)) return 0;
  const cx = (minX + maxX) / 2;
  return VIEW_MID_X - cx;
}

function setWsscLetters(paths: SVGPathElement[]) {
  gsap.set(paths, {
    fill: "#F1F1F1",
    fillOpacity: 1,
    stroke: "none",
    strokeWidth: 0,
    opacity: 1,
  });
}

function setMutedHidden(paths: SVGPathElement[]) {
  gsap.set(paths, {
    fill: "#F1F1F1",
    fillOpacity: 1,
    opacity: 0,
  });
}

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);

  const root = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const markInnerRef = useRef<SVGGElement>(null);
  const wsscClip0 = useRef<SVGRectElement>(null);
  const wsscClip1 = useRef<SVGRectElement>(null);
  const wsscClip2 = useRef<SVGRectElement>(null);
  const wsscClip3 = useRef<SVGRectElement>(null);
  const wsscClipRectRefs: WsscClipRectRefs = [
    wsscClip0,
    wsscClip1,
    wsscClip2,
    wsscClip3,
  ];

  const contextRef = useRef<gsap.Context | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    let cancelled = false;

    const el = root.current;
    const innerEl = innerRef.current;
    const svgEl = svgRef.current;
    const markInner = markInnerRef.current;

    if (!el || !innerEl || !svgEl || !markInner) {
      document.body.style.overflow = "";
      queueMicrotask(() => setVisible(false));
      return;
    }

    const clipRects = wsscClipRectRefs
      .map((r) => r.current)
      .filter((x): x is SVGRectElement => x !== null);

    if (clipRects.length !== 4) {
      document.body.style.overflow = "";
      queueMicrotask(() => setVisible(false));
      return;
    }

    const wsscWraps = [0, 1, 2, 3].map((slot) =>
      markInner.querySelector<SVGGElement>(
        `[data-preloader-wssc-slot="${slot}"]`,
      ),
    );

    if (wsscWraps.some((g) => !g)) {
      document.body.style.overflow = "";
      queueMicrotask(() => setVisible(false));
      return;
    }

    const paths = [...innerEl.querySelectorAll<SVGPathElement>(".preloader-path")];
    const mutedPaths = paths.filter((_, index) => !LOGO_COMPACT_PATH_SET.has(index));
    const wsscPaths = LOGO_COMPACT_PATH_ORDER.map((index) => paths[index]).filter(
      Boolean,
    ) as SVGPathElement[];

    const compactX = compactOffsetsForPaths(wsscPaths);

    setMutedHidden(mutedPaths);
    setWsscLetters(wsscPaths);
    gsap.set(wsscWraps, { x: (i) => compactX[i] ?? 0 });
    const shiftCenter = centerShiftForCompactCluster(wsscPaths, compactX);
    gsap.set(markInner, { x: shiftCenter });

    clipRects.forEach((rect) => {
      gsap.set(rect, { attr: { x: 0, y: 0, width: 0, height: 1 } });
    });

    contextRef.current?.revert();
    contextRef.current = null;
    timelineRef.current?.kill();

    gsap.set(svgEl, { transformOrigin: "50% 50%" });
    gsap.set(markInner, { transformOrigin: "50% 50%" });

    contextRef.current = gsap.context(() => {
      gsap.set(el, { opacity: 1, scale: 1, filter: "none" });
      gsap.set(innerEl, INTRO_INNER);
      gsap.set(svgEl, INTRO_SVG);

      const tl = gsap.timeline({
        onComplete: () => {
          if (cancelled) return;
          document.body.style.overflow = "";
          window.dispatchEvent(new Event(PAGE_PRELOADER_DONE_EVENT));
          queueMicrotask(() => setVisible(false));
        },
      });

      timelineRef.current = tl;

      tl.addLabel("intro", 0)
        .to(innerEl, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: "power3.out",
        })
        .to(
          svgEl,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.35,
            ease: "power3.out",
          },
          "intro+=0.12",
        );

      tl.addLabel("chars", "+=0.12");
      clipRects.forEach((rect, slot) => {
        tl.to(
          rect,
          {
            attr: { width: 1 },
            duration: 0.62,
            ease: "power3.inOut",
          },
          `chars+=${slot * 0.11}`,
        );
      });

      tl.addLabel("holdWssc").to({}, { duration: 0.62 });

      tl.addLabel("expand")
        .to(
          markInner,
          {
            x: 0,
            duration: 1.05,
            ease: "power3.inOut",
          },
          "expand",
        )
        .to(
          wsscWraps,
          {
            x: 0,
            duration: 1.05,
            ease: "power3.inOut",
          },
          "expand",
        )
        .to(
          mutedPaths,
          {
            opacity: 1,
            duration: 0.72,
            stagger: { each: 0.02, from: "center" },
            ease: "power2.out",
          },
          "expand+=0.14",
        );

      tl.addLabel("holdFull").to({}, { duration: 0.55 });

      /** Exit: clip-path collapses + each WSSC block translates down (no stroke pass). */
      const EXIT_STAGGER_S = 0.085;
      const EXIT_MOVE_S = 0.62;

      tl.addLabel("exit");

      for (let slot = 0; slot < 4; slot += 1) {
        const pos = `exit+=${slot * EXIT_STAGGER_S}`;
        tl.to(
          clipRects[slot]!,
          {
            attr: { y: 1, height: 0 },
            duration: EXIT_MOVE_S,
            ease: "power3.in",
          },
          pos,
        );
        tl.to(
          wsscWraps[slot]!,
          {
            y: EXIT_SLIDE_Y,
            duration: EXIT_MOVE_S,
            ease: "power3.in",
          },
          pos,
        );
      }

      tl.to(
        mutedPaths,
        {
          opacity: 0,
          y: EXIT_SLIDE_Y * 0.52,
          duration: 0.52,
          stagger: { each: 0.016, from: "center" },
          ease: "power3.in",
        },
        "exit+=0.1",
      );

      tl.set(paths, {
        visibility: "hidden",
      });

      tl.to({}, { duration: 0.2 });

      tl.to(el, {
        opacity: 0,
        duration: OVERLAY_FADE_DURATION_S,
        ease: "power2.inOut",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; clip ref tuple stable
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={root}
      data-page-preloader
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black"
      aria-busy="true"
      aria-label="Loading site"
    >
      <div
        ref={innerRef}
        className="relative z-10 flex w-[min(86vw,680px)] flex-col items-center justify-center px-6 py-12 opacity-0 [&_svg]:select-none"
      >
        <PreloaderLogoMark
          svgRef={svgRef}
          markInnerRef={markInnerRef}
          wsscClipRectRefs={wsscClipRectRefs}
        />
      </div>
    </div>
  );
}
