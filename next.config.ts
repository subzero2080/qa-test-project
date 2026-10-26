import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Browsers request /favicon.ico by convention; serve the in-app logo.
    return [{ source: '/favicon.ico', destination: '/logo.svg' }]
  },
};

export default nextConfig;
