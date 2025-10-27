import Image from "next/image";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* Banner */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={movie.poster_url}
            alt={movie.name}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg animate-slideUp">
              {movie.name}
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base animate-fadeIn">
              {movie.time} • {movie.language} • {movie.quality}
            </p>
            <a
              href={`/watch/${movie.slug}?episode=0`}
              className="inline-block mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 transition text-white font-semibold rounded-lg shadow-lg animate-bounce"
            >
              Xem ngay
            </a>
          </div>
        </div>

        {/* Thông tin phim */}
        <div className="mt-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 animate-fadeIn">
            Thông tin phim
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed animate-fadeIn">
            {movie.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
            <p className="hover:text-red-600 transition"><strong>Đạo diễn:</strong> {movie.director || "Đang cập nhật"}</p>
            <p className="hover:text-red-600 transition"><strong>Diễn viên:</strong> {movie.casts}</p>
            <p className="hover:text-red-600 transition"><strong>Thể loại:</strong> {movie.category["2"]?.list.map((c: any) => c.name).join(", ")}</p>
            <p className="hover:text-red-600 transition"><strong>Năm:</strong> {movie.category["3"]?.list[0]?.name}</p>
            <p className="hover:text-red-600 transition"><strong>Quốc gia:</strong> {movie.category["4"]?.list[0]?.name}</p>
          </div>
        </div>

        {/* Danh sách tập phim */}
        <div className="mt-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Danh sách tập</h2>
          {movie.episodes?.map((server: any, i: number) => (
            <div key={i} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{server.server_name}</h3>
              <div className="flex flex-wrap gap-3">
                {server.items.map((ep: any, j: number) => (
                  <a
                    key={j}
                    href={`/watch/${movie.slug}?episode=${j}`}
                    className="px-5 py-2 rounded-full font-semibold transition-transform transform bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 hover:scale-105 shadow-md"
                  >
                    Tập {ep.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
