import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["phim.nguonc.com"],
  },
  async rewrites() {
    return [
      // 🔹 Proxy API chi tiết phim
      {
        source: "/api/film/:slug",
        destination: "https://phim.nguonc.com/api/film/:slug",
      },
      // 🔹 Proxy API danh sách phim
      {
        source: "/api/films/:path*",
        destination: "https://phim.nguonc.com/api/films/:path*",
      },
    ];
  },
};

export default nextConfig;
