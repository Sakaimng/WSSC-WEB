import fs from "node:fs";
import path from "node:path";

const ARCHIVE_DIR = path.join(process.cwd(), "Archive Gallery");

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

export function getGalleryImageNames(): string[] {
  if (!fs.existsSync(ARCHIVE_DIR)) return [];
  return fs
    .readdirSync(ARCHIVE_DIR)
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
