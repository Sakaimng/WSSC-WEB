import type { Metadata } from "next";
import { GalleryClient } from "@/components/GalleryClient";
import { getGalleryImageNames } from "@/lib/gallery-images";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Why So Serious Comedy.",
};

export default function GalleryPage() {
  const filenames = getGalleryImageNames();

  return (
    <div className="box-border w-full max-w-none flex-1 px-[2vw] py-12 sm:py-16">
      <header className="mb-12">
        <h1 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-neutral-400">
          {filenames.length > 0
            ? `${filenames.length} photos from the room. Add or remove files in the Archive Gallery folder—this page picks them up automatically.`
            : "Add images to the Archive Gallery folder at the project root to populate this grid."}
        </p>
      </header>

      {filenames.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No images found. Expected a folder named{" "}
          <code className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-white">
            Archive Gallery
          </code>{" "}
          next to{" "}
          <code className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-white">
            app/
          </code>
          .
        </p>
      ) : (
        <GalleryClient filenames={filenames} />
      )}
    </div>
  );
}
