"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function WatchPage() {
  const pathname = usePathname(); // ví dụ: /watch/hen-ho-voi-ban-toi-di
  const slug = pathname.split("/").pop() || ""; // lấy slug từ URL
  const searchParams = useSearchParams();
  const epIndex = Number(searchParams.get("episode") || 0);

  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`https://phim.nguonc.com/api/film/${slug}`)
      .then(res => res.json())
      .then(data => setMovie(data.movie))
      .catch(console.error);
  }, [slug]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Đang tải phim...
      </div>
    );
  }

  const currentEpisode = movie.episodes[0]?.items[epIndex];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 sm:px-6 lg:px-8 py-10">
      
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">{movie.name}</h1>

      {/* Player */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-6">
        {currentEpisode ? (
          <iframe
            src={currentEpisode.embed}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Tập này không tồn tại
          </div>
        )}
      </div>

      {/* Episode list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Danh sách tập</h2>
        <div className="flex flex-wrap gap-3">
          {movie.episodes[0]?.items.map((ep: any, i: number) => (
            <a
              key={i}
              href={`/watch/${slug}?episode=${i}`}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                i === epIndex
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
            >
              Tập {ep.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
