import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";

interface MiniMovieCardProps {
  movie: any;
}

export default function MiniMovieCard({ movie }: MiniMovieCardProps) {
  const name = movie.name || "Unknown Movie";
  const originalName = movie.original_name || ""; 
  const time = movie.time || "N/A"; 
  const quality = movie.quality || "HD";
  const rating = movie.rating || 0; 
  const currentEpisode = movie.current_episode || ""; 
  const totalEpisodes = movie.total_episodes || 0;
  const episodesInfo = currentEpisode ? `${currentEpisode} / ${totalEpisodes}` : quality;

  return (
    <Link href={`/film/${movie.slug}`} className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-black/50 border border-gray-700/50 shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300">
      {/* Image Container with Skew Effect */}
      <div className="relative w-full h-[200px] md:h-[220px] overflow-hidden">
        <div className="absolute inset-0 transform -skew-x-6 origin-center group-hover:skew-x-0 transition-transform duration-500">
          <Image
            src={movie.poster_url || movie.thumb_url || "/placeholder-poster.jpg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-100 skew-x-6 origin-center"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white skew-x-6 origin-bottom">
        {/* Title */}
        <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1 drop-shadow-md -skew-x-6">
          {name}
        </h3>
        
        {originalName && (
          <p className="text-sm opacity-90 line-clamp-1 mb-2 drop-shadow-md -skew-x-6">
            {originalName}
          </p>
        )}
        
        {/* Bottom Info Bar */}
        <div className="flex items-center justify-between mb-2 -skew-x-6">
          <span className="text-xs bg-gray-700/50 px-2 py-1 rounded-full opacity-90">
            {episodesInfo}
          </span>
          <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-300">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Details */}
        <p className="text-xs text-gray-300 line-clamp-1 -skew-x-6">
          {time}
        </p>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}