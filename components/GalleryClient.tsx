"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type Props = {
  filenames: string[];
};

function galleryPath(file: string) {
  return `/gallery/${encodeURIComponent(file)}`;
}

export function GalleryClient({ filenames }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainSrc, setMainSrc] = useState("");
  const [, setBlobTick] = useState(0);
  const titleId = useId();
  const blobByFile = useRef<Map<string, string>>(new Map());
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = filenames.length;

  const bumpBlobs = useCallback(() => setBlobTick((t) => t + 1), []);

  const loadBlob = useCallback(
    (file: string) => {
      if (blobByFile.current.has(file)) return Promise.resolve();
      const path = galleryPath(file);
      return fetch(path)
        .then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          blobByFile.current.set(file, url);
          bumpBlobs();
        })
        .catch(() => {
          /* keep fallback public URL */
        });
    },
    [bumpBlobs],
  );

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
    if (!open) {
      blobByFile.current.forEach((url) => URL.revokeObjectURL(url));
      blobByFile.current.clear();
      setMainSrc("");
      return;
    }

    const file = filenames[activeIndex];
    const publicUrl = galleryPath(file);
    const cached = blobByFile.current.get(file);
    if (cached) {
      setMainSrc(cached);
    } else {
      setMainSrc(publicUrl);
    }

    let cancelled = false;

    void loadBlob(file).then(() => {
      if (cancelled || !open) return;
      const u = blobByFile.current.get(file);
      if (u) setMainSrc(u);
    });

    const pre = [
      (activeIndex - 1 + n) % n,
      (activeIndex + 1) % n,
      (activeIndex - 2 + n) % n,
      (activeIndex + 2) % n,
    ];
    pre.forEach((idx) => {
      void loadBlob(filenames[idx]);
    });

    return () => {
      cancelled = true;
    };
  }, [open, activeIndex, filenames, loadBlob, n]);

  useEffect(() => {
    if (!open) return;
    const el = thumbRefs.current[activeIndex];
    el?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex, open]);

  if (n === 0) return null;

  const thumbSrc = (file: string) =>
    blobByFile.current.get(file) ?? galleryPath(file);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {filenames.map((file, index) => (
          <li key={file}>
            <button
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setOpen(true);
              }}
              className="group block w-full cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-neutral-950 p-0 text-left transition hover:border-white/25"
              aria-label={`Open photo ${index + 1} of ${n} in lightbox`}
            >
              <span className="relative block aspect-[4/3] w-full">
                <Image
                  src={galleryPath(file)}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:brightness-110"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  priority={index < 6}
                />
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
              className="my-auto shrink-0 self-center rounded-full border border-white/20 p-3 text-white transition hover:border-white/40 hover:bg-white/10"
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
                className="flex h-full max-h-[min(85dvh,85vh)] w-full max-w-[min(96vw,1400px)] items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* blob: URLs — use native img */}
                <img
                  src={mainSrc || galleryPath(filenames[activeIndex])}
                  alt={`Gallery photo ${activeIndex + 1} of ${n}`}
                  className="max-h-[min(85dvh,85vh)] max-w-full object-contain"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="my-auto shrink-0 self-center rounded-full border border-white/20 p-3 text-white transition hover:border-white/40 hover:bg-white/10"
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
              style={{ scrollbarColor: "rgba(255,255,255,0.25) transparent" }}
            >
              {filenames.map((file, i) => (
                <button
                  key={file}
                  type="button"
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    i === activeIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumbSrc(file)}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
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
