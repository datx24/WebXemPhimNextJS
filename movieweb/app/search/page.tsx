"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";
import { GENRES, COUNTRIES, YEARS } from "../utils/constants";

interface Movie {
  id?: number;
  slug?: string;
  title?: string;
  name?: string;
  year?: number;
  country?: { name: string; slug: string };
  category?: { name: string; slug: string }[];
  poster_url?: string;
}

interface FilterOptions {
  category?: string;
  genre?: string;
  year?: string;
  country?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();

  // ✅ Lấy các param từ URL (reactive)
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const genre = searchParams.get("genre") || "";
  const country = searchParams.get("country") || "";
  const year = searchParams.get("year") || "";

  const [filters, setFilters] = useState<FilterOptions>({
    category,
    genre,
    country,
    year,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Cập nhật filter khi URL thay đổi
  useEffect(() => {
    setFilters({ category, genre, country, year });
    setPage(1);
  }, [category, genre, country, year]);

  // ✅ Fetch API phim
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = "";

      if (keyword) {
        apiUrl = `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`;
      } else if (filters.category) {
        apiUrl = `https://phim.nguonc.com/api/films/danh-sach/${filters.category}?page=${page}`;
      } else if (filters.genre) {
        apiUrl = `https://phim.nguonc.com/api/films/the-loai/${filters.genre}?page=${page}`;
      } else if (filters.country) {
        apiUrl = `https://phim.nguonc.com/api/films/quoc-gia/${filters.country}?page=${page}`;
      } else if (filters.year) {
        apiUrl = `https://phim.nguonc.com/api/films/nam-phat-hanh/${filters.year}?page=${page}`;
      } else {
        apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;
      }

      const res = await fetch(apiUrl, { cache: "no-store" });
      const data = await res.json();

      setMovies(data.items || data.data?.items || []);
      setTotalPages(data?.paginate?.total_page || 1);
    } catch (error) {
      console.error("❌ Lỗi fetch phim:", error);
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gọi API mỗi khi filter, keyword, page thay đổi
  useEffect(() => {
    fetchMovies();
  }, [filters, keyword, page]);

  // ✅ Cập nhật filter thủ công (dropdown)
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // ✅ Tiêu đề hiển thị
  const getTitle = () => {
    if (keyword) return `Kết quả tìm kiếm cho: "${keyword}"`;
    if (filters.category)
      return `Danh mục: ${
        filters.category
          .replace("phim-le", "Phim Lẻ")
          .replace("phim-bo", "Phim Bộ")
          .replace("tv-shows", "TV Show")
          .replace("phim-dang-chieu", "Phim Đang Chiếu")
      }`;
    if (filters.genre)
      return `Thể loại: ${
        GENRES.find((g) => g.slug === filters.genre)?.label || filters.genre
      }`;
    if (filters.country)
      return `Quốc gia: ${
        COUNTRIES.find((c) => c.slug === filters.country)?.label ||
        filters.country
      }`;
    if (filters.year) return `Năm phát hành: ${filters.year}`;
    return "Tất cả phim";
  };

  return (
    <div className="p-6 md:p-10 text-white min-h-screen bg-gray-900">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
        {getTitle()}
      </h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Danh mục */}
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">Danh mục</option>
          <option value="phim-le">Phim lẻ</option>
          <option value="phim-bo">Phim bộ</option>
          <option value="tv-shows">TV Shows</option>
          <option value="phim-dang-chieu">Phim đang chiếu</option>
        </select>

        {/* Thể loại */}
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          value={filters.genre}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
        >
          <option value="">Thể loại</option>
          {GENRES.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.label}
            </option>
          ))}
        </select>

        {/* Quốc gia */}
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          value={filters.country}
          onChange={(e) => handleFilterChange("country", e.target.value)}
        >
          <option value="">Quốc gia</option>
          {COUNTRIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Năm */}
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          value={filters.year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
        >
          <option value="">Năm</option>
          {YEARS.map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách phim */}
      {loading ? (
        <div className="text-center text-lg text-gray-400 animate-pulse">
          Đang tải phim...
        </div>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          Không tìm thấy phim nào.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {movies.map((movie, index) => (
            <MovieCard key={movie.slug || index} movie={movie} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
        >
          Prev
        </button>
        <span className="px-5 py-2 bg-red-600 rounded-lg font-semibold">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
