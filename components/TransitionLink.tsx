"use client";

import NextLink from "next/link";
import { useCallback, type ComponentProps, type MouseEvent } from "react";
import { usePageTransition } from "@/components/page-transition-context";

type Props = ComponentProps<typeof NextLink>;

/**
 * Same as `next/link` for prefetch/SEO, but fades the current page out before navigating
 * so `PageTransition` can run in the correct order with App Router RSC children.
 * For non-string `href`, default navigation is used.
 */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const api = usePageTransition();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !api) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (typeof window === "undefined") return;
      if (typeof href !== "string") return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      if (e.currentTarget.getAttribute("target") === "_blank") return;

      const next = url.pathname + url.search + url.hash;
      const current =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      if (next === current) return;

      e.preventDefault();
      api.startNavigate(next);
    },
    [href, onClick, api],
  );

  return <NextLink href={href} onClick={handleClick} {...rest} />;
}
