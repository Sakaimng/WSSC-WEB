import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const galleryDir = path.join(process.cwd(), "public", "gallery");
const imageExt = /\.(jpe?g)$/i;
const maxWidth = 1920;
const jpegQuality = 80;

const files = (await fs.readdir(galleryDir))
  .filter((file) => imageExt.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let beforeTotal = 0;
let afterTotal = 0;

for (const [index, file] of files.entries()) {
  const filePath = path.join(galleryDir, file);
  const before = (await fs.stat(filePath)).size;
  const tmpPath = `${filePath}.tmp`;

  await sharp(filePath, { limitInputPixels: false })
    .rotate()
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: jpegQuality,
      mozjpeg: true,
      progressive: true,
    })
    .toFile(tmpPath);

  await fs.rename(tmpPath, filePath);

  const after = (await fs.stat(filePath)).size;
  beforeTotal += before;
  afterTotal += after;

  const saved = before > 0 ? Math.round((1 - after / before) * 100) : 0;
  console.log(
    `[${index + 1}/${files.length}] ${file}: ${formatBytes(before)} -> ${formatBytes(after)} (${saved}% saved)`,
  );
}

console.log(
  `Optimized ${files.length} images: ${formatBytes(beforeTotal)} -> ${formatBytes(afterTotal)} (${Math.round(
    (1 - afterTotal / beforeTotal) * 100,
  )}% saved)`,
);

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
