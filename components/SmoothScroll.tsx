"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      overscroll: false,
      smoothWheel: true,
      lerp: 0.09,
      wheelMultiplier: 0.9,
      syncTouch: true,
      syncTouchLerp: 0.08,
      allowNestedScroll: true,
    });

    lenis.scrollTo(0, { immediate: true, force: true });
    lenisRef.current = lenis;

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true, force: true });
    if (pathname === "/") {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [pathname]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const onScrollLock = (event: Event) => {
      const locked = (event as CustomEvent<{ locked: boolean }>).detail?.locked;
      if (locked) {
        lenis.stop();
        return;
      }
      if (pathname !== "/") lenis.start();
    };

    window.addEventListener("wssc-scroll-lock", onScrollLock);
    return () => window.removeEventListener("wssc-scroll-lock", onScrollLock);
  }, [pathname]);

  return null;
}
