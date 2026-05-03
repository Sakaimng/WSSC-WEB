"use client";

import gsap from "gsap";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useLayoutEffect, useRef } from "react";
import { PAGE_PRELOADER_DONE_EVENT } from "@/components/PagePreloader";

export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    let removePreloaderListener = () => {};

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
      const sub = el.querySelector<HTMLElement>(".hero-sub");
      const ctaButtons = gsap.utils.toArray<HTMLElement>(".hero-cta-btn");

      gsap.set(lines, { autoAlpha: 0, y: 48 });
      if (sub) gsap.set(sub, { autoAlpha: 0, y: 24 });
      gsap.set(ctaButtons, { autoAlpha: 0, y: 20 });

      const playIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(lines, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
        });

        if (sub) {
          tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.35");
        }

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
      className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8"
    >
      <h1 className="font-sans font-semibold leading-[0.9] tracking-tight">
        <span className="hero-line block text-5xl text-white sm:text-7xl md:text-8xl">
          LIVE STAND-UP.
        </span>
        <span className="hero-line block text-5xl text-neutral-300 sm:text-7xl md:text-8xl">
          SERIOUS FUN.
        </span>
      </h1>
      <p className="hero-sub mt-6 max-w-md text-base text-neutral-400 sm:mt-8 sm:text-lg">
        Photos, clips, and a room that doesn’t take itself too seriously—except when the mic is on.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-4">
        <Link
          href="/gallery"
          className="hero-cta-btn rounded-full border border-white/25 bg-transparent px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
        >
          See the room
        </Link>
        <Link
          href="/tickets"
          className="hero-cta-btn rounded-full border border-white bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          Get tickets
        </Link>
      </div>
    </div>
  );
}
