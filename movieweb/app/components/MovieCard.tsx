import Link from "next/link";
import { Star, Play, Clock } from "lucide-react";

export default function MovieCard({ movie }: { movie: any }) {
  const name = movie.name || movie.title || "Unknown Movie";
  const quality = movie.quality;
  const rating = movie.rating || 10; // Assuming rating might be available; fallback to 0

  return (
    <Link href={`/film/${movie.slug}`} className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 hover:brightness-110">
      {/* Image */}
      <div className="relative w-full h-[280px]">
        <img
          src={movie.poster_url || movie.thumb_url || "/placeholder-poster.jpg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full p-4 border border-yellow-500/30 shadow-2xl">
            <Play className="w-12 h-12 text-yellow-400 shadow-lg" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1 drop-shadow-md">
          {name}
        </h3>
        
        <div className="flex items-center justify-between text-xs opacity-90">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-300">{quality || "N/A"}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}