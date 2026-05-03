"use client";

import { useId, type RefObject } from "react";
import {
  PRELOADER_LOGO_PATHS,
  PRELOADER_VIEW_H,
  PRELOADER_VIEW_W,
} from "@/lib/preloader-logo-paths";

type Props = {
  svgRef: RefObject<SVGSVGElement | null>;
  clipRectRef: RefObject<SVGRectElement | null>;
};

export function PreloaderLogoMark({ svgRef, clipRectRef }: Props) {
  const uid = useId().replace(/:/g, "");
  const clipId = `wssc-pre-clip-${uid}`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PRELOADER_VIEW_W} ${PRELOADER_VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="h-[clamp(1.85rem,7vh,3.5rem)] w-auto max-w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            ref={clipRectRef}
            x={0}
            y={0}
            width={0}
            height={PRELOADER_VIEW_H}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {PRELOADER_LOGO_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            className="preloader-path"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
