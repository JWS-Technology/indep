import type { NextConfig } from "next";

const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
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
