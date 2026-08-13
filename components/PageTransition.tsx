"use client";

import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { ReactNode } from "react";
import {
  PageTransitionContext,
} from "@/components/page-transition-context";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

const FADE_OUT = { duration: 0.28, ease: "power2.in" as const };
const FADE_IN = { duration: 0.4, ease: "power2.out" as const };

type Props = {
  children: ReactNode;
};

/**
 * Provider wraps nav + main so `TransitionLink` in the nav receives `startNavigate`.
 * Only the main column fades; the nav stays visually fixed.
 */
export function PageTransition({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const expectFadeInRef = useRef(false);
  const navGenRef = useRef(0);
  const prevPathnameRef = useRef<string | null>(null);

  const startNavigate = useCallback(
    (href: string) => {
      const el = wrapRef.current;
      if (!el) {
        router.push(href);
        return;
      }

      navGenRef.current += 1;
      const gen = navGenRef.current;
      expectFadeInRef.current = true;

      gsap.killTweensOf(el);

      gsap.to(el, {
        autoAlpha: 0,
        ...FADE_OUT,
        onComplete: () => {
          if (gen !== navGenRef.current) return;
          router.push(href);
        },
      });
    },
    [router],
  );

  const api = useMemo(
    () => ({
      startNavigate,
    }),
    [startNavigate],
  );

  useEffect(() => {
    if (pathname !== "/") return;
    document.documentElement.classList.add("home-lock-scroll");
    document.body.classList.add("home-lock-scroll");
    return () => {
      document.documentElement.classList.remove("home-lock-scroll");
      document.body.classList.remove("home-lock-scroll");
    };
  }, [pathname]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (pathname === "/map") {
      gsap.set(el, { autoAlpha: 1, visibility: "visible" });
    }

    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    if (prevPathnameRef.current === pathname) return;

    prevPathnameRef.current = pathname;

    gsap.killTweensOf(el);

    if (expectFadeInRef.current) {
      expectFadeInRef.current = false;
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ...FADE_IN });
    } else {
      gsap.set(el, { autoAlpha: 1 });
    }
  }, [pathname]);

  const isGallery =
    pathname === "/gallery" || pathname.startsWith("/gallery/");
  const isMerch = pathname === "/merch" || pathname.startsWith("/merch/");
  const isLongPage = isGallery || isMerch;
  const isMap = pathname === "/map";

  return (
    <PageTransitionContext.Provider value={api}>
      <SiteNav />
      <main
        className={`box-border flex flex-1 flex-col ${
          pathname === "/"
            ? "min-h-0 overflow-hidden bg-transparent pt-0 pb-0"
            : isMerch
              ? "min-h-[100dvh] h-auto overflow-x-clip overflow-y-visible bg-white pt-0 pb-0 min-[1032px]:pt-[var(--mobile-nav-header-height)]"
            : isGallery
              ? "min-h-[100dvh] h-auto overflow-x-clip overflow-y-visible bg-black pt-0 pb-0 min-[1032px]:pt-[var(--mobile-nav-header-height)] min-[1032px]:pb-12"
              : isMap
                ? "box-border h-[100dvh] max-h-[100dvh] overflow-hidden bg-black pt-0 min-[1032px]:pt-[var(--mobile-nav-header-height)] pb-0"
                : "min-h-[100dvh] h-auto overflow-x-clip overflow-y-visible bg-black pt-0 pb-[var(--mobile-nav-pill-inset)] min-[1032px]:h-[100dvh] min-[1032px]:max-h-[100dvh] min-[1032px]:overflow-hidden min-[1032px]:pt-[var(--mobile-nav-header-height)] min-[1032px]:pb-12"
        }`}
      >
        <div
          ref={wrapRef}
          className={`flex min-h-0 flex-1 flex-col ${
            pathname === "/"
              ? "h-[100dvh] min-h-0 overflow-hidden"
              : isMap
                ? "h-full min-h-0 flex-1 overflow-hidden"
                : isLongPage
                  ? "h-auto overflow-visible"
                  : "h-auto overflow-visible sm:h-full sm:overflow-hidden"
          }`}
        >
          {children}
        </div>
      </main>
      {!isMap ? <SiteFooter /> : null}
    </PageTransitionContext.Provider>
  );
}
