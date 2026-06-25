"use client";

import { LanguageToggle } from "@/components/LanguageToggle";
import {
  COMEDIAN_SIGNUP_FORM_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
} from "@/lib/config";
import { useI18n } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <>
      <footer className="site-footer fixed bottom-0 left-0 right-0 z-50 hidden grid-cols-3 items-center px-[2vw] py-3 transition-[filter,opacity] duration-300 min-[1032px]:grid min-[1032px]:bg-transparent">
        <nav
          className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-sm text-neutral-400"
          aria-label={t.footer.label}
        >
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
            className="transition hover:text-white"
          >
            {t.footer.comedianSignup}
          </a>
        </nav>
        <p className="justify-self-center text-center text-xs text-neutral-400">
          {t.footer.copyright}
        </p>
        <div className="justify-self-end">
          <LanguageToggle variant="footer" className="shrink-0" />
        </div>
      </footer>
    </>
  );
}
