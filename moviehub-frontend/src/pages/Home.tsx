// SUBEDI RABIN M25W0465
import { useEffect, useState, useRef } from "react";
import { getAllMovies, getRecommendedMovies } from "../api/movieApi";
import MovieCard from "../components/MovieCard"; 
import type { Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { 
  CheckCircle, 
  AlertCircle,
  Sparkles,

} from "lucide-react";

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalElements_count?: number;
  totalPages: number;
  size: number;
  number: number;
}

const Home = () => {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Mouse Drag Scroll State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. Auto-hide notification alerts
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 2. Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [allMoviesRes, recMoviesRes] = await Promise.allSettled([
          getAllMovies(),
          getRecommendedMovies()
        ]);

        if (allMoviesRes.status === "fulfilled") {
          const data = allMoviesRes.value;
          const movieArray = Array.isArray(data) ? data : (data as PaginatedResponse<Movie>).content;
          setMovies(movieArray || []);
          setRecentMovies(movieArray?.slice(0, 4) || []);
        } else {
          setError("Failed to synchronize movie library.");
        }

        if (recMoviesRes.status === "fulfilled") {
          const recData = recMoviesRes.value;
          const recArray = Array.isArray(recData) ? recData : (recData as PaginatedResponse<Movie>).content;
          setRecommendations(recArray || []);
        }

      } catch (err) {
        console.error("Home Page Fetch Error:", err);
        setError("Network connection interrupted.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. 🖱️ Drag-to-Scroll Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    // Calculate start position
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleFavoriteToggle = (title: string, status: "added" | "removed") => {
    if (status === "added") {
      setMessage({ type: "success", text: `Added "${title}" to favorites!` });
    } else {
      setMessage({ type: "error", text: `Removed "${title}" from favorites!` });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600 overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center px-6 md:px-12 overflow-hidden mb-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-2xl">
          <h2 className="text-6xl md:text-8xl font-black leading-tight uppercase italic tracking-tighter text-white">
            Movie<span className="text-red-600">Hub</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg font-medium max-w-lg leading-relaxed">
            Your cinematic library, perfectly synchronized.
          </p>
        </div>
      </section>

      {/* Error Feedback */}
      {error && (
        <div className="mx-6 md:mx-12 p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* 2. Popular Section (Drag-to-Slide) */}
      <section className="px-6 md:px-12 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Popular on <span className="text-red-600">MovieHub</span>
          </h1>
          <div className="h-1 w-20 bg-red-600 mt-2"></div>
        </header>

        {loading && movies.length === 0 ? (
          <div className="flex justify-center py-20 animate-pulse text-red-600 font-bold uppercase tracking-[0.3em]">
            Syncing Assets...
          </div>
        ) : (
          <div className="relative group">
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex gap-6 overflow-x-auto no-scrollbar pb-10 cursor-grab active:cursor-grabbing select-none scroll-smooth ${isDragging ? 'scroll-auto' : ''}`}
            >
              {movies.map((movie) => (
                <div 
                  key={`pop-${movie.id}`} 
                  className="flex-none w-[70%] sm:w-[40%] lg:w-[25%] xl:w-[20%]"
                >
                  <MovieCard 
                    movie={movie} 
                    onRemove={(status) => handleFavoriteToggle(movie.title, status)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. New Arrivals Static Grid */}
      <section className="px-6 md:px-12 py-20 mt-10 relative">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/3">
            <h2 className="text-5xl font-black uppercase italic leading-[0.9] tracking-tighter">
              New <br /> 
              <span className="text-red-600 text-7xl">Arrivals</span>
            </h2>
            <p className="text-gray-500 mt-8 text-sm font-medium leading-relaxed max-w-sm">
              Daily synchronization with global movie databases.
            </p>
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentMovies.map((movie) => (
              <div 
                key={`arr-${movie.id}`} 
                onClick={() => navigate(`/movies/${movie.id}`)}
                className="group relative h-56 rounded-[2rem] overflow-hidden border border-white/10 bg-[#0f0f0f] cursor-pointer hover:border-red-600/50 transition-all duration-300"
              >
                <img 
                  src={movie.posterUrl} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-transform duration-700" 
                  alt={movie.title} 
                />
                
                {/* Visual Overlay for "View Detail" hint */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-red-600 p-2 rounded-full">
                      <Sparkles size={16} className="text-white" />
                   </div>
                </div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent text-white">
                  <h4 className="font-black uppercase tracking-tighter text-2xl leading-none group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-white/50 font-bold uppercase">
                    <span>{movie.genre}</span>
                    <span className="w-1 h-1 rounded-full bg-red-600"></span>
                    <span>{movie.releaseYear}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recommendations Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-transparent via-red-900/5 to-transparent">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Recommended <span className="text-red-600">For You</span></h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Based on your activity & favorites</p>
            </div>
          </div>
        </header>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {recommendations.map((movie) => (
              <div key={`rec-${movie.id}`} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <MovieCard 
                  movie={movie} 
                  onRemove={(status) => handleFavoriteToggle(movie.title, status)} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">
                {loading ? "Generating suggestions..." : "Start liking movies to see recommendations"}
              </p>
          </div>
        )}
      </section>

      {/* 5. Floating Alert Notification */}
      {message.text && (
        <div className={`fixed bottom-10 right-10 flex flex-col overflow-hidden rounded-2xl z-[100] shadow-2xl transition-all duration-500 animate-in slide-in-from-right ${
          message.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          <div className="flex items-center gap-4 px-8 py-5 text-white">
            {message.type === "success" ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
            <span className="font-black text-[12px] uppercase tracking-widest">{message.text}</span>
          </div>
          <div className="h-1.5 bg-black/20 w-full">
            <div className="h-full bg-white/40 animate-shrink" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      )}
        <Footer></Footer>
      {/*<footer className="border-t border-white/5 py-16 mt-20 text-center text-gray-600 text-[10px] tracking-[0.4em] uppercase font-bold">*/}
      {/*    &copy; 2026 MOVIEHUB ENGINE.*/}
      {/*</footer>*/}

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        .animate-shrink { animation: shrink linear forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;