import { GalleryClient } from "@/components/GalleryClient";
import { GalleryEmptyMessage } from "@/components/GalleryEmptyMessage";
import { getGalleryImages } from "@/lib/gallery-images";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Photos from stand-up comedy nights at Why So Serious Comedy — live English comedy in Tokyo, Kinshicho. See the room, the crowd, and the show.",
  path: "/gallery",
});

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="page-viewport page-viewport--scroll pb-4">
      

      {images.length === 0 ? (
        <GalleryEmptyMessage />
      ) : (
        <GalleryClient images={images} />
      )}
    </div>
  );
}
