"use client";

import gsap from "gsap";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/LanguageProvider";
import { splitElementIntoLines } from "@/lib/split-text-lines";
import founderPortrait from "../public/PROFILE/Founder Portrait.jpg";
import creativeDirectorPortrait from "../public/PROFILE/CD Portrait.jpg";

const FOUNDER_PORTRAIT = founderPortrait;
const CREATIVE_DIRECTOR_PORTRAIT = creativeDirectorPortrait;
const STORY_FADE_MS = 300;

function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle("founder-story-open", locked);
}

type PortraitCardProps = {
  imageSrc: StaticImageData;
  imageAlt: string;
  imageLabel: string;
  role: string;
  name: string;
  readStoryLabel: string;
  onReadStory: () => void;
};

const portraitCardClassName =
  "about-portrait-card group about-reveal relative aspect-[4/5] w-full min-w-0 cursor-pointer overflow-hidden rounded-[9px] border-0 bg-black p-0 text-left opacity-0 sm:aspect-auto sm:h-full sm:max-h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function AboutPortraitCard({
  imageSrc,
  imageAlt,
  imageLabel,
  role,
  name,
  readStoryLabel,
  onReadStory,
}: PortraitCardProps) {
  return (
    <button
      type="button"
      onClick={onReadStory}
      aria-label={`${readStoryLabel}, ${name}`}
      className={portraitCardClassName}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center scale-[1.03]"
          sizes="(max-width: 639px) calc(100vw - 4vw), calc((100vw - 4vw - 2vw) / 2)"
          quality={90}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-5">
        <span
          aria-hidden
          className="shrink-0 text-left text-sm font-semibold text-neutral-400 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white"
        >
          {readStoryLabel}
        </span>
        <div className="flex min-w-0 flex-col items-end gap-1 text-right">
          <p className="text-xs font-semibold text-neutral-400">{role}</p>
          <p className="font-sans text-lg font-semibold text-white">{name}</p>
        </div>
      </div>
    </button>
  );
}

export function AboutContent() {
  const { language, t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const storyContentRef = useRef<HTMLDivElement>(null);
  const [storySubject, setStorySubject] = useState<"founder" | "creativeDirector" | null>(
    null,
  );
  const [storyVisible, setStoryVisible] = useState(false);
  const storyMounted = storySubject !== null;
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const openFounderStory = () => setStorySubject("founder");
  const openCreativeDirectorStory = () => setStorySubject("creativeDirector");
  const closeStory = () => setStoryVisible(false);

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

  useEffect(() => {
    if (!storyMounted) {
      setStoryVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setStoryVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [storyMounted]);

  useEffect(() => {
    if (storyVisible || !storyMounted) return;

    const timeout = window.setTimeout(() => setStorySubject(null), STORY_FADE_MS);
    return () => window.clearTimeout(timeout);
  }, [storyVisible, storyMounted]);

  useLayoutEffect(() => {
    if (!storyVisible || !storyMounted) return;

    const content = storyContentRef.current;
    if (!content) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = content.querySelectorAll<HTMLElement>("[data-split-line]");
    const revertSplit = Array.from(blocks, (block) => splitElementIntoLines(block));
    const lines = content.querySelectorAll<HTMLElement>(".about-story-line-inner");

    if (reduced) {
      return () => revertSplit.forEach((revert) => revert());
    }

    const ctx = gsap.context(() => {
      gsap.set(lines, { y: "110%", autoAlpha: 0 });
      gsap.to(lines, {
        y: "0%",
        autoAlpha: 1,
        duration: 0.65,
        stagger: 0.055,
        ease: "power3.out",
        delay: 0.1,
      });
    }, content);

    return () => {
      ctx.revert();
      revertSplit.forEach((revert) => revert());
    };
  }, [storyVisible, storyMounted, storySubject, language, t]);

  useEffect(() => {
    if (!storyMounted) return;

    setScrollLocked(true);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeStory();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [storyMounted]);

  return (
    <div ref={root} className="page-viewport">
      <section className="flex flex-col sm:min-h-0 sm:flex-1 sm:justify-center sm:overflow-hidden">
        <div className="about-reveal flex w-full shrink-0 items-baseline justify-between gap-4 opacity-0">
          <p className="shrink-0 text-xs font-semibold text-white">
            {t.about.eyebrow}
          </p>
          <h1 className="min-w-0 text-right font-sans text-base font-semibold text-white">
            {t.about.title}
          </h1>
        </div>

        <div className="about-portrait-grid mt-4 grid w-full min-w-0 grid-cols-1 gap-[2vw] sm:mt-5 sm:h-[calc(100dvh-11rem)] sm:max-h-[calc(100dvh-11rem)] sm:min-h-0 sm:flex-1 sm:grid-cols-2 sm:grid-rows-1 sm:items-stretch">
          <AboutPortraitCard
            imageSrc={FOUNDER_PORTRAIT}
            imageAlt={t.about.founderImageAlt}
            imageLabel={t.about.founderImageLabel}
            role={t.about.founderRole}
            name={t.about.founderName}
            readStoryLabel={t.about.readStory}
            onReadStory={openFounderStory}
          />
          <AboutPortraitCard
            imageSrc={CREATIVE_DIRECTOR_PORTRAIT}
            imageAlt={t.about.creativeDirectorImageAlt}
            imageLabel={t.about.creativeDirectorImageLabel}
            role={t.about.creativeDirectorRole}
            name={t.about.creativeDirectorName}
            readStoryLabel={t.about.readStory}
            onReadStory={openCreativeDirectorStory}
          />
        </div>
      </section>

      {storyMounted && portalReady
        ? createPortal(
            <div
              className={`fixed inset-0 z-[60] transition-opacity duration-300 ease-out ${
                storyVisible ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              role="presentation"
            >
              <button
                type="button"
                aria-label={t.about.hideStory}
                className="absolute inset-0 z-0 bg-black/90"
                onClick={closeStory}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-story-title"
                className="about-story-scroll z-10"
                data-lenis-prevent
                data-lenis-prevent-touch
                data-lenis-prevent-wheel
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative mx-auto w-full max-w-2xl px-[2vw] pt-[2vh] pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:py-20">
                  <button
                    type="button"
                    onClick={closeStory}
                    className="about-story-close relative z-20 mb-6 block cursor-pointer text-sm font-semibold text-neutral-300 transition-colors hover:text-white"
                  >
                    {t.about.hideStory}
                  </button>
                  <p id="about-story-title" className="sr-only">
                    {storySubject === "creativeDirector"
                      ? t.about.creativeDirectorName
                      : t.about.founderName}
                  </p>
                  <div ref={storyContentRef} className="relative z-0">
                    <p
                      data-split-line
                      className="text-left leading-normal text-neutral-300"
                    >
                      {storySubject === "creativeDirector"
                        ? t.about.creativeDirectorIntro
                        : t.about.founderIntro}
                    </p>
                    <div className="mt-6 space-y-5 text-left leading-normal text-neutral-300">
                      {(storySubject === "creativeDirector"
                        ? t.about.creativeDirectorStory
                        : t.about.founderStory
                      ).map((paragraph) => (
                        <p key={paragraph} data-split-line>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
