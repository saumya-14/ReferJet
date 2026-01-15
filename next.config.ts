import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure middleware uses Edge runtime (default in Next.js 16)
  experimental: {
    // This ensures proper Edge runtime support
  },
};

export default nextConfig;
