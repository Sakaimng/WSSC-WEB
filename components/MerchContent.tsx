"use client";

import Image from "next/image";
import { Fragment } from "react";
import { useI18n } from "@/components/LanguageProvider";
import { MERCH_CONTACT_URL } from "@/lib/config";
import capHero from "../E-C/L1071508-Edit.jpg";
import capFront from "../E-C/L1071764-Edit.jpg";
import capBack from "../E-C/L1071769-Edit.jpg";
import capSide from "../E-C/L1071776-Edit.jpg";
import capTop from "../E-C/L1071772-Edit.jpg";
import capDetailOne from "../E-C/L1071497-Edit.jpg";
import capDetailTwo from "../E-C/L1071492-Edit.jpg";

const productImages = [
  capHero,
  capFront,
  capBack,
  capSide,
  capTop,
  capDetailOne,
  capDetailTwo,
] as const;

function ProductDetails({ className }: { className: string }) {
  const { t } = useI18n();

  return (
    <aside className={className}>
      <p className="text-xs font-semibold text-neutral-500">
        {t.merch.eyebrow}
      </p>
      <h1 className="mt-3 font-sans text-base font-semibold text-black">
        {t.merch.title}
      </h1>
      <p className="mt-3 text-base font-semibold text-black">
        {t.merch.price}
      </p>
      <p className="mt-1 text-xs text-neutral-500">{t.merch.taxIncluded}</p>

      <p className="mt-7 leading-relaxed text-neutral-600">
        {t.merch.description}
      </p>

      <div className="mt-8 border-t border-black/15">
        <div className="flex items-center justify-between gap-4 border-b border-black/15 py-4">
          <span className="text-neutral-500">{t.merch.colorLabel}</span>
          <span className="font-semibold text-black">{t.merch.colorValue}</span>
        </div>

        <div className="py-4">
          <p className="mb-3 text-neutral-500">{t.merch.sizeLabel}</p>
          <button
            type="button"
            aria-pressed="true"
            className="min-w-28 border border-black bg-black px-5 py-3 text-white"
          >
            {t.merch.sizeValue}
          </button>
        </div>
      </div>

      <a
        href={MERCH_CONTACT_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex w-full items-center justify-center bg-black px-6 py-4 font-semibold text-white transition-colors hover:bg-neutral-800"
      >
        {t.merch.cta}
      </a>
      <p className="mt-3 text-center text-xs leading-relaxed text-neutral-500">
        {t.merch.contactNote}
      </p>

      <details className="group mt-8 border-y border-black/15" open>
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold text-black">
          {t.merch.detailsTitle}
          <span className="text-lg transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <ul className="space-y-2 pb-5 leading-relaxed text-neutral-600">
          {t.merch.details.map((detail) => (
            <li key={detail}>• {detail}</li>
          ))}
        </ul>
      </details>
    </aside>
  );
}

export function MerchContent() {
  const { t } = useI18n();

  return (
    <div className="merch-page min-h-[100dvh] w-full bg-white pb-[var(--mobile-nav-pill-inset)] text-black min-[1032px]:pb-12">
      <div className="grid min-h-[calc(100dvh-var(--mobile-nav-header-height))] items-start min-[1032px]:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
        <section
          className="grid min-w-0 grid-cols-1 gap-px bg-black/10 min-[1032px]:grid-cols-2"
          aria-label={t.merch.galleryLabel}
        >
          {productImages.map((image, index) => (
            <Fragment key={image.src}>
              <figure
                className={`relative aspect-[4/5] overflow-hidden bg-[#f3f3f3] ${
                  index === 0
                    ? "min-[1032px]:col-span-2 min-[1032px]:aspect-[4/3]"
                    : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${t.merch.imageAlt}, ${index + 1}`}
                  fill
                  priority={index === 0}
                  placeholder="blur"
                  quality={90}
                  sizes={
                    index === 0
                      ? "(max-width: 1031px) 100vw, 67vw"
                      : "(max-width: 1031px) 100vw, 34vw"
                  }
                  className="object-cover"
                />
              </figure>
              {index === 0 ? (
                <ProductDetails className="col-span-full bg-white px-5 py-8 sm:px-8 min-[1032px]:hidden" />
              ) : null}
            </Fragment>
          ))}
        </section>

        <ProductDetails className="hidden self-start bg-white min-[1032px]:sticky min-[1032px]:top-[var(--mobile-nav-header-height)] min-[1032px]:block min-[1032px]:max-h-[calc(100dvh-var(--mobile-nav-header-height)-3rem)] min-[1032px]:overflow-y-auto min-[1032px]:px-[3vw] min-[1032px]:py-10" />
      </div>
    </div>
  );
}
