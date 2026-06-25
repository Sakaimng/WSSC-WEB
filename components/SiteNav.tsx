"use client";

import gsap from "gsap";
import {
  NavBurgerIcon,
  NavFaviconW,
  NavTicketIcon,
  NAV_PILL_ICON_CLASS,
} from "@/components/MobileNavPillIcons";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { TicketDropdown } from "@/components/TicketDropdown";
import { useI18n } from "@/components/LanguageProvider";
import {
  COMEDIAN_SIGNUP_FORM_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
} from "@/lib/config";
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

const menuLinks = links.filter(({ href }) => href !== "/");

const NAV_SITE_TITLE = "WHY SO SERIOUS COMEDY";
const NAV_SITE_SHORT = "WSSC";

const brandTextClassName =
  "font-sans text-xs font-semibold uppercase leading-none text-white";

function NavBrandMark({ compact }: { compact: boolean }) {
  const brandShellRef = useRef<HTMLSpanElement>(null);
  const brandFullRef = useRef<HTMLSpanElement>(null);
  const brandCompactRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedBrandRef = useRef(false);
  const brandWidthRef = useRef(0);

  useLayoutEffect(() => {
    const shell = brandShellRef.current;
    const full = brandFullRef.current;
    const compactEl = brandCompactRef.current;
    if (!shell || !full || !compactEl) return;

    const targetWidth = compact ? compactEl.offsetWidth : full.offsetWidth;

    gsap.killTweensOf([shell, full, compactEl]);

    if (!hasAnimatedBrandRef.current) {
      hasAnimatedBrandRef.current = true;
      brandWidthRef.current = targetWidth;
      gsap.set(shell, { width: targetWidth });
      gsap.set(full, { autoAlpha: compact ? 0 : 1, x: 0 });
      gsap.set(compactEl, { autoAlpha: compact ? 1 : 0, x: 0 });
      return;
    }

    const widthState = { width: brandWidthRef.current };

    gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .to(
        widthState,
        {
          width: targetWidth,
          duration: 0.5,
          onUpdate: () => {
            brandWidthRef.current = widthState.width;
            gsap.set(shell, { width: widthState.width });
          },
        },
        0,
      )
      .to(
        full,
        {
          autoAlpha: compact ? 0 : 1,
          duration: 0.28,
          ease: "power2.out",
        },
        compact ? 0 : 0.16,
      )
      .to(
        compactEl,
        {
          autoAlpha: compact ? 1 : 0,
          duration: 0.28,
          ease: "power2.out",
        },
        compact ? 0 : 0.16,
      );
  }, [compact]);

  return (
    <span
      ref={brandShellRef}
      className="relative inline-block overflow-hidden align-top"
    >
      <span
        ref={brandFullRef}
        className={`${brandTextClassName} inline-block whitespace-nowrap`}
      >
        {NAV_SITE_TITLE}
      </span>
      <span
        ref={brandCompactRef}
        className={`${brandTextClassName} absolute top-0 left-0 inline-block whitespace-nowrap`}
      >
        {NAV_SITE_SHORT}
      </span>
    </span>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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
    const menu = menuRef.current;
    if (!menu) return;

    const items = gsap.utils.toArray<HTMLElement>(".mobile-menu-item", menu);

    if (!hasAnimatedMenuRef.current) {
      hasAnimatedMenuRef.current = true;
      gsap.set(menu, { height: 0, autoAlpha: 0, y: 12 });
      gsap.set(items, { autoAlpha: 0, y: 10 });
      return;
    }

    gsap.killTweensOf([menu, ...items]);

    if (menuOpen) {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(menu, { height: "auto", autoAlpha: 1, y: 0, duration: 0.38 })
        .to(
          items,
          { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.045 },
          "-=0.18",
        );
      return;
    }

    gsap
      .timeline({ defaults: { ease: "power2.inOut" } })
      .to(items, { autoAlpha: 0, y: 8, duration: 0.16, stagger: 0.02 })
      .to(menu, { height: 0, autoAlpha: 0, y: 12, duration: 0.28 }, "-=0.08");
  }, [menuOpen]);

  const scheduleLinkLabel = `${t.nav.next}: ${nextShowDate} · ${SHOW_TIME}`;
  const scheduleLink = nextShow && nextShowDate && (
    <Link
      href="/schedule"
      className="shrink-0 text-xs font-semibold text-white transition hover:text-white"
    >
      {scheduleLinkLabel}
    </Link>
  );

  const isHome = pathname === "/";
  const brandPositionClassName =
    "mobile-nav-brand left-1/2 block shrink-0 -translate-x-1/2 max-[1031px]:fixed max-[1031px]:z-[60] min-[1032px]:absolute min-[1032px]:top-1/2 min-[1032px]:z-auto min-[1032px]:-translate-y-1/2";

  return (
    <>
    <header
      className="fixed top-0 right-0 left-0 z-50 m-0 h-16 w-full bg-transparent p-0 transition-colors duration-300 ease-out sm:h-20"
    >
      <div className="relative h-full w-full">
      <div className="relative box-border flex h-full w-full max-w-none items-center px-[2vw] min-[1032px]:justify-normal">
        <div className="hidden min-w-0 flex-1 items-center justify-start gap-3 min-[1032px]:flex">
          <LanguageToggle className="shrink-0" />
          {scheduleLink}
        </div>

        <div
          className={brandPositionClassName}
          aria-label={isHome ? "Why So Serious Comedy home" : undefined}
        >
          <NavBrandMark compact={!isHome} />
          {!isHome ? (
            <Link
              href="/"
              className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label="Why So Serious Comedy home"
            />
          ) : null}
        </div>
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 min-[1032px]:flex">
          <nav
            className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 min-[1032px]:gap-x-4"
            aria-label={t.nav.mainLabel}
          >
            {links.map(({ href, labelKey }) => {
              const active = isActiveRoute(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="text-xs font-medium text-white transition hover:text-white"
                >
                  {t.nav[labelKey]}
                </Link>
              );
            })}
            <TicketDropdown />
          </nav>
        </div>
      </div>
      </div>
    </header>

    <nav
      ref={menuRef}
      id="mobile-menu"
      className={`mobile-nav-sheet fixed inset-x-[2vw] z-50 max-h-[min(70dvh,calc(100dvh-var(--mobile-nav-pill-inset)-var(--mobile-nav-brand-top)-3rem))] overflow-x-hidden overflow-y-auto rounded-2xl border border-white/10 bg-black/95 shadow-[0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-md min-[1032px]:hidden ${
        menuOpen ? "overflow-y-auto" : "overflow-hidden"
      } ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ bottom: "var(--mobile-nav-pill-inset)" }}
      aria-label={t.nav.mobileMainLabel}
      aria-hidden={!menuOpen}
    >
      <div className="flex flex-col gap-1 p-4">
        <Link
          href="/gallery"
          className="mobile-menu-item block rounded-full bg-white px-3 py-3 text-center text-base font-semibold text-black transition hover:bg-neutral-200"
        >
          {t.home.seeRoom}
        </Link>
        {menuLinks.map(({ href, labelKey }) => {
          const active = isActiveRoute(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="mobile-menu-item block rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-white"
            >
              {t.nav[labelKey]}
            </Link>
          );
        })}
        {nextShow && nextShowDate ? (
          <Link
            href="/schedule"
            className="mobile-menu-item block rounded-lg px-3 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
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
        <div className="mobile-menu-item mt-1 flex flex-col gap-1 border-t border-white/10 pt-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-white"
          >
            {t.footer.instagram}
          </a>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-white"
          >
            {t.footer.googleMaps}
          </a>
          <a
            href={COMEDIAN_SIGNUP_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
          >
            {t.footer.comedianSignup}
          </a>
        </div>
      </div>
    </nav>

    <div className="mobile-nav-pill pointer-events-none fixed inset-x-0 z-[55] px-[2vw] min-[1032px]:hidden">
      <div
        className="pointer-events-auto mx-auto grid w-full max-w-md grid-cols-3 items-center rounded-full border border-white/15 bg-black/85 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
      >
        <button
          type="button"
          className="mobile-nav-pill__btn justify-self-start"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <NavBurgerIcon
            open={menuOpen}
            className={`${NAV_PILL_ICON_CLASS} mobile-nav-pill__icon--square`}
          />
        </button>
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          aria-label={t.nav.home}
          className="mobile-nav-pill__btn justify-self-center"
        >
          <NavFaviconW className={NAV_PILL_ICON_CLASS} />
        </Link>
        <Link
          href="/tickets"
          aria-label={t.tickets.defaultLabel}
          className="mobile-nav-pill__btn justify-self-end"
        >
          <NavTicketIcon className={`${NAV_PILL_ICON_CLASS} mobile-nav-pill__icon--square`} />
        </Link>
      </div>
    </div>

    <button
      type="button"
      aria-label="Close mobile menu"
      onClick={() => setMenuOpen(false)}
      className={`mobile-nav-backdrop bg-black/45 backdrop-blur-3xl transition duration-300 min-[1032px]:hidden ${
        menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
    </>
  );
}
