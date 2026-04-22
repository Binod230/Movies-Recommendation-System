/* SUBEDI RABIN M25W0465 */
import api from "./axios";
import type { Movie } from "../types/movie";

// 1. Generic interface is now ready to be used with any type
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const fetchMovies = async (): Promise<Movie[]> => {
  const res = await api.get<PaginatedResponse<Movie>>("/movies/all");
  return res.data.content; 
};

export const fetchMovieById = async (id: number): Promise<Movie> => {
  const res = await api.get<Movie>(`/movies/${id}`);
  return res.data;
};

export const getAllMovies = async (): Promise<Movie[]> => {
  // Added type safety to the get request
  const response = await api.get<PaginatedResponse<Movie>>("/movies");
  return response.data.content;
};

// 🔥 FIXED: Added <Movie> to PaginatedResponse to resolve the error
export const getRecommendedMovies = async (): Promise<Movie[] | PaginatedResponse<Movie>> => {
  // Note: Usually, recommendations have a specific endpoint like "/movies/recommendations"
  const response = await api.get<Movie[] | PaginatedResponse<Movie>>("recommendations/userbase-recommendations");
  return response.data;
};