"use client";

import { useI18n } from "@/components/LanguageProvider";
import { languages, type Language } from "@/lib/i18n";

type Props = {
  className?: string;
  variant?: "light" | "dark" | "footer" | "footerLight";
};

export function LanguageToggle({ className = "", variant = "dark" }: Props) {
  const { language, setLanguage, t } = useI18n();
  const onLight = variant === "light" || variant === "footerLight";
  const onFooter = variant === "footer" || variant === "footerLight";

  const shellClassName = onFooter
    ? "relative inline-flex min-w-[4.25rem] rounded-full p-0.5"
    : `relative inline-flex min-w-[5.5rem] rounded-full border p-1 ${
        onLight
          ? "border-black/15 bg-black/[0.03]"
          : "border-white/15 bg-white/[0.03]"
      }`;

  const indicatorClassName = onFooter
    ? `pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc((100%-4px)/2)] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        onLight ? "bg-black" : "bg-white"
      }`
    : `pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/2)] rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        onLight ? "bg-black" : "bg-white"
      }`;

  return (
    <div
      className={`${shellClassName} ${className}`}
      aria-label={t.nav.toggleLabel}
    >
      <span
        className={indicatorClassName}
        style={{
          transform: language === "jp" ? "translateX(100%)" : "translateX(0)",
        }}
        aria-hidden
      />
      {languages.map((option) => {
        const active = language === option;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={t.nav.languageNames[option]}
            onClick={() => setLanguage(option as Language)}
            className={`relative z-10 flex-1 rounded-full transition-colors duration-200 ${
              onFooter
                ? "px-2.5 py-1 text-sm font-medium"
                : "px-3 py-1.5 text-xs font-semibold"
            } ${
              active
                ? onLight
                  ? "text-white"
                  : "text-black"
                : onLight
                  ? "text-neutral-500 hover:text-black"
                  : onFooter
                    ? "text-neutral-400 hover:text-white"
                    : "text-neutral-400 hover:text-white"
            }`}
          >
            {option === "jp" ? "JA" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
