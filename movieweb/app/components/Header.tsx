"use client";

import { useState } from "react";
import { Search, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="PhimHD"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold">PhimHD</span>
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="hidden md:flex items-center bg-gray-800 px-3 py-1 rounded-full w-1/3">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm phim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none px-2 text-sm w-full text-gray-200"
          />
        </div>

        {/* Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/phim-le" className="hover:text-yellow-400 transition">Phim Lẻ</Link>
          <Link href="/phim-bo" className="hover:text-yellow-400 transition">Phim Bộ</Link>
          <Link href="/the-loai" className="hover:text-yellow-400 transition">Thể Loại</Link>
          <Link href="/quoc-gia" className="hover:text-yellow-400 transition">Quốc Gia</Link>
        </nav>

        {/* Nút đăng nhập */}
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/login"
            className="bg-yellow-500 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-400 transition"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Menu mobile */}
        <button className="md:hidden">
          <Menu size={26} />
        </button>
      </div>
    </header>
  );
}
