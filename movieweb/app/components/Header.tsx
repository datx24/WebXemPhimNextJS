"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GENRES, COUNTRIES, YEARS } from "../utils/constants";

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  // ✅ Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  // ✅ Xử lý click danh mục (TV Show, Phim Lẻ, Phim Bộ, Phim Đang Chiếu)
  const handleNavigateCategory = (category: string) => {
    router.push(`/search?category=${category}`);
  };

  // ✅ Xử lý click dropdown
  const handleNavigateParam = (param: string, value: string) => {
    router.push(`/search?${param}=${value}`);
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-3 flex flex-col md:flex-row items-center justify-between shadow-lg gap-3 md:gap-0">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/RoPhim.png" alt="MovieApp" width={133} height={40} />
      </div>

      {/* Menu chính */}
      <nav className="flex items-center flex-wrap gap-4 md:gap-6">
        <button
          onClick={() => handleNavigateCategory("tv-shows")}
          className="hover:text-red-500 transition"
        >
          TV Show
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-le")}
          className="hover:text-red-500 transition"
        >
          Phim Lẻ
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-bo")}
          className="hover:text-red-500 transition"
        >
          Phim Bộ
        </button>
        <button
          onClick={() => handleNavigateCategory("phim-dang-chieu")}
          className="hover:text-red-500 transition"
        >
          Phim Đang Chiếu
        </button>

        {/* Dropdown Thể loại */}
        <div className="relative group z-50">
          <button className="hover:text-red-500 transition">Thể loại ▾</button>
          <div className="absolute left-0 mt-2 w-52 bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 max-h-96 overflow-y-auto">
            {GENRES.map((genre) => (
              <button
                key={genre.slug}
                onClick={() => handleNavigateParam("genre", genre.slug)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Quốc gia */}
        <div className="relative group z-50">
          <button className="hover:text-red-500 transition">Quốc gia ▾</button>
          <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 max-h-96 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <button
                key={country.slug}
                onClick={() => handleNavigateParam("country", country.slug)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                {country.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Năm */}
        <div className="relative group z-50">
          <button className="hover:text-red-500 transition">Năm ▾</button>
          <div className="absolute left-0 mt-2 w-32 bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 max-h-96 overflow-y-auto">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => handleNavigateParam("year", String(year))}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Ô tìm kiếm */}
      <form
        onSubmit={handleSearch}
        className="flex items-center max-w-lg w-full md:w-auto"
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 21 21"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="voice-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-full focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Tìm phim..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-r-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          Tìm
        </button>
      </form>
    </header>
  );
}
