import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mapbox-gl"],
  reactCompiler: true,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 2678400,
    localPatterns: [
      { pathname: "/hero/**" },
      { pathname: "/gallery/**" },
      { pathname: "/PROFILE/**" },
    ],
    deviceSizes: [640, 750, 1080, 1280, 1920, 2560],
    imageSizes: [96, 128, 256, 384],
    qualities: [60, 75, 90],
  },
};

export default nextConfig;
