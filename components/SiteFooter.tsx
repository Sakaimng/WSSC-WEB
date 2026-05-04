import { GOOGLE_MAPS_URL, INSTAGRAM_URL } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-[2vw] py-6">
      <nav
        className="flex flex-col gap-3 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Social and location"
      >
        <p className="font-medium text-neutral-500">Why So Serious Comedy</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Google Maps
          </a>
        </div>
      </nav>
    </footer>
  );
}
