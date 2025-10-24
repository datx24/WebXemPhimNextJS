import Image from "next/image";

interface MovieDetailProps {
  params: Promise<{ slug: string }>; // ✅ params giờ là Promise
}

async function getMovieDetail(slug: string) {
  const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Không thể tải dữ liệu phim");
  }

  const data = await res.json();
  return data.movie;
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const { slug } = await params; // ✅ unwrap Promise
  const movie = await getMovieDetail(slug);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto py-10 px-6">
        {/* Banner */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
          <Image
            src={movie.thumb_url}
            alt={movie.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold text-white">{movie.name}</h1>
            <p className="text-gray-300 mt-2">
              {movie.time} • {movie.language} • {movie.quality}
            </p>
          </div>
        </div>

        {/* Thông tin phim */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Giới thiệu phim</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {movie.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
            <p><strong>Đạo diễn:</strong> {movie.director || "Đang cập nhật"}</p>
            <p><strong>Diễn viên:</strong> {movie.casts || "Đang cập nhật"}</p>
            <p><strong>Thể loại:</strong> {movie.category["2"]?.list?.map((c: any) => c.name).join(", ")}</p>
            <p><strong>Năm:</strong> {movie.category["3"]?.list?.[0]?.name}</p>
            <p><strong>Quốc gia:</strong> {movie.category["4"]?.list?.[0]?.name}</p>
          </div>
        </div>

        {/* Danh sách tập phim */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Danh sách tập</h2>
          {movie.episodes?.map((server: any, i: number) => (
            <div key={i} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{server.server_name}</h3>
              <div className="flex flex-wrap gap-3">
                {server.items.map((ep: any, j: number) => (
                  <a
                    key={j}
                    href={ep.embed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    {ep.name}
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
