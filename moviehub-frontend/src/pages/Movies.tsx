// SUBEDI RABIN M25W0465
import { useEffect, useState } from "react";
import { fetchMovies } from "../api/movieApi";
import type { Movie } from "../types/movie";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies()
      .then(setMovies)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading movies...</p>;

  return (
    <div>
      <h1>🎬 Movies</h1>

      {movies.map((movie) => (
        <div key={movie.id} style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
          <h3>{movie.title}</h3>
          <p>{movie.genre}</p>
          <p>⭐ {movie.averageRating}</p>
        </div>
      ))}
    </div>
  );
};

export default Movies;
