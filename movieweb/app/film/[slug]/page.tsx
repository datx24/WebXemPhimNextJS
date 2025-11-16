import Image from "next/image";
import { Play, Film, User, Tag, Calendar, Globe, ChevronRight } from "lucide-react";

interface MovieDetailProps {
  params: Promise<{ slug: string }>; // params là Promise
}

async function getMovieDetail(slug: string) {
  const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Không thể tải dữ liệu phim");

  const data = await res.json();
  return data.movie;
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <div className="mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Banner */}
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
          <Image
            src={movie.poster_url}
            alt={movie.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-2xl animate-slideUp">
              {movie.name}
            </h1>
            <div className="flex items-center space-x-4 text-gray-200 text-sm sm:text-lg animate-fadeIn">
              <span className="flex items-center space-x-1">
                <Film className="w-4 h-4" />
                <span>{movie.time}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{movie.language}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{movie.quality}</span>
              </span>
            </div>
            <a
              href={`/watch/${movie.slug}?episode=0`}
              className="inline-flex items-center space-x-2 mt-4 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl animate-bounce"
            >
              <Play className="w-5 h-5" />
              <span>Xem ngay</span>
            </a>
          </div>
        </div>

        {/* Thông tin phim */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <Film className="w-7 h-7 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 animate-fadeIn">
                Thông tin phim
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg animate-fadeIn">
              {movie.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <User className="w-5 h-5 text-blue-500" />
                <span>Đạo diễn & Diễn viên</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong className="text-gray-800 dark:text-gray-100">Đạo diễn:</strong> {movie.director || "Đang cập nhật"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-100">Diễn viên:</strong> {movie.casts}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Tag className="w-5 h-5 text-purple-500" />
                <span>Thể loại & Năm</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong className="text-gray-800 dark:text-gray-100">Thể loại:</strong> {movie.category["2"]?.list.map((c: any) => c.name).join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-100">Năm:</strong> {movie.category["3"]?.list[0]?.name}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Globe className="w-5 h-5 text-green-500" />
                <span>Quốc gia</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-gray-100">Quốc gia:</strong> {movie.category["4"]?.list[0]?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách tập phim */}
        <div className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center space-x-3 mb-8">
            <Film className="w-7 h-7 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 animate-fadeIn">
              Danh sách tập
            </h2>
          </div>
          <div className="space-y-8">
            {movie.episodes?.map((server: any, i: number) => (
              <div key={i} className="group">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-between text-gray-800 dark:text-gray-100">
                  <span className="flex items-center space-x-2">
                    <Film className="w-5 h-5 text-indigo-500" />
                    <span>{server.server_name}</span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </h3>
                <div className="flex flex-wrap gap-3">
                  {server.items.map((ep: any, j: number) => (
                    <a
                      key={j}
                      href={`/watch/${movie.slug}?episode=${j}`}
                      className="group/ep inline-flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <Play className="w-4 h-4 group-hover/ep:rotate-12 transition-transform" />
                      <span>Tập {ep.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}