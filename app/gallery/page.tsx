import type { Metadata } from "next";
import { GalleryClient } from "@/components/GalleryClient";
import { getGalleryImages } from "@/lib/gallery-images";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Why So Serious Comedy.",
};

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="box-border w-full max-w-none flex-1 px-[2vw] py-12 sm:py-16">
      <header className="mb-12">
        <h1 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-neutral-400">
          {images.length > 0
            ? `${images.length} photos from the room. Optimized images are served from the site.`
            : "Add optimized images to public/gallery to populate this grid."}
        </p>
      </header>

      {images.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No images found. Expected public images under{" "}
          <code className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-white">
            public/gallery/
          </code>
          .
        </p>
      ) : (
        <GalleryClient images={images} />
      )}
    </div>
  );
}
