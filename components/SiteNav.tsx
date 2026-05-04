"use client";

import gsap from "gsap";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { EXTERNAL_TICKETS_URL } from "@/lib/config";
import {
  PRELOADER_LOGO_PATHS,
  PRELOADER_VIEW_H,
  PRELOADER_VIEW_W,
} from "@/lib/preloader-logo-paths";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
] as const;

const NAV_INITIAL_PATHS = new Set([17, 14, 12, 5]);
const NAV_INITIAL_PATH_ORDER = [17, 14, 12, 5] as const;
const NAV_COMPACT_VIEW_W = 550;
const NAV_COMPACT_TARGET_X = [0, 180, 305, 435] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLogoWidthForViewBox(shell: HTMLElement, viewBoxWidth: number) {
  return (shell.getBoundingClientRect().height * viewBoxWidth) / PRELOADER_VIEW_H;
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const hasAnimatedMenuRef = useRef(false);
  const logoShellRef = useRef<HTMLSpanElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const hasAnimatedLogoRef = useRef(false);
  const logoViewBoxWidthRef = useRef(PRELOADER_VIEW_W);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const shell = logoShellRef.current;
    const svg = logoSvgRef.current;
    if (!shell || !svg) return;

    const compact = pathname !== "/";
    const targetViewBoxWidth = compact ? NAV_COMPACT_VIEW_W : PRELOADER_VIEW_W;
    const paths = gsap.utils.toArray<SVGPathElement>(".nav-logo-path", svg);
    const mutedPaths = paths.filter((_, index) => !NAV_INITIAL_PATHS.has(index));
    const initialPaths = NAV_INITIAL_PATH_ORDER.map((index) => paths[index]).filter(Boolean);
    const compactX = initialPaths.map((path, index) => {
      const box = path.getBBox();
      return NAV_COMPACT_TARGET_X[index] - box.x;
    });

    gsap.killTweensOf([shell, svg, ...paths]);

    if (!hasAnimatedLogoRef.current) {
      hasAnimatedLogoRef.current = true;
      logoViewBoxWidthRef.current = targetViewBoxWidth;
      gsap.set(shell, {
        width: navLogoWidthForViewBox(shell, targetViewBoxWidth),
      });
      svg.setAttribute(
        "viewBox",
        `0 0 ${targetViewBoxWidth} ${PRELOADER_VIEW_H}`,
      );
      gsap.set(paths, { autoAlpha: 1, x: 0 });
      if (compact) {
        gsap.set(mutedPaths, { autoAlpha: 0 });
        initialPaths.forEach((path, index) => {
          gsap.set(path, { x: compactX[index] });
        });
      }
      return;
    }

    const viewBoxState = { width: logoViewBoxWidthRef.current };

    gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .to(
        viewBoxState,
        {
          width: targetViewBoxWidth,
          duration: 0.5,
          onUpdate: () => {
            logoViewBoxWidthRef.current = viewBoxState.width;
            svg.setAttribute(
              "viewBox",
              `0 0 ${viewBoxState.width} ${PRELOADER_VIEW_H}`,
            );
            gsap.set(shell, {
              width: navLogoWidthForViewBox(shell, viewBoxState.width),
            });
          },
        },
        0,
      )
      .to(
        mutedPaths,
        {
          autoAlpha: compact ? 0 : 1,
          duration: 0.28,
          ease: "power2.out",
        },
        compact ? 0 : 0.16,
      )
      .to(
        initialPaths,
        {
          x: (index) => (compact ? compactX[index] : 0),
          duration: 0.5,
        },
        0,
      );
  }, [pathname]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const items = gsap.utils.toArray<HTMLElement>(".mobile-menu-item", menu);

    if (!hasAnimatedMenuRef.current) {
      hasAnimatedMenuRef.current = true;
      gsap.set(menu, { height: 0, autoAlpha: 0 });
      gsap.set(items, { autoAlpha: 0, y: -8 });
      return;
    }

    gsap.killTweensOf([menu, ...items]);

    if (menuOpen) {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(menu, { height: "auto", autoAlpha: 1, duration: 0.38 })
        .to(
          items,
          { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.045 },
          "-=0.18",
        );
      return;
    }

    gsap
      .timeline({ defaults: { ease: "power2.inOut" } })
      .to(items, { autoAlpha: 0, y: -6, duration: 0.16, stagger: 0.02 })
      .to(menu, { height: 0, autoAlpha: 0, duration: 0.28 }, "-=0.08");
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 m-0 w-full border-b border-white/10 bg-black/90 p-0 backdrop-blur-md">
      <div className="box-border flex h-16 w-full max-w-none items-center justify-between gap-4 px-[2vw] sm:h-20">
        <Link
          href="/"
          className="block shrink-0 opacity-95 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="Why So Serious Comedy home"
        >
          <span
            ref={logoShellRef}
            className="relative block h-[14px] overflow-hidden sm:h-[18px]"
          >
            <svg
              ref={logoSvgRef}
              viewBox={`0 0 ${PRELOADER_VIEW_W} ${PRELOADER_VIEW_H}`}
              xmlns="http://www.w3.org/2000/svg"
              className="block h-full w-auto overflow-visible"
              preserveAspectRatio="xMinYMid meet"
              aria-hidden="true"
            >
              {PRELOADER_LOGO_PATHS.map((d, index) => (
                <path
                  key={index}
                  d={d}
                  className="nav-logo-path"
                  fill="currentColor"
                />
              ))}
            </svg>
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-3 rounded-full border border-white/20 px-4 text-xs font-semibold uppercase text-white transition hover:border-white md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
          <span className="flex h-3.5 w-4 flex-col justify-between" aria-hidden="true">
            <span
              className={`h-px w-full bg-white transition ${
                menuOpen ? "translate-y-[6.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-white transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-white transition ${
                menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
        <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 md:flex md:gap-x-8" aria-label="Main">
          {links.map(({ href, label }) => {
            const active = isActiveRoute(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition sm:text-[0.95rem] ${
                  active
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href={EXTERNAL_TICKETS_URL}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Tickets
          </Link>
        </nav>
      </div>
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/10 bg-black px-[2vw] md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-label="Mobile main"
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-1 py-5">
          {links.map(({ href, label }) => {
            const active = isActiveRoute(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`mobile-menu-item block rounded-lg px-3 py-3 text-base font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href={EXTERNAL_TICKETS_URL}
            className="mobile-menu-item mt-3 block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Tickets
          </Link>
        </div>
      </nav>
    </header>
  );
}
