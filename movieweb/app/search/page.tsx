"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterOptions>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Đọc params từ URL
  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      genre: searchParams.get("genre") || "",
      country: searchParams.get("country") || "",
      year: searchParams.get("year") || "",
    });
    setPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Hàm tạo query URL
  const buildQuery = (overrides: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    const merged = { ...filters, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) q.set(k, String(v));
    });
    if (page > 1) q.set("page", String(page));
    return `/search?${q.toString()}`;
  };

  const updateUrl = (overrides: Record<string, string | number | undefined>) => {
    router.push(buildQuery(overrides));
  };

  // Fetch phim
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = "";

      if (filters.category)
        apiUrl = `/api/films/danh-sach/${filters.category}?page=${page}`;
      else if (filters.genre)
        apiUrl = `/api/films/the-loai/${filters.genre}?page=${page}`;
      else if (filters.country)
        apiUrl = `/api/films/quoc-gia/${filters.country}?page=${page}`;
      else if (filters.year)
        apiUrl = `/api/films/nam-phat-hanh/${filters.year}?page=${page}`;
      else apiUrl = `/api/films/phim-moi-cap-nhat?page=${page}`;

      const res = await fetch(apiUrl, { cache: "no-store" });
      const data = await res.json();

      setMovies(data.items || data.data?.items || []);
      setTotalPages(data?.paginate?.total_page || 1);
    } catch (err) {
      console.error("❌ Fetch phim lỗi:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [filters, page]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateUrl({ [key]: value || undefined, page: 1 });
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    updateUrl({ page: p });
  };

  const getTitle = () => {
    if (filters.category)
      return `Danh mục: ${
        filters.category
          .replace("phim-le", "Phim Lẻ")
          .replace("phim-bo", "Phim Bộ")
          .replace("tv-shows", "TV Shows")
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
    <div className="min-h-screen bg-gray-950 text-white px-6 md:px-10 py-8">
      {/* Tiêu đề */}
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3 text-center">
        {getTitle()}
      </h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Danh mục */}
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          value={filters.category || ""}
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
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          value={filters.genre || ""}
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
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          value={filters.country || ""}
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
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          value={filters.year || ""}
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
        <div className="text-center text-gray-400 animate-pulse text-lg py-20">
          ⏳ Đang tải phim...
        </div>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Không tìm thấy phim nào.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {movies.map((movie, i) => (
            <MovieCard key={movie.slug || movie.id || i} movie={movie} />
          ))}
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-6 mt-12">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="px-5 py-2 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition font-semibold"
        >
          ⬅️ Prev
        </button>
        <span className="px-5 py-2 bg-red-600 rounded-lg font-bold shadow-md">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-5 py-2 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition font-semibold"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center bg-black text-white text-xl">
          🔄 Đang tải trang tìm kiếm...
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
