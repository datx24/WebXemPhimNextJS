"use client";

import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

interface Movie {
  id?: number;
  slug?: string;
  name?: string;
  title?: string;
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

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    category?: string;
    genre?: string;
    country?: string;
    year?: string;
  }>;
}) {
  const [params, setParams] = useState<{
    keyword?: string;
    category?: string;
    genre?: string;
    country?: string;
    year?: string;
  }>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Nhận params từ URL (/search?category=phim-bo)
  useEffect(() => {
    (async () => {
      const p = await searchParams;
      setParams(p);

      // Nếu có category truyền từ Header thì setFilter ngay
      if (p.category) {
        setFilters({ category: p.category });
      }
    })();
  }, [searchParams]);

  // 🔹 Reset filters nếu có keyword (tìm kiếm)
  useEffect(() => {
    if (params.keyword) {
      setFilters({});
      setPage(1);
    }
  }, [params.keyword]);

  // 🔹 Hàm gọi API và lọc phim
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { genre, country, year, category } = filters;
      const keyword = params.keyword;

      // 🔸 Trường hợp tìm theo keyword (ưu tiên cao nhất)
      if (keyword && !genre && !country && !year && !category) {
        const res = await fetch(
          `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(
            keyword
          )}&page=${page}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setMovies(data.items || data.data?.items || []);
        setTotalPages(data?.paginate?.total_page || 1);
        setLoading(false);
        return;
      }

      // 🔸 Nếu có nhiều filter → gọi API lớn nhất rồi lọc cục bộ
      if ([category, genre, country, year, keyword].filter(Boolean).length > 1) {
        const res = await fetch(
          `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        let result: Movie[] = data.items || [];

        if (category)
          result = result.filter((m) =>
            m.category?.some((c) => c.slug === category)
          );

        if (genre)
          result = result.filter((m) =>
            m.category?.some((c) => c.slug === genre)
          );

        if (country)
          result = result.filter((m) => m.country?.slug === country);

        if (year)
          result = result.filter((m) => m.year?.toString() === year);

        if (keyword)
          result = result.filter((m) =>
            m.title?.toLowerCase().includes(keyword.toLowerCase())
          );

        setMovies(result);
        setTotalPages(data?.paginate?.total_page || 1);
      } else {
        // 🔸 Một điều kiện duy nhất → gọi API tương ứng
        let apiUrl = "";

        if (keyword) {
          apiUrl = `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(
            keyword
          )}&page=${page}`;
        } else if (category) {
          apiUrl = `https://phim.nguonc.com/api/films/danh-sach/${category}?page=${page}`;
        } else if (genre) {
          apiUrl = `https://phim.nguonc.com/api/films/the-loai/${genre}?page=${page}`;
        } else if (country) {
          apiUrl = `https://phim.nguonc.com/api/films/quoc-gia/${country}?page=${page}`;
        } else if (year) {
          apiUrl = `https://phim.nguonc.com/api/films/nam-phat-hanh/${year}?page=${page}`;
        } else {
          apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;
        }

        const res = await fetch(apiUrl, { cache: "no-store" });
        const data = await res.json();
        setMovies(data.items || data.data?.items || []);
        setTotalPages(data?.paginate?.total_page || 1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Gọi lại khi filter / keyword / page thay đổi
  useEffect(() => {
    fetchMovies();
  }, [filters, params.keyword, page]);

  // 🔹 Xử lý thay đổi filter
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  return (
    <div className="p-8 text-white">
      {/* 🔸 Tiêu đề */}
      <h2 className="text-2xl font-bold mb-4">
        {params.keyword
          ? `Kết quả tìm kiếm cho: ${params.keyword}`
          : filters.category
          ? `Danh mục: ${
              filters.category
                .replace("phim-le", "Phim Lẻ")
                .replace("phim-bo", "Phim Bộ")
                .replace("tv-shows", "TV Show")
                .replace("phim-dang-chieu", "Phim Đang Chiếu")
            }`
          : "Tất cả phim"}
      </h2>

      {/* 🎛 Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          onChange={(e) => handleFilterChange("category", e.target.value)}
          value={filters.category || ""}
        >
          <option value="">Danh mục</option>
          <option value="phim-le">Phim lẻ</option>
          <option value="phim-bo">Phim bộ</option>
          <option value="tv-shows">TV Shows</option>
        </select>

        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          value={filters.genre || ""}
        >
          <option value="">Thể loại</option>
          <option value="hanh-dong">Hành động</option>
          <option value="lang-man">Lãng mạn</option>
          <option value="hai">Hài</option>
        </select>

        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          onChange={(e) => handleFilterChange("year", e.target.value)}
          value={filters.year || ""}
        >
          <option value="">Năm</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-lg"
          onChange={(e) => handleFilterChange("country", e.target.value)}
          value={filters.country || ""}
        >
          <option value="">Quốc gia</option>
          <option value="han-quoc">Hàn Quốc</option>
          <option value="au-my">Âu Mỹ</option>
          <option value="trung-quoc">Trung Quốc</option>
        </select>
      </div>

      {/* 🎬 Danh sách phim */}
      {loading ? (
        <div>Đang tải phim...</div>
      ) : movies.length === 0 ? (
        <p>Không tìm thấy phim nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <MovieCard key={movie.slug || index} movie={movie} />
          ))}
        </div>
      )}

      {/* 📄 Phân trang */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-red-600 rounded-lg">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
