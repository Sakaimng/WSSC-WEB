"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery-images";

type Props = {
  images: GalleryImage[];
};

export function GalleryClient({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = useId();
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = images.length;
  const activeImage = images[activeIndex];

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % n);
  }, [n]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, goPrev, goNext]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    [
      (activeIndex - 1 + n) % n,
      (activeIndex + 1) % n,
      (activeIndex - 2 + n) % n,
      (activeIndex + 2) % n,
    ].forEach((idx) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = images[idx].src;
    });
  }, [open, activeIndex, images, n]);

  useEffect(() => {
    if (!open) return;
    const el = thumbRefs.current[activeIndex];
    el?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex, open]);

  if (n === 0 || !activeImage) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-px lg:grid-cols-3 [&:has(button:hover)_button:not(:hover)_img]:brightness-[0.35] [&:has(button:hover)_button:not(:hover)_.gallery-index]:opacity-40">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setOpen(true);
              }}
              className="group block w-full cursor-pointer overflow-hidden bg-neutral-950 p-0 text-left"
              aria-label={`Open photo ${index + 1} of ${n} in lightbox`}
            >
              <span className="relative block aspect-[4/3] w-full">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:brightness-110"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  priority={index < 4}
                />
                <span className="gallery-index pointer-events-none absolute bottom-2 left-2 z-10 font-sans text-xs tabular-nums text-white/85">
                  .{String(index + 1).padStart(2, "0")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open ? (
        <div
          className="fixed inset-0 z-[300] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex shrink-0 items-center justify-between px-[2vw] py-4">
            <p id={titleId} className="text-sm text-neutral-400">
              <span className="text-white">{activeIndex + 1}</span>
              <span className="text-neutral-600"> / </span>
              {n}
            </p>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-stretch gap-2 px-2 sm:gap-3 sm:px-[2vw]">
            <button
              type="button"
              onClick={goPrev}
              className="my-auto shrink-0 cursor-pointer self-center rounded-full border border-white/20 p-3 text-white transition hover:border-white/40 hover:bg-white/10"
              aria-label="Previous image"
            >
              <span className="block text-xl leading-none" aria-hidden>
                ‹
              </span>
            </button>

            <div
              className="flex min-w-0 flex-1 cursor-default items-center justify-center"
              onClick={close}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  close();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close lightbox"
            >
              <div
                className="relative flex h-full max-h-[min(85dvh,85vh)] w-full max-w-[min(96vw,1400px)] items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  key={activeImage.src}
                  src={activeImage.src}
                  alt={`Gallery photo ${activeIndex + 1} of ${n}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={75}
                  priority
                  draggable={false}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="my-auto shrink-0 cursor-pointer self-center rounded-full border border-white/20 p-3 text-white transition hover:border-white/40 hover:bg-white/10"
              aria-label="Next image"
            >
              <span className="block text-xl leading-none" aria-hidden>
                ›
              </span>
            </button>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/60">
            <div
              className="flex gap-2 overflow-x-auto px-[2vw] py-3 [scrollbar-width:thin]"
              style={{ scrollbarColor: "rgba(241,241,241,0.25) transparent" }}
            >
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 transition ${
                    i === activeIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                    quality={60}
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
