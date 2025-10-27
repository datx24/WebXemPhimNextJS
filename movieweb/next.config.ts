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

  async redirects() {
    return [
      // 🔹 Redirect các route chính về trang search tương ứng
      {
        source: "/phim-le",
        destination: "/search?category=phim-le",
        permanent: true,
      },
      {
        source: "/phim-bo",
        destination: "/search?category=phim-bo",
        permanent: true,
      },
      {
        source: "/tv-shows",
        destination: "/search?category=tv-shows",
        permanent: true,
      },
      {
        source: "/phim-dang-chieu",
        destination: "/search?category=phim-dang-chieu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
