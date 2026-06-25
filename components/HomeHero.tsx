"use client";

import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { PAGE_PRELOADER_DONE_EVENT } from "@/components/PagePreloader";

/** Static import — long-lived cache + build-time dimensions. */
import homeHero from "../public/hero/home-hero.jpg";

export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    let removePreloaderListener = () => {};

    const ctx = gsap.context(() => {
      const heroBg = el.querySelector<HTMLElement>(".hero-bg");

      gsap.set(heroBg, { autoAlpha: 0, scale: 1.06 });

      const playIntro = () => {
        if (!heroBg) return;

        gsap.to(heroBg, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
        });
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
          src={homeHero}
          alt="Stand-up comedy at Why So Serious Comedy — English comedy in Tokyo, Kinshicho"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="hero-bg-image"
        />
      </div>
    </div>
  );
}
