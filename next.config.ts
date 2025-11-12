import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Environment variables are automatically available in Next.js
    // Client-side variables must be prefixed with NEXT_PUBLIC_
    // Server-side variables can be any name
  },
};

export default nextConfig;
