import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const routes = [
  "/",
  "/about",
  "/schedule",
  "/gallery",
  "/merch",
  "/tickets",
  "/roster",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  return routes.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/schedule" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/schedule" || path === "/tickets" || path === "/merch"
          ? 0.9
          : 0.7,
  }));
}
