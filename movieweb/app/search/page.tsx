import MovieCard from "../components/MovieCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  // ✅ unwrap Promise
  const params = await searchParams;
  const keyword = params.keyword || "";

  let movies: any[] = [];

  if (keyword) {
    const res = await fetch(
      `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(keyword)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      movies = data.items || [];
    }
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho: <span className="text-red-600">{keyword}</span>
      </h2>

      {movies.length === 0 ? (
        <p>Không tìm thấy phim nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
