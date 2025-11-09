import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enable static export for GitHub Pages build
  // For Vercel, this should be commented out or removed
  // output: 'export',
  // basePath: process.env.NODE_ENV === 'production' ? '/telling-quote' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
