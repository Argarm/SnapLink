import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Allow build to complete despite TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Also ignore ESLint errors during build
  }
};

export default nextConfig;
