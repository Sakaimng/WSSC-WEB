import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const source = join(root, "MAP");
const target = join(root, "public", "map");

if (!existsSync(source)) {
  console.error("MAP/ folder not found — add your Mapbox Studio export there.");
  process.exit(1);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("Synced MAP/ → public/map/");
