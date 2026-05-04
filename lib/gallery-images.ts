import fs from "node:fs";
import path from "node:path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

export type GalleryImage = {
  name: string;
  src: string;
};

function sortImages(a: GalleryImage, b: GalleryImage) {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

export function getGalleryImages(): GalleryImage[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];
  return fs
    .readdirSync(GALLERY_DIR)
    .filter((f) => IMAGE_EXT.test(f))
    .map((name) => ({
      name,
      src: `/gallery/${encodeURIComponent(name)}`,
    }))
    .sort(sortImages);
}
