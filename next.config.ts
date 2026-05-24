import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mapbox-gl"],
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 1080, 1200, 1920, 2560, 3840, 6400],
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
