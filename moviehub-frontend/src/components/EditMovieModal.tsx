/* SUBEDI RABIN M25W0465 */
import { useState, useEffect } from "react";
import api from "../api/axios";
import type { FormEvent } from "react";
import { AxiosError } from "axios";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  posterUrl: string;
  trailerUrl: string;
  videoUrl: string;
}

interface EditMovieModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onRefresh: (msg?: { type: string; text: string }) => void;
}

interface ApiError {
  message?: string;
}

const EditMovieModal = ({ isOpen, movie, onClose, onRefresh }: EditMovieModalProps) => {
  const [formData, setFormData] = useState<Movie | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData(movie);
    }
  }, [movie]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData || !formData.id) return;

    setIsSubmitting(true);
    try {
      const cleanPayload = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        releaseYear: Number(formData.releaseYear),
        posterUrl: formData.posterUrl,
        trailerUrl: formData.trailerUrl,
        videoUrl: formData.videoUrl
      };

      await api.put(`/movies/${formData.id}`, cleanPayload);      
      
      // Close Modal immediately like AddMovieModal
      onClose();

      // Trigger success toast in parent
      onRefresh({ 
        type: "success", 
        text: `"${formData.title}" updated successfully!` 
      });

    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      const msg = error.response?.status === 403 
        ? "Access Denied: Check SecurityConfig" 
        : (error.response?.data?.message || "Server Error");
      
      onRefresh({ 
        type: "error", 
        text: `Update failed: ${msg}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-auto">
        
        {/* Header - Styled like AddMovieModal */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Edit <span className="text-red-600">Movie</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Update Existing Entry</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form - Styled like AddMovieModal */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Movie Title</label>
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Description</label>
            <textarea 
              required rows={3}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Genre - Syncing with AddModal select style */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Genre</label>
            <select 
              required 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white appearance-none"
              value={formData.genre} 
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
            >
              <option value="" className="bg-black">Select Genre</option>
              <option value="Action" className="bg-black">Action</option>
              <option value="Horror" className="bg-black">Horror</option>
              <option value="Comedy" className="bg-black">Comedy</option>
              <option value="Drama" className="bg-black">Drama</option>
              <option value="Sci-Fi" className="bg-black">Sci-Fi</option>
              <option value="New" className="bg-black">New</option>
            </select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Release Year</label>
            <input 
              type="number" required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white"
              value={formData.releaseYear}
              onChange={(e) => setFormData({...formData, releaseYear: parseInt(e.target.value) || 0})}
            />
          </div>

          {/* Poster URL */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Poster Image URL</label>
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white"
              value={formData.posterUrl}
              onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
            />
          </div>

          {/* Trailer ID */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Trailer ID / URL</label>
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white"
              value={formData.trailerUrl}
              onChange={(e) => setFormData({...formData, trailerUrl: e.target.value})}
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Video Source URL</label>
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm text-white"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all text-white ${
                isSubmitting 
                ? "bg-gray-700 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
              }`}
            >
              {isSubmitting ? "Processing..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;