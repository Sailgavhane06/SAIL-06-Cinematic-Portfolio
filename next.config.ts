import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
    turbopackSourceMaps: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com https://*.unsplash.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.web3forms.com https://accounts.google.com https://*.supabase.co; frame-src 'self' https://accounts.google.com; frame-ancestors 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
