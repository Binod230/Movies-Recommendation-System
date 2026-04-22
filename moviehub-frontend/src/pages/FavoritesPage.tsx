// SUBEDI RABIN M25W0465
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { CheckCircle, AlertCircle } from "lucide-react";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const token = localStorage.getItem("token");

  //  Auto-hide message after 4 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await axios.get<Movie[]>("http://localhost:9292/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching favorites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  // Updated: Set type to "error" to make the alert RED
  const handleRemoveFromList = (movieId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== movieId)
    );
    // Setting type to "error" triggers the red background in your JSX below
    setMessage({ type: "error", text: "Removed from favorites!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]
       text-white flex items-center justify-center">
        <div className="animate-pulse font-black
         uppercase tracking-widest text-red-600">
          Loading Favorites...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
   

      <header className="mb-12 max-w-7xl mx-auto mt-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
          My <span className="text-red-600">Favorites</span>
        </h1>
        <div className="h-1 w-20 bg-red-600 mt-2"></div>
      </header>

      <main className="max-w-7xl mx-auto">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 space-y-4">
            <div className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center text-gray-700 text-2xl">
              ❤
            </div>
            <div className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
              Your list is empty. <br /> Start adding some movies!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                // Update to match the new function signature if needed
                onRemove={() => handleRemoveFromList(movie.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/*  Floating Alert UI */}
      {message.text && (
        <div
          className={`fixed bottom-10 right-10 flex flex-col overflow-hidden rounded-xl shadow-2xl z-50 transition-all duration-500 transform translate-y-0 opacity-100 ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-3 px-6 py-4">
            {message.type === "success" ? (
              <CheckCircle size={20} className="text-white" />
            ) : (
              <AlertCircle size={20} className="text-white" />
            )}
            <span className="font-bold text-sm uppercase tracking-wider text-white">
              {message.text}
            </span>
          </div>
          {/* Progress Bar Animation */}
          <div className="h-1 bg-black/20 w-full">
            <div
              className="h-full bg-white/50"
              style={{
                animation: "shrink 4s linear forwards",
              }}
            />
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;