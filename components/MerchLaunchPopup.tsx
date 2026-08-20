"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LanguageProvider";
import { PAGE_PRELOADER_DONE_EVENT } from "@/components/PagePreloader";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { TOUR_PRESS_URL } from "@/lib/config";
import capFront from "../E-C/L1071508-Edit.jpg";
import founderPortrait from "../public/PROFILE/Founder Portrait.jpg";

const REVEAL_DELAY_MS = 450;
const EXIT_DURATION_MS = 300;
const LOOP_INTERVAL_MS = 2800;
const SESSION_KEY = "wssc-home-popup-seen";

const SLIDES = ["cap", "tour"] as const;

export function MerchLaunchPopup() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const hideTimerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const slide = SLIDES[slideIndex]!;
  const isCap = slide === "cap";

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

  const goTo = useCallback((index: number) => {
    setSlideIndex((index + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      // Keep the popup functional when session storage is unavailable.
    }

    let active = true;
    let queued = false;
    let revealTimer: number | null = null;
    let fallbackTimer: number | null = null;

    const queueReveal = () => {
      if (queued) return;
      queued = true;

      revealTimer = window.setTimeout(() => {
        if (!active) return;
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // The popup can still display without persistence.
        }
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
    if (!mounted || !visible) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setSlideIndex((index) => (index + 1) % SLIDES.length);
    }, LOOP_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [mounted, visible]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goTo(slideIndex + 1);
      if (event.key === "ArrowLeft") goTo(slideIndex - 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, goTo, mounted, slideIndex]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  if (!mounted) return null;

  const copy = isCap
    ? {
        eyebrow: t.merch.popupEyebrow,
        title: t.merch.popupTitle,
        subtitle: t.merch.popupPrice,
        body: t.merch.popupBody,
        cta: t.merch.popupCta,
      }
    : {
        eyebrow: t.merch.tourPopupEyebrow,
        title: t.merch.tourPopupTitle,
        subtitle: t.merch.tourPopupPrice,
        body: t.merch.tourPopupBody,
        cta: t.merch.tourPopupCta,
      };

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
        aria-labelledby="home-popup-title"
        aria-roledescription="carousel"
        data-lenis-prevent
        data-lenis-prevent-touch
        data-lenis-prevent-wheel
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
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
            className={`object-contain transition-opacity duration-500 ${
              isCap ? "opacity-100" : "opacity-0"
            }`}
          />
          <Image
            src={founderPortrait}
            alt={t.about.founderImageAlt}
            fill
            placeholder="blur"
            quality={90}
            sizes="(max-width: 639px) 92vw, 320px"
            className={`object-cover transition-opacity duration-500 ${
              isCap ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold text-neutral-500">
            {copy.eyebrow}
          </p>
          <h2
            id="home-popup-title"
            className="mt-3 font-sans text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-none text-white normal-case"
          >
            <span className="block">{copy.title}</span>
            <span className="mt-2 block">{copy.subtitle}</span>
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-400 normal-case">
            {copy.body}
          </p>
          {isCap ? (
            <Link
              href="/merch"
              onClick={close}
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-neutral-200 sm:w-auto"
            >
              {copy.cta}
            </Link>
          ) : (
            <a
              href={TOUR_PRESS_URL}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-neutral-200 sm:w-auto"
            >
              {copy.cta}
            </a>
          )}

          <div className="mt-6 flex items-center gap-2" role="tablist">
            {SLIDES.map((id, index) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={id === "cap" ? t.merch.popupTitle : t.merch.tourPopupTitle}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  slideIndex === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
