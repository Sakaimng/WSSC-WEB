"use client";

import gsap from "gsap";
import { MobileMenuToggleLabel } from "@/components/MobileMenuToggleLabel";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { TicketDropdown } from "@/components/TicketDropdown";
import { useI18n } from "@/components/LanguageProvider";
import { COMEDIAN_SIGNUP_FORM_URL } from "@/lib/config";
import {
  LOGO_COMPACT_PATH_ORDER,
  LOGO_COMPACT_PATH_SET,
  LOGO_COMPACT_TARGET_X,
  LOGO_COMPACT_VIEW_W,
  PRELOADER_LOGO_PATHS,
  PRELOADER_VIEW_H,
  PRELOADER_VIEW_W,
} from "@/lib/preloader-logo-paths";
import { getUpcomingShows, SHOW_TIME } from "@/lib/show-schedule";
import { formatShowDate, languages, type Language } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const links = [
  { href: "/", labelKey: "home" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/map", labelKey: "map" },
  { href: "/about", labelKey: "about" },
] as const;

const NAV_INITIAL_PATHS = LOGO_COMPACT_PATH_SET;
const NAV_INITIAL_PATH_ORDER = LOGO_COMPACT_PATH_ORDER;
const NAV_COMPACT_VIEW_W = LOGO_COMPACT_VIEW_W;
const NAV_COMPACT_TARGET_X = LOGO_COMPACT_TARGET_X;
function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLogoWidthForViewBox(shell: HTMLElement, viewBoxWidth: number) {
  return (shell.getBoundingClientRect().height * viewBoxWidth) / PRELOADER_VIEW_H;
}

function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      className={`backdrop-blur-md relative inline-flex min-w-[5.5rem] rounded-full border border-white/15 bg-white/[0.03] p-1 ${className}`}
      aria-label={t.nav.toggleLabel}
    >
      <span
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: language === "jp" ? "translateX(100%)" : "translateX(0)",
        }}
        aria-hidden
      />
      {languages.map((option) => {
        const active = language === option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={t.nav.languageNames[option]}
            onClick={() => setLanguage(option as Language)}
            className={`relative z-10 flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
              active ? "text-black" : "text-neutral-400 hover:text-white"
            }`}
          >
            {option === "jp" ? "JP" : "EN"}
          </button>
        );
      })}
    </div>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const { language, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const nextShow = useMemo(() => getUpcomingShows(undefined, 1)[0], []);
  const nextShowDate = nextShow
    ? formatShowDate(new Date(nextShow.year, nextShow.month, nextShow.day), language)
    : null;
  const menuRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(pathname);
  const hasAnimatedMenuRef = useRef(false);
  const logoShellRef = useRef<HTMLSpanElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const hasAnimatedLogoRef = useRef(false);
  const logoViewBoxWidthRef = useRef(PRELOADER_VIEW_W);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    const timeout = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("mobile-menu-open", menuOpen);
    return () => document.documentElement.classList.remove("mobile-menu-open");
  }, [menuOpen]);

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

  const scheduleLinkLabel = `${t.nav.next}: ${nextShowDate} · ${SHOW_TIME}`;
  const scheduleLink = nextShow && nextShowDate && (
    <Link
      href="/schedule"
      className="shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-neutral-300 backdrop-blur-md transition hover:border-white/35 hover:text-white"
    >
      {scheduleLinkLabel}
    </Link>
  );

  const isHome = pathname === "/";

  const logoMark = (
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
  );

  return (
    <>
    <header
      className={`fixed top-0 right-0 left-0 z-50 m-0 h-16 w-full bg-transparent p-0 transition-colors duration-300 ease-out sm:h-20 ${
        menuOpen ? "max-[1031px]:bg-black" : ""
      }`}
    >
      <div className="relative h-full w-full">
      <div className="relative box-border flex h-full w-full max-w-none items-center justify-between px-[2vw] min-[1032px]:justify-normal">
        <div className="hidden min-w-0 flex-1 items-center justify-start gap-3 min-[1032px]:flex">
          <LanguageToggle className="shrink-0" />
          {scheduleLink}
        </div>

        {isHome ? (
          <span
            className="block shrink-0 opacity-95 min-[1032px]:absolute min-[1032px]:top-1/2 min-[1032px]:left-1/2 min-[1032px]:-translate-x-1/2 min-[1032px]:-translate-y-1/2"
            role="img"
            aria-label="Why So Serious Comedy home"
          >
            {logoMark}
          </span>
        ) : (
          <Link
            href="/"
            className="block shrink-0 opacity-95 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white min-[1032px]:absolute min-[1032px]:top-1/2 min-[1032px]:left-1/2 min-[1032px]:-translate-x-1/2 min-[1032px]:-translate-y-1/2"
            aria-label="Why So Serious Comedy home"
          >
            {logoMark}
          </Link>
        )}
        <div className="flex items-center justify-end gap-2 min-[1032px]:flex-1">
          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center overflow-hidden px-1 py-2 text-xs font-semibold text-white transition hover:text-neutral-300 min-[1032px]:hidden"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.nav.menuClose : t.nav.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MobileMenuToggleLabel open={menuOpen} />
          </button>
          <nav
            className="hidden min-[1032px]:flex flex-wrap items-center justify-end gap-x-4 gap-y-2 min-[1032px]:gap-x-8"
            aria-label={t.nav.mainLabel}
          >
            {links.map(({ href, labelKey }) => {
              const active = isActiveRoute(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-xs font-medium transition ${
                    active
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.nav[labelKey]}
                </Link>
              );
            })}
            <TicketDropdown />
          </nav>
        </div>
      </div>
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={`absolute top-full right-0 left-0 z-[45] max-h-[min(85dvh,calc(100dvh-4rem))] overflow-x-hidden overflow-y-auto bg-black/95 px-[2vw] shadow-[0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-md sm:max-h-[min(85dvh,calc(100dvh-5rem))] min-[1032px]:hidden ${
          menuOpen ? "overflow-y-auto" : "overflow-hidden"
        } ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-label={t.nav.mobileMainLabel}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-1 py-5">
          {links.map(({ href, labelKey }) => {
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
                {t.nav[labelKey]}
              </Link>
            );
          })}
          {nextShow && nextShowDate ? (
            <Link
              href="/schedule"
              className="mobile-menu-item block rounded-lg border border-white/10 px-3 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              <span className="block text-xs text-neutral-500">
                {t.nav.nextShow}
              </span>
              <span className="mt-1 block text-white">
                {nextShowDate} · {SHOW_TIME}
              </span>
            </Link>
          ) : null}
          <div className="mobile-menu-item py-2">
            <LanguageToggle />
          </div>
          <TicketDropdown variant="mobile" />
          <a
            href={COMEDIAN_SIGNUP_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="mobile-menu-item mt-1 block rounded-lg px-3 py-3 text-base font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            {t.footer.comedianSignup}
          </a>
        </div>
      </nav>
      </div>
    </header>
    <button
      type="button"
      aria-label="Close mobile menu"
      onClick={() => setMenuOpen(false)}
      className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-black/45 backdrop-blur-3xl transition duration-300 sm:top-20 min-[1032px]:hidden ${
        menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
    </>
  );
}
