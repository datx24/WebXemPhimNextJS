"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, PlayIcon } from "@heroicons/react/24/outline"; // Giả sử bạn đã cài @heroicons/react

export default function WatchPage() {
  const pathname = usePathname(); // ví dụ: /watch/hen-ho-voi-ban-toi-di
  const slug = pathname.split("/").pop() || ""; // lấy slug từ URL
  const searchParams = useSearchParams();
  const epIndex = Number(searchParams.get("episode") || 0);

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`https://phim.nguonc.com/api/film/${slug}`)
      .then(res => res.json())
      .then(data => setMovie(data.movie))
      .catch(error => {
        console.error(error);
        // Có thể thêm toast notification ở đây nếu dùng thư viện như react-hot-toast
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Không tìm thấy phim</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  const currentEpisode = movie.episodes[0]?.items[epIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header với back button */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Quay lại
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1 truncate px-4">
            {movie.name}
          </h1>
          <div className="w-10"></div> {/* Spacer cho back button */}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Player với overlay */}
        <div className="relative mb-8">
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black/20 dark:bg-black/40">
            {currentEpisode ? (
              <iframe
                src={currentEpisode.embed}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title={movie.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                <PlayIcon className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium">Tập này không tồn tại</p>
                <p className="text-sm mt-1">Vui lòng chọn tập khác</p>
              </div>
            )}
          </div>
          {/* Thumbnail hoặc poster nếu có */}
          {movie.poster && (
            <img
              src={movie.poster}
              alt={movie.name}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-32 rounded-xl shadow-lg border-2 border-white/50 dark:border-gray-700/50 object-cover z-10"
            />
          )}
        </div>

        {/* Episode list với grid và icons */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <PlayIcon className="h-6 w-6 mr-2 text-yellow-600" />
            Danh sách tập phim
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {movie.episodes[0]?.items.map((ep: any, i: number) => (
              <a
                key={i}
                href={`/watch/${slug}?episode=${i}`}
                className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center overflow-hidden ${
                  i === epIndex
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md transform hover:scale-102 hover:border hover:border-yellow-300"
                }`}
              >
                {/* Badge cho tập hiện tại */}
                {i === epIndex && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Đang xem
                  </div>
                )}
                <span className="relative z-10">Tập {ep.name}</span>
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </a>
            ))}
          </div>
          {movie.episodes[0]?.items.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 italic">
              Chưa có tập phim nào
            </p>
          )}
        </div>

        {/* Thêm info phim nếu cần */}
        {movie.description && (
          <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30">
            <h3 className="text-xl font-semibold mb-3">Mô tả</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{movie.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}