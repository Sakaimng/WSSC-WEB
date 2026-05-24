"use client";

import gsap from "gsap";
import { useI18n } from "@/components/LanguageProvider";
import { useLayoutEffect, useRef } from "react";

type Props = {
  open: boolean;
};

export function MobileMenuToggleLabel({ open }: Props) {
  const { t } = useI18n();
  const menuRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef(open);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const close = closeRef.current;
    if (!menu || !close) return;

    const showMenu = !open;
    const entering = showMenu ? menu : close;
    const exiting = showMenu ? close : menu;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      openRef.current = open;
      gsap.set(menu, {
        autoAlpha: showMenu ? 1 : 0,
        y: 0,
        pointerEvents: showMenu ? "auto" : "none",
      });
      gsap.set(close, {
        autoAlpha: showMenu ? 0 : 1,
        y: 0,
        pointerEvents: showMenu ? "none" : "auto",
      });
      return;
    }

    if (openRef.current === open) return;
    openRef.current = open;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(menu, {
        autoAlpha: showMenu ? 1 : 0,
        y: 0,
        pointerEvents: showMenu ? "auto" : "none",
      });
      gsap.set(close, {
        autoAlpha: showMenu ? 0 : 1,
        y: 0,
        pointerEvents: showMenu ? "none" : "auto",
      });
      return;
    }

    gsap.killTweensOf([menu, close]);

    gsap
      .timeline({ defaults: { ease: "power2.inOut" } })
      .to(
        exiting,
        { autoAlpha: 0, y: -7, duration: 0.14, ease: "power2.in" },
        0,
      )
      .fromTo(
        entering,
        { autoAlpha: 0, y: 7 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
          pointerEvents: "auto",
        },
        0.06,
      )
      .set(exiting, { pointerEvents: "none" }, 0);
  }, [open]);

  return (
    <span
      className="relative inline-block min-w-[2.85rem] overflow-hidden text-center leading-none"
      aria-hidden
    >
      <span
        ref={menuRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {t.nav.menu}
      </span>
      <span
        ref={closeRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {t.nav.menuClose}
      </span>
      <span className="invisible">{t.nav.menuClose}</span>
    </span>
  );
}
