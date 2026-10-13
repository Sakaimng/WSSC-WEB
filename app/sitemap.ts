import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const routes = [
  "/",
  "/about",
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
    changeFrequency: "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/tickets" || path === "/merch"
          ? 0.9
          : 0.7,
  }));
}
