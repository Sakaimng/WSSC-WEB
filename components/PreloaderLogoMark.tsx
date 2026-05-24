"use client";

import { useId, type RefObject } from "react";
import {
  LOGO_COMPACT_PATH_ORDER,
  PRELOADER_LOGO_PATHS,
  PRELOADER_VIEW_H,
  PRELOADER_VIEW_W,
} from "@/lib/preloader-logo-paths";

const COMPACT_INDEX_TO_SLOT = new Map(
  (LOGO_COMPACT_PATH_ORDER as readonly number[]).map((pathIndex, slot) => [
    pathIndex,
    slot,
  ]),
);

export type WsscClipRectRefs = readonly [
  RefObject<SVGRectElement | null>,
  RefObject<SVGRectElement | null>,
  RefObject<SVGRectElement | null>,
  RefObject<SVGRectElement | null>,
];

type Props = {
  svgRef: RefObject<SVGSVGElement | null>;
  markInnerRef: RefObject<SVGGElement | null>;
  wsscClipRectRefs: WsscClipRectRefs;
};

export function PreloaderLogoMark({
  svgRef,
  markInnerRef,
  wsscClipRectRefs,
}: Props) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PRELOADER_VIEW_W} ${PRELOADER_VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="h-[clamp(0.77rem,3.65dvh,1.52rem)] w-auto max-w-full overflow-visible"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        {[0, 1, 2, 3].map((slot) => (
          <clipPath
            key={slot}
            id={`${uid}-wssc-ch-${slot}`}
            clipPathUnits="objectBoundingBox"
          >
            <rect
              ref={wsscClipRectRefs[slot]}
              x={0}
              y={0}
              width={0}
              height={1}
            />
          </clipPath>
        ))}
      </defs>
      <g ref={markInnerRef} className="preloader-mark-inner">
        {PRELOADER_LOGO_PATHS.map((d, i) => {
          const slot = COMPACT_INDEX_TO_SLOT.get(i);
          if (slot !== undefined) {
            return (
              <g
                key={i}
                data-preloader-wssc-slot={slot}
                clipPath={`url(#${uid}-wssc-ch-${slot})`}
              >
                <path
                  d={d}
                  fill="#F1F1F1"
                  fillOpacity={1}
                  className="preloader-path"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          }
          return (
            <path
              key={i}
              d={d}
              fill="#F1F1F1"
              fillOpacity={1}
              opacity={0}
              className="preloader-path preloader-path-muted"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
}
