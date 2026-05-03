"use client";

import gsap from "gsap";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { WsscLogo } from "@/components/WsscLogo";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/roster", label: "Roster" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const hasAnimatedMenuRef = useRef(false);

  useEffect(() => {
    setMenuOpen(false);
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
          <WsscLogo className="h-7 w-auto max-w-[min(52vw,260px)] object-left object-contain sm:h-9 sm:max-w-[min(56vw,320px)]" priority />
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
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-neutral-400 transition hover:text-white sm:text-[0.95rem]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/tickets"
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
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="mobile-menu-item block rounded-lg px-3 py-3 text-base font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/tickets"
            className="mobile-menu-item mt-3 block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Tickets
          </Link>
        </div>
      </nav>
    </header>
  );
}
