"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { EVENTBRITE_TICKETS_URL, EXTERNAL_TICKETS_URL } from "@/lib/config";
import { useI18n } from "@/components/LanguageProvider";
import { NavTicketIcon, NAV_PILL_ICON_CLASS } from "@/components/MobileNavPillIcons";

type Props = {
  label?: string;
  variant?: "nav" | "hero" | "mobile" | "wide" | "island";
  pillAnchorRef?: RefObject<HTMLElement | null>;
};

const MOBILE_DROPDOWN_GAP_PX = 8;
const MOBILE_DROPDOWN_TRANSITION_MS = 300;

const ticketButtonBase =
  "rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-900";

const variantClass = {
  nav: `${ticketButtonBase} px-4 py-2`,
  hero: `w-full rounded-full border border-white ${ticketButtonBase} px-8 py-3 text-center sm:w-auto`,
  mobile: `w-full rounded-full border border-white ${ticketButtonBase} px-5 py-3 text-center`,
  wide: `w-full rounded-full border border-white ${ticketButtonBase} px-6 py-3`,
} as const;

const dropdownAlignClass = {
  nav: "right-0",
  hero: "left-0 right-0",
  mobile: "left-0 right-0",
  wide: "left-0 right-0",
} as const;

const dropdownPositionClass = {
  nav: "top-[calc(100%+0.5rem)]",
  hero: "bottom-[calc(100%+0.5rem)]",
  mobile: "bottom-[calc(100%+0.5rem)]",
  wide: "top-[calc(100%+0.5rem)]",
} as const;

const dropdownClosedMotionClass = {
  nav: "-translate-y-1",
  hero: "translate-y-1",
  mobile: "translate-y-1",
  wide: "-translate-y-1",
} as const;

const dropdownItemClass = {
  nav: "block rounded-xl px-4 py-3 text-right text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white",
  hero: "block rounded-xl px-4 py-3 text-center text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white sm:text-left",
  mobile:
    "block rounded-xl px-4 py-3 text-center text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white",
  wide: "block rounded-xl px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white",
} as const;

const navButtonClass =
  "relative z-10 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-white hover:text-black";

type MobileAnchor = {
  left: number;
  width: number;
  bottom: number;
};

export function TicketDropdown({ label, variant = "nav", pillAnchorRef }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [islandMenuMounted, setIslandMenuMounted] = useState(false);
  const [islandMenuVisible, setIslandMenuVisible] = useState(false);
  const [islandAnchor, setIslandAnchor] = useState<MobileAnchor | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const islandDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const closeWhenNavOpens = () => {
      if (root.classList.contains("mobile-menu-open")) {
        setOpen(false);
      }
    };

    const observer = new MutationObserver(closeWhenNavOpens);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (variant !== "island") return;

    if (!open) {
      setIslandMenuVisible(false);
      const timeout = window.setTimeout(
        () => setIslandMenuMounted(false),
        MOBILE_DROPDOWN_TRANSITION_MS,
      );
      return () => window.clearTimeout(timeout);
    }

    setIslandMenuMounted(true);
    const frame = requestAnimationFrame(() => setIslandMenuVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open, variant]);

  useLayoutEffect(() => {
    if (variant !== "island" || !islandMenuMounted) {
      setIslandAnchor(null);
      return;
    }

    const updateAnchor = () => {
      const anchorEl = pillAnchorRef?.current;
      if (!anchorEl) return;

      const rect = anchorEl.getBoundingClientRect();
      setIslandAnchor({
        left: rect.left,
        width: rect.width,
        bottom: window.innerHeight - rect.top + MOBILE_DROPDOWN_GAP_PX,
      });
    };

    updateAnchor();
    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor, true);

    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor, true);
    };
  }, [variant, islandMenuMounted, open, pillAnchorRef]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        islandDropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const rootLayoutClass =
    variant === "mobile"
      ? "block w-full"
      : variant === "island"
        ? "inline-flex shrink-0"
        : variant === "wide"
          ? "block w-full"
          : variant === "hero"
            ? "block w-full sm:inline-block"
            : "inline-block";

  const dropdownWidthClass =
    variant === "hero" || variant === "mobile"
      ? "w-full min-w-0 sm:min-w-48"
      : "min-w-48";

  const usesRing = variant === "nav";

  const triggerLabel = label ?? t.tickets.defaultLabel;
  const triggerButton =
    variant === "island" ? (
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpen((value) => !value)}
        className="mobile-nav-pill__btn cursor-pointer"
      >
        <NavTicketIcon className={`${NAV_PILL_ICON_CLASS} mobile-nav-pill__icon--square`} />
      </button>
    ) : (
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`${
          usesRing
            ? navButtonClass
            : variantClass[variant]
        } cursor-pointer`}
      >
        {triggerLabel}
      </button>
    );

  const ringWrapClassName = "hero-ring-wrap hero-ring-wrap--see-room shrink-0";

  const dropdownLinks = (itemVariant: keyof typeof dropdownItemClass) => (
    <>
      <Link
        href="/tickets"
        className={dropdownItemClass[itemVariant]}
        onClick={() => setOpen(false)}
      >
        {t.tickets.bookHere}
      </Link>
      <a
        href={EXTERNAL_TICKETS_URL}
        target="_blank"
        rel="noreferrer"
        className={dropdownItemClass[itemVariant]}
      >
        {t.tickets.meetup}
      </a>
      <a
        href={EVENTBRITE_TICKETS_URL}
        target="_blank"
        rel="noreferrer"
        className={dropdownItemClass[itemVariant]}
      >
        {t.tickets.eventbrite}
      </a>
    </>
  );

  return (
    <div ref={rootRef} className={`relative ${rootLayoutClass}`} data-ticket-dropdown>
      {usesRing ? (
        <div className={ringWrapClassName}>
          <span aria-hidden className="hero-ring-light" />
          {triggerButton}
        </div>
      ) : (
        triggerButton
      )}

      {variant !== "island" ? (
        <div
          className={`absolute z-20 ${dropdownPositionClass[variant]} ${dropdownWidthClass} overflow-hidden rounded-2xl border border-white/15 bg-black p-2 shadow-2xl shadow-black/70 backdrop-blur-md transition ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : `pointer-events-none opacity-0 ${dropdownClosedMotionClass[variant]}`
          } ${dropdownAlignClass[variant]}`}
        >
          {dropdownLinks(variant)}
        </div>
      ) : null}

      {variant === "island" && islandMenuMounted && portalReady && islandAnchor
        ? createPortal(
            <div
              ref={islandDropdownRef}
              style={{
                position: "fixed",
                left: islandAnchor.left,
                width: islandAnchor.width,
                bottom: islandAnchor.bottom,
              }}
              className={`z-[56] overflow-hidden rounded-2xl border border-white/15 bg-black p-2 shadow-2xl shadow-black/70 backdrop-blur-md transition-all duration-300 ease-out ${
                islandMenuVisible
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              {dropdownLinks("mobile")}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
