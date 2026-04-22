/* SUBEDI RABIN M25W0465 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import type { Movie } from '../types/movie';

interface MovieProps {
  movie: Movie;
  // Updated to handle the "added" or "removed" status
  onRemove?: (status: "added" | "removed") => void; 
}

const MovieCard: React.FC<MovieProps> = ({ movie, onRemove }) => {
  return (
    <div className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#1a1a1a] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-900/20">
      
      {/* 1. Background Poster */}
      <img 
        src={movie.posterUrl} 
        alt={movie.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* 2. Intelligent Overlays */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* 3. Action Buttons (Top) */}
      <div className="absolute top-3 right-3 z-30 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-full hover:bg-white/20">
          {/*  Passing the onRemove function which now expects a status string */}
          <FavoriteButton 
            movieId={movie.id} 
            onRemove={(status) => onRemove?.(status)} 
          />
        </div>
      </div>

      {/* 4. Center Play Icon */}
      <Link 
        to={`/movies/${movie.id}`}
        className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play fill="white" size={28} className="ml-1" />
        </div>
      </Link>

      {/* 5. Floating Content Info (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-red-600 text-[10px] font-bold text-white rounded uppercase tracking-wider">
                New
            </span>
            <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{movie.averageRating}</span>
            </div>
        </div>

        <h3 className="text-white font-extrabold text-lg leading-tight mb-1 drop-shadow-md">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-gray-300 font-medium">
          <div className="flex gap-2">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span className="text-gray-400">{movie.genre}</span>
          </div>
          
          <Link 
            to={`/movies/${movie.id}`} 
            className="flex items-center gap-1 text-white hover:text-red-500 transition-colors"
          >
            <Info size={14} />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;