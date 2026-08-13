"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";
import { PAGE_PRELOADER_DONE_EVENT } from "@/components/PagePreloader";
import { TransitionLink as Link } from "@/components/TransitionLink";
import capFront from "../E-C/WhatsApp Image 2026-08-12 at 18.45.02 (1).jpeg";

const REVEAL_DELAY_MS = 450;
const EXIT_DURATION_MS = 300;

export function MerchLaunchPopup() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const close = useCallback(() => {
    setVisible(false);
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setMounted(false);
      hideTimerRef.current = null;
    }, EXIT_DURATION_MS);
  }, []);

  useEffect(() => {
    let active = true;
    let queued = false;
    let revealTimer: number | null = null;
    let fallbackTimer: number | null = null;

    const queueReveal = () => {
      if (queued) return;
      queued = true;

      revealTimer = window.setTimeout(() => {
        if (!active) return;
        setMounted(true);
        window.requestAnimationFrame(() => {
          if (active) setVisible(true);
        });
      }, REVEAL_DELAY_MS);
    };

    const preloader = document.querySelector("[data-page-preloader]");
    if (preloader) {
      window.addEventListener(PAGE_PRELOADER_DONE_EVENT, queueReveal, {
        once: true,
      });
      fallbackTimer = window.setTimeout(queueReveal, 8000);
    } else {
      queueReveal();
    }

    return () => {
      active = false;
      window.removeEventListener(PAGE_PRELOADER_DONE_EVENT, queueReveal);
      if (revealTimer !== null) window.clearTimeout(revealTimer);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[180] flex items-center justify-center px-[4vw] py-4 transition-opacity duration-300 sm:py-8 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={t.merch.popupClose}
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="merch-popup-title"
        data-lenis-prevent
        data-lenis-prevent-touch
        data-lenis-prevent-wheel
        className={`relative z-10 grid max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.7)] transition duration-500 ease-out sm:max-h-[calc(100dvh-4rem)] sm:grid-cols-[0.9fr_1.1fr] ${
          visible ? "translate-y-0 scale-100" : "translate-y-6 scale-[0.97]"
        }`}
      >
        <button
          type="button"
          aria-label={t.merch.popupClose}
          onClick={close}
          className="absolute top-2 right-2 z-20 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center bg-transparent px-2 text-xs font-semibold text-white mix-blend-difference transition-opacity hover:opacity-60 sm:top-4 sm:right-4"
        >
          CLOSE
        </button>

        <div className="relative aspect-[4/3] bg-[#f4f4f4] sm:aspect-[4/5]">
          <Image
            src={capFront}
            alt={t.merch.imageAlt}
            fill
            placeholder="blur"
            quality={90}
            sizes="(max-width: 639px) 92vw, 320px"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold text-neutral-500">
            {t.merch.popupEyebrow}
          </p>
          <h2
            id="merch-popup-title"
            className="mt-3 font-sans text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-none text-white normal-case"
          >
            <span className="block">{t.merch.popupTitle}</span>
            <span className="mt-2 block">{t.merch.popupPrice}</span>
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-400 normal-case">
            {t.merch.popupBody}
          </p>
          <Link
            href="/merch"
            onClick={close}
            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-neutral-200 sm:w-auto"
          >
            {t.merch.popupCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
