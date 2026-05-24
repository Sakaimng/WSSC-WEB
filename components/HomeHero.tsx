"use client";

import gsap from "gsap";
import Image from "next/image";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useI18n } from "@/components/LanguageProvider";
import { useLayoutEffect, useRef } from "react";
import { PAGE_PRELOADER_DONE_EVENT } from "@/components/PagePreloader";

/** High-res source in `public/hero/` (6214×9336). Optimized per viewport via `next/image`. */
const HERO_IMAGE = "/hero/home-hero.jpg";

export function HomeHero() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    let removePreloaderListener = () => {};

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
      const ctaButtons = gsap.utils.toArray<HTMLElement>(".hero-cta-btn");
      const heroBg = el.querySelector<HTMLElement>(".hero-bg");

      gsap.set(lines, { autoAlpha: 0, y: 48 });
      gsap.set(ctaButtons, { autoAlpha: 0, y: 20 });
      gsap.set(heroBg, { autoAlpha: 0, scale: 1.06 });

      const playIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (heroBg) {
          tl.to(
            heroBg,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1.2,
              ease: "expo.out",
            },
            0,
          );
        }

        tl.to(
          lines,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
          },
          0.2,
        );

        if (ctaButtons.length > 0) {
          tl.to(
            ctaButtons,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "-=0.35",
          );
        }
      };

      if (document.querySelector("[data-page-preloader]")) {
        window.addEventListener(PAGE_PRELOADER_DONE_EVENT, playIntro, {
          once: true,
        });
        removePreloaderListener = () => {
          window.removeEventListener(PAGE_PRELOADER_DONE_EVENT, playIntro);
        };
        return;
      }

      playIntro();
    }, el);

    return () => {
      removePreloaderListener();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-x-hidden"
    >
      <div className="hero-bg hero-bg-wrap fixed inset-0 z-0 h-[100dvh] w-full opacity-0" aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt="Stand-up comedy at Why So Serious Comedy — English comedy in Tokyo, Kinshicho"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hero-bg-image"
        />
        <div className="hero-bg-vignette pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <div className="relative z-10 flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-visible px-[2vw] pb-14 pt-16 sm:pb-16 sm:pt-20">
        <div className="flex flex-1 items-center">
          <h1 className="flex w-full items-end justify-between gap-3 font-sans text-base font-semibold leading-[0.95] sm:gap-6 md:gap-8">
            <span className="hero-line shrink-0 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
              {t.home.titleLine1}
            </span>
            <span className="hero-line shrink-0 text-right text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
              {t.home.titleLine2}
            </span>
          </h1>
        </div>

        <div className="relative z-20 shrink-0 overflow-visible">
          <div className="flex w-full flex-col items-stretch gap-3 overflow-visible sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <div className="hero-cta-btn w-full sm:w-auto">
              <Link
                href="/gallery"
                className="block w-full origin-center rounded-full bg-white px-8 py-3 text-center text-sm font-semibold text-black transition-all duration-300 ease-out hover:scale-110 hover:bg-black hover:text-white"
              >
                {t.home.seeRoom}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
