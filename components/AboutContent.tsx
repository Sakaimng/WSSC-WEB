"use client";

import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

export function AboutContent() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".about-reveal");

      gsap.set(reveals, { autoAlpha: 0, y: 36 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(reveals, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
        });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="box-border w-full max-w-none flex-1 px-[2vw]">
      <section className="flex min-h-[100vh] flex-col justify-center py-20 sm:py-24">
        <div className="about-reveal opacity-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            About
          </p>
          <h1 className="mt-4 max-w-5xl font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl md:text-6xl">
            The people behind the room
          </h1>
        </div>

        <div className="mt-12 space-y-6">
          <article className="about-reveal flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 opacity-0 sm:p-8 md:flex-row md:items-center">
            <div
              className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:w-56 lg:w-72"
              aria-label="Founder profile image"
            >
              <Image
                src="/PROFILE/FOUNDER.jpg"
                alt="Founder profile"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 96vw, (max-width: 1024px) 224px, 288px"
                quality={85}
              />
            </div>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Founder
              </p>
              <h2 className="mt-4 font-sans text-2xl font-semibold tracking-wide text-white">
                Building the room
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-300">
                The founder shaped Why So Serious Comedy around a simple idea: make English stand-up in
                Tokyo feel welcoming, affordable, and genuinely funny. From booking comics to setting
                the tone at the door, the focus is always on creating a room where performers can take
                risks and audiences can relax into the night.
              </p>
            </div>
          </article>

          <article className="about-reveal flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 opacity-0 sm:p-8 md:flex-row md:items-center">
            <div
              className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:w-56 lg:w-72"
              aria-label="Creative director profile image"
            >
              <Image
                src="/PROFILE/CREATIVE%20DIRECTOR.jpg"
                alt="Creative director profile"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 96vw, (max-width: 1024px) 224px, 288px"
                quality={85}
              />
            </div>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Creative Director
              </p>
              <h2 className="mt-4 font-sans text-2xl font-semibold tracking-wide text-white">
                Shaping the show
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-300">
                The creative director keeps the show sharp from first impression to final applause:
                pacing the lineup, refining the visual language, and making sure every poster, photo,
                clip, and stage moment feels unmistakably Why So Serious. The result is a comedy night
                with a clear voice and a room that people want to come back to.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="about-reveal border-t border-white/10 py-16 opacity-0 sm:py-24">
        <h2 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
          Our story
        </h2>
        <div className="mt-10 max-w-4xl space-y-6 leading-relaxed text-neutral-300">
          <p>
            Why So Serious Comedy started as a small room with a loud neighbor, a borrowed PA, and a
            stubborn belief that the best punchlines land when the room feels honest. We built a
            home for comics who like edge without cruelty-and audiences who laugh hard enough to
            forget the week they just had.
          </p>
          <p>
            Today we run regular showcases, feature touring talent, and keep the energy tight:
            sharp hosts, fair pay, and a crowd that respects the work on stage. Swap this copy for
            your real origin story, milestones, and the people who made the club happen.
          </p>
        </div>
      </section>
    </div>
  );
}
