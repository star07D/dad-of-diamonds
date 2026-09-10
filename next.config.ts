import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Sanity Studio uses styled-components
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
