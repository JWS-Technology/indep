import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sjctni.edu",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
