import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["openweathermap.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        port: "",
      },
    ],
  },
};

export default nextConfig;
