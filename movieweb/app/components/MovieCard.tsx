import Link from "next/link";

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Link href={`/film/${movie.slug}`} className="block bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src={movie.poster_url || movie.thumb_url}
        alt={movie.name}
        className="w-full h-[300px] object-cover"
      />
      <div className="p-3 text-white">
        <h3 className="text-sm font-semibold line-clamp-2">{movie.name}</h3>
      </div>
    </Link>
  );
}
