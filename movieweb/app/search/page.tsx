"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
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
  keyword?: string;
  category?: string;
  genre?: string;
  year?: string;
  country?: string;
}

const CATEGORIES = [
  { slug: "phim-le", label: "Phim Lẻ" },
  { slug: "phim-bo", label: "Phim Bộ" },
  { slug: "tv-shows", label: "TV Shows" },
  { slug: "phim-dang-chieu", label: "Phim Đang Chiếu" },
];

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Đọc params từ URL
  useEffect(() => {
    setFilters({
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      genre: searchParams.get("genre") || "",
      country: searchParams.get("country") || "",
      year: searchParams.get("year") || "",
    });
    setPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // 🔹 Hàm tạo query URL
  const buildQuery = (overrides: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams();
    const merged = { ...filters, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) q.set(k, String(v));
    });
    return `/search?${q.toString()}`;
  };

  const updateUrl = (overrides: Record<string, string | number | undefined>) => {
    router.push(buildQuery(overrides));
  };

  // 🔹 Clear filters
  const clearFilters = () => {
    updateUrl({
      keyword: undefined,
      category: undefined,
      genre: undefined,
      country: undefined,
      year: undefined,
      page: 1,
    });
    setFilters({});
  };

  // 🔹 Fetch phim
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = "";

      // ✅ Nếu có keyword → gọi API search
      if (filters.keyword) {
        apiUrl = `/api/films/search?keyword=${encodeURIComponent(filters.keyword)}&page=${page}&limit=10`;
      }
      // ✅ Nếu không có keyword → gọi các API danh sách tương ứng
      else if (filters.category)
        apiUrl = `/api/films/danh-sach/${filters.category}?page=${page}&limit=10`;
      else if (filters.genre)
        apiUrl = `/api/films/the-loai/${filters.genre}?page=${page}&limit=10`;
      else if (filters.country)
        apiUrl = `/api/films/quoc-gia/${filters.country}?page=${page}&limit=10`;
      else if (filters.year)
        apiUrl = `/api/films/nam-phat-hanh/${filters.year}?page=${page}&limit=10`;
      else apiUrl = `/api/films/phim-moi-cap-nhat?page=${page}&limit=10`;

      const res = await fetch(apiUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMovies(data.items || data.data?.items || []);
      setTotalPages(data?.paginate?.total_page || 1);
    } catch (err) {
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
    if (filters.keyword)
      return `Kết quả tìm kiếm cho: "${filters.keyword}"`;
    if (filters.category)
      return `Danh mục: ${
        CATEGORIES.find((c) => c.slug === filters.category)?.label || filters.category
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

  const hasActiveFilters =
    filters.keyword || filters.category || filters.genre || filters.country || filters.year;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4 sm:px-6 md:px-10 py-6">

      {/* Tiêu đề */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-gray-700/50 pb-4 text-center bg-gradient-to-r from-yellow-500/20 to-transparent rounded-lg">
        {getTitle()}
      </h2>

      {/* Danh sách phim */}
      {loading ? (
        <div className="flex flex-col justify-center items-center text-gray-400 py-20 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
          <p className="text-lg">Đang tải phim...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-gray-400 py-20 space-y-4">
          <Search className="w-16 h-16 opacity-50" />
          <p className="text-xl text-center">Không tìm thấy phim nào phù hợp.</p>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5 mb-8">
          {movies.map((movie, i) => (
            <div
              key={movie.slug || movie.id || i}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 border border-gray-700/50"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 px-4">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="p-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full font-bold shadow-md">
            <span className="text-sm">{page}</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm">{totalPages}</span>
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="p-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-950 to-black text-white text-xl">
          <div className="flex items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            Đang tải trang tìm kiếm...
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}