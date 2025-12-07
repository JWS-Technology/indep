import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.sjctni.edu" },
      { protocol: "https", hostname: "sjctni.edu" },
      { protocol: "http",  hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/api/**" },
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
    ],
  },

  productionBrowserSourceMaps: false,
  // devIndicators: {
  //   buildActivity: false,
  // },
};

export default nextConfig;
