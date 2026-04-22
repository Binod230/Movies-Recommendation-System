/* SUBEDI RABIN M25W0465 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import type { Movie } from '../types/movie';

interface MovieProps {
  movie: Movie;
}

const HomeMovieCard: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className="group relative w-full flex flex-col transition-all duration-300">
      {/* 1. Poster Container - Vertical Aspect Ratio */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] group-hover:ring-2 group-hover:ring-red-600/50">
        
        {/* Background Image */}
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Favorite Button (Visible on hover) */}
        <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            <FavoriteButton movieId={movie.id} />
          </div>
        </div>

        {/* Hover Action Overlay */}
        <Link 
          to={`/movies/${movie.id}`} 
          className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
        >
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <Play fill="white" size={24} className="ml-1" />
          </div>
        </Link>
      </div>

      {/* 2. Text Info (Below Poster) */}
      <div className="mt-4 px-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] font-black text-white">{movie.averageRating}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{movie.releaseYear}</span>
        </div>
        
        <h4 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors duration-300 uppercase tracking-tight">
          {movie.title}
        </h4>
        
        <p className="text-[10px] text-gray-500 font-medium mt-0.5 truncate uppercase tracking-tighter italic">
          {movie.genre}
        </p>
      </div>
    </div>
  );
};

export default HomeMovieCard;