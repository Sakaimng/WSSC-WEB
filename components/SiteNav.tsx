"use client";

import gsap from "gsap";
import {
  NavBurgerIcon,
  NAV_PILL_ICON_CLASS,
} from "@/components/MobileNavPillIcons";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { TicketDropdown } from "@/components/TicketDropdown";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/components/LanguageProvider";
import {
  COMEDIAN_SIGNUP_FORM_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
} from "@/lib/config";
import { getUpcomingShows, SHOW_TIME } from "@/lib/show-schedule";
import { formatShowDate } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const links = [
  { href: "/", labelKey: "home" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/about", labelKey: "about" },
] as const;

const menuLinks = links.filter(({ href }) => href !== "/");

const NAV_SITE_TITLE = "WHY SO SERIOUS COMEDY";

const brandTextClassName =
  "font-sans text-xs font-bold uppercase leading-none text-white";

function NavBrandMark({ variant = "header" }: { variant?: "header" | "pill" }) {
  const className =
    variant === "pill"
      ? "font-sans text-[0.5rem] font-bold uppercase leading-none text-white min-[400px]:text-[0.55rem] sm:text-[0.62rem]"
      : brandTextClassName;

  return (
    <span
      className={`${className} inline-block whitespace-nowrap ${
        variant === "pill" ? "max-w-full" : ""
      }`}
    >
      {NAV_SITE_TITLE}
    </span>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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
  const mobilePillRef = useRef<HTMLDivElement>(null);
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
      className="shrink-0 text-xs font-semibold text-white transition hover:text-white/80"
    >
      {scheduleLinkLabel}
    </Link>
  );

  const isHome = pathname === "/";

  return (
    <>
    <header className="site-nav-header fixed top-0 right-0 left-0 z-50 m-0 hidden w-full bg-black p-0 transition-colors duration-300 ease-out min-[1032px]:block">
      <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center px-[2vw]">
        <div className="hidden min-w-0 items-center justify-start gap-3 min-[1032px]:flex">
          {scheduleLink}
        </div>

        <div
          className="site-nav-brand relative col-span-3 flex shrink-0 justify-center min-[1032px]:col-span-1"
          aria-label={isHome ? "Why So Serious Comedy home" : undefined}
        >
          <NavBrandMark />
          {!isHome ? (
            <Link
              href="/"
              className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label="Why So Serious Comedy home"
            />
          ) : null}
        </div>
        <div className="hidden min-w-0 items-center justify-end gap-2 min-[1032px]:flex">
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
                  className="text-xs font-medium text-white transition hover:text-white/80"
                >
                  {t.nav[labelKey]}
                </Link>
              );
            })}
            <TicketDropdown />
          </nav>
        </div>
      </div>
    </header>

    <div
      className="fixed inset-x-0 z-50 px-[2vw] min-[1032px]:hidden"
      style={{ bottom: "var(--mobile-nav-pill-inset)" }}
    >
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-nav-sheet mx-auto w-full max-w-md max-h-[min(70dvh,calc(100dvh-var(--mobile-nav-pill-inset)-0.5rem))] overflow-x-hidden overflow-y-auto rounded-2xl border border-white/10 bg-black/95 shadow-[0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-md ${
          menuOpen ? "overflow-y-auto" : "overflow-hidden"
        } ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-label={t.nav.mobileMainLabel}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-1 px-4 pt-6 pb-4">
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
        <p className="mobile-menu-item pt-4 text-center text-xs text-neutral-500">
          {t.footer.copyright}
        </p>
        </div>
      </nav>
    </div>

    <div className="mobile-nav-pill pointer-events-none fixed inset-x-0 z-[55] px-[2vw] min-[1032px]:hidden">
      <div
        ref={mobilePillRef}
        className="pointer-events-auto mx-auto grid w-full max-w-md grid-cols-[auto_1fr_auto] items-center rounded-full border border-white/15 bg-black/85 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
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
          className="mobile-nav-pill__brand justify-self-center"
        >
          <NavBrandMark variant="pill" />
        </Link>
        <div className="justify-self-end">
          <TicketDropdown variant="island" pillAnchorRef={mobilePillRef} />
        </div>
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
