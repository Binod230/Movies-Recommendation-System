/* SUBEDI RABIN M25W0465 */
import { useState } from "react";
import api from "../api/axios";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: (msg?: { type: string; text: string }) => void;
}

const AddMovieModal = ({ isOpen, onClose, onRefresh }: AddMovieModalProps) => {
  const initialFormState = {
    title: "",
    description: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    posterUrl: "",
    trailerUrl: "",
    videoUrl: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("movies", formData);
      
      // 1. Reset Form State
      setFormData(initialFormState);

      // 2. Close Modal
      onClose();

      // 3. Send success message to parent dashboard (Triggers Smoked Glass Toast)
      onRefresh({ 
        type: "success", 
        text: `"${formData.title}" has been successfully Added.` 
      });
      
    } catch (error) {
      console.error("Error adding movie:", error);
      // Instead of alert(), we send an error message to the parent toast system
      onRefresh({ 
        type: "error", 
        text: "System Error: Failed to upload movie data." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl my-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">
              Add <span className="text-red-600">New Movie</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Data Entry Portal</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Movie Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Inception"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Description</label>
            <textarea 
              required 
              rows={3} 
              placeholder="Write a brief overview..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm resize-none"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* Genre - Changed to Dropdown to maintain data integrity */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Genre</label>
            <select 
              required 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm appearance-none"
              value={formData.genre} 
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
            >
              <option value="" className="bg-black">Select Genre</option>
              <option value="Action" className="bg-black">Action</option>
              <option value="Horror" className="bg-black">Horror</option>
              <option value="Comedy" className="bg-black">Comedy</option>
              <option value="Drama" className="bg-black">Drama</option>
                <option value="Romance" className="bg-black">Romance</option>
              <option value="Adventure" className="bg-black">Adventure</option>
                <option value="Adventure" className="bg-black">Social Drama</option>
            </select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Release Year</label>
            <input 
              type="number" 
              required 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm"
              value={formData.releaseYear} 
              onChange={(e) => setFormData({...formData, releaseYear: parseInt(e.target.value)})} 
            />
          </div>

          {/* URL Fields */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Poster Image URL</label>
            <input 
              type="text" 
              required 
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm"
              value={formData.posterUrl} 
              onChange={(e) => setFormData({...formData, posterUrl: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Trailer ID / URL</label>
            <input 
              type="text" 
              required 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm"
              value={formData.trailerUrl} 
              onChange={(e) => setFormData({...formData, trailerUrl: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Video Source URL</label>
            <input 
              type="text" 
              required 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-medium text-sm"
              value={formData.videoUrl} 
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} 
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all ${
                isSubmitting 
                ? "bg-gray-700 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
              }`}
            >
              {isSubmitting ? "Processing..." : "Upload Movie Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;