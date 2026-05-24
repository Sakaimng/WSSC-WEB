"use client";

import { useI18n } from "@/components/LanguageProvider";

export function GalleryEmptyMessage() {
  const { t } = useI18n();

  return (
    <p className="text-sm text-neutral-500">
      {t.gallery.emptyPrefix}{" "}
      <code className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-white">
        public/gallery/
      </code>
      .
    </p>
  );
}
