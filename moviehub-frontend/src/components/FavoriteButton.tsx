/* SUBEDI RABIN M25W0465 */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

interface FavoriteMovie {
  id: number;
  title: string;
}

interface FavoriteProps {
  movieId: number;
  //  Updated to accept the status string for dynamic alerts
  onRemove?: (status: "added" | "removed") => void; 
}

const FavoriteButton: React.FC<FavoriteProps> = ({ movieId, onRemove }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const checkStatus = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get<FavoriteMovie[]>(`http://localhost:9292/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const found = res.data.some((movie) => Number(movie.id) === Number(movieId));
      setIsFavorite(found);
    } catch (err) {
      console.error("Status check failed", err);
    }
  }, [movieId, token]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation if inside a Link
    if (!token || loading) return;

    setLoading(true);
    try {
      if (isFavorite) {
        // 1. DELETE Request
        await axios.delete(`http://localhost:9292/api/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsFavorite(false);
        
        // Trigger Alert with "removed" status
        if (onRemove) {
          onRemove("removed");
        }
      } else {
        // 2. POST Request
        await axios.post(`http://localhost:9292/api/favorites/${movieId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsFavorite(true);

        // Trigger Alert with "added" status
        if (onRemove) {
          onRemove("added");
        }
      }
    } catch (err) {
      console.error("Toggle failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading} 
      className="p-2 transition-transform active:scale-90 outline-none group"
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart 
        size={24} 
        // Red fill if favorite, transparent if not
        fill={isFavorite ? "#dc2626" : "none"} 
        // Red border if favorite, white border if not
        color={isFavorite ? "#dc2626" : "#ffffff"} 
        className={`transition-all duration-300 ${
          isFavorite 
            ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" 
            : "hover:scale-110 opacity-70 group-hover:opacity-100"
        }`}
      />
    </button>
  );
};

export default FavoriteButton;