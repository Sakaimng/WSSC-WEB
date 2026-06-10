"use client";

import {
  COMEDIAN_SIGNUP_FORM_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
} from "@/lib/config";
import {
  formatTokyoTimeWithMilliseconds,
  getUpcomingShows,
  SHOW_TIME,
} from "@/lib/show-schedule";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useI18n } from "@/components/LanguageProvider";
import { formatShowDate } from "@/lib/i18n";
import { useEffect, useMemo, useRef, useState } from "react";

function FooterJptClock() {
  const { t } = useI18n();
  const timeRef = useRef<HTMLTimeElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    let raf = 0;

    const tick = () => {
      const el = timeRef.current;
      if (el) {
        el.textContent = formatTokyoTimeWithMilliseconds(new Date());
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [hydrated]);

  return (
    <div className="flex items-baseline gap-2 font-sans text-[0.65rem] tabular-nums leading-none text-white">
      <span className="font-sans text-[0.62rem] font-semibold text-white">
        {t.nav.jptClock}
      </span>
      <time ref={timeRef} className="text-white" suppressHydrationWarning aria-hidden>
        {hydrated ? formatTokyoTimeWithMilliseconds(new Date()) : "00:00:00.000"}
      </time>
    </div>
  );
}

export function SiteFooter() {
  const { language, t } = useI18n();
  const nextShow = useMemo(() => getUpcomingShows(undefined, 1)[0], []);
  const nextShowDate = nextShow
    ? formatShowDate(new Date(nextShow.year, nextShow.month, nextShow.day), language)
    : null;

  return (
    <footer className="site-footer fixed bottom-0 left-0 right-0 z-50 bg-black px-[2vw] py-3 transition-[filter,opacity] duration-300 min-[1032px]:bg-transparent">
      <nav
        className="flex flex-wrap items-center gap-x-4 gap-y-2 pr-0 text-sm text-neutral-400 md:pr-44"
        aria-label={t.footer.label}
      >
        {nextShowDate ? (
          <Link
            href="/schedule"
            className="text-[0.62rem] font-semibold text-neutral-300 transition hover:text-white md:hidden"
          >
            {t.footer.next} {nextShowDate} · {SHOW_TIME}
          </Link>
        ) : (
          <span className="md:hidden" />
        )}
        <div className="flex min-w-0 flex-1 flex-wrap items-end justify-end gap-x-6 gap-y-2 md:flex-none md:justify-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            {t.footer.instagram}
          </a>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            {t.footer.googleMaps}
          </a>
          <a
            href={COMEDIAN_SIGNUP_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden transition hover:text-white md:inline"
          >
            {t.footer.comedianSignup}
          </a>
        </div>
      </nav>
      {/* Viewport-right anchor: same horizontal inset as footer padding */}
      <div className="absolute top-1/2 right-[2vw] hidden -translate-y-1/2 md:block">
        <FooterJptClock />
      </div>
    </footer>
  );
}
