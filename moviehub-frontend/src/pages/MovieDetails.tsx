// SUBEDI RABIN M25W0465
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { AxiosError } from "axios";
import FavoriteButton from '../components/FavoriteButton';
import { CheckCircle, AlertCircle } from "lucide-react";

// 1. Interfaces
interface Review {
  id: number;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  averageRating: number;
  posterUrl: string;
  trailerUrl: string;
  videoUrl: string;
  userRating: number | null;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, userName } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<"trailer" | "movie">("trailer");

  // Logic states
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form State
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Auto-hide message after 4 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [movieRes, reviewsRes] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get(`/reviews/movie/${id}`)
      ]);
      setMovie(movieRes.data);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    setMessage({ type: "success", text: "Favorites list updated!" });
  };

  const hasUserReviewed = useMemo(() => {
    if (!reviews || !userName) return false;
    return reviews.some((r) => r.userName?.toLowerCase() === userName.toLowerCase());
  }, [reviews, userName]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/reviews/${id}`, { comment, rating: userRating });
      setComment("");
      setUserRating(5);
      const reviewsRes = await api.get(`/reviews/movie/${id}`);
      setReviews(reviewsRes.data);
      setMessage({ type: "success", text: "Review posted successfully!" });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMessage({ type: "error", text: error.response?.data?.message || "Error posting review" });
    } finally {
      setSubmitting(false);
    }
  };

  const videoId = useMemo(() => {
    if (!movie) return null;
    const url = activeVideo === "trailer" ? movie.trailerUrl : movie.videoUrl;
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [movie, activeVideo]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return <div className="min-h-screen bg-black text-white p-20 text-center font-black">MOVIE NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 relative selection:bg-red-600">
      
      {/* HERO SECTION */}
      <div className="relative min-h-[65vh] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
             style={{ backgroundImage: `url("${movie.posterUrl}")` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Featured</span>
            <span className="text-white-500 font-bold text-sm">{movie.averageRating?.toFixed(1) || "0.0"} / 5 Rating</span>
            <span className="text-gray-400 text-sm">{movie.genre}</span>
            <div className="ml-4 bg-white/10 hover:bg-white/20 transition-all rounded-full p-1 cursor-pointer" onClick={handleFavoriteClick}>
              <FavoriteButton movieId={movie.id} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none drop-shadow-2xl italic">{movie.title}</h1>
          
          <div className="max-w-2xl bg-black/10 backdrop-blur-sm p-2 rounded-lg">
            <p className={`text-lg text-gray-300 leading-relaxed font-medium transition-all duration-300 ${!showFullDescription ? "line-clamp-3" : ""}`}>
              {movie.description}
            </p>
            {movie.description.length > 150 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-red-600 font-black uppercase text-xs mt-2 hover:text-white transition-colors tracking-widest"
              >
                {showFullDescription ? "↑ See Less" : "↓ See More"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PLAYER SECTION */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 -mt-10 relative z-20">
        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl">
          <div className="flex gap-8 mb-6 ml-4">
            <button onClick={() => setActiveVideo("trailer")} 
              className={`uppercase font-black text-xs tracking-[0.2em] transition-all ${activeVideo === "trailer" ? "text-red-600" : "text-zinc-500 hover:text-white"}`}>
              Trailer
            </button>
            <button onClick={() => setActiveVideo("movie")} 
              className={`uppercase font-black text-xs tracking-[0.2em] transition-all ${activeVideo === "movie" ? "text-red-600" : "text-zinc-500 hover:text-white"}`}>
              Watch Full
            </button>
          </div>

          <div className="relative pt-[56.25%] rounded-3xl overflow-hidden bg-black ring-1 ring-white/10">
            {videoId ? (
              <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`} title="Player" frameBorder="0" allowFullScreen></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-700 uppercase font-black text-xs tracking-widest italic">Source Coming Soon</div>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 mt-24 grid md:grid-cols-3 gap-16">
        <div className="md:col-span-1">
          <h3 className="text-xl font-black uppercase mb-8 italic">Your Review</h3>
          {!isAuthenticated ? (
            <div className="bg-zinc-900/40 p-10 rounded-3xl border border-white/5 text-center">
              <Link to="/login" className="inline-block bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">Sign In</Link>
            </div>
          ) : hasUserReviewed ? (
            <div className="bg-zinc-900/60 p-10 rounded-3xl border border-red-600/20 text-center text-red-600 font-black uppercase tracking-widest italic">Feedback Recorded</div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setUserRating(s)} className={`text-3xl transition-transform hover:scale-110 ${userRating >= s ? "text-red-600" : "text-zinc-800"}`}>★</button>
                ))}
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="WRITE A REVIEW..." className="w-full bg-zinc-800/30 border border-white/5 rounded-2xl p-5 text-sm h-40 focus:ring-1 ring-red-600 outline-none uppercase font-bold" required />
              <button disabled={submitting} className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all">
                {submitting ? "POSTING..." : "SUBMIT REVIEW"}
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-black uppercase mb-8 italic">Community Reviews</h3>
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-zinc-900/20 p-8 rounded-3xl border border-white/5 transition-colors hover:bg-zinc-900/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-red-600 font-black uppercase text-xs mb-1 italic tracking-widest">
                      {r.userName} {r.userName.toLowerCase() === userName?.toLowerCase() && "(YOU)"}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-[10px] ${r.rating >= star ? "text-yellow-500" : "text-zinc-800"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 leading-relaxed italic font-medium">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING ALERT UI */}
      {message.text && (
        <div className={`fixed bottom-10 right-10 flex flex-col overflow-hidden rounded-xl shadow-2xl z-50 transition-all duration-500 transform translate-y-0 opacity-100 ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          <div className="flex items-center gap-3 px-6 py-4">
            {message.type === "success" ? <CheckCircle size={20} className="text-white" /> : <AlertCircle size={20} className="text-white" />}
            <span className="font-bold text-sm uppercase tracking-wider text-white">{message.text}</span>
          </div>
          <div className="h-1 bg-black/20 w-full">
            <div className="h-full bg-white/50" style={{ animation: "shrink 4s linear forwards" }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
};

export default MovieDetails;