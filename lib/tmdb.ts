import { Credits, Genre, Movie, MovieDetails, TMDBResponse } from "./types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Utility function for image URLs
function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path)
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMzAwSDMwMFY0NTBIMjAwVjMwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTIyMCAzMjBIMjgwVjQzMEgyMjBWMzIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

// Utility function for API requests
async function request<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch data");
  }
}

// Get trending movies
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week"
): Promise<Movie[]> {
  const response = await request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
  );
  return response.results;
}

// Get popular movies
export async function getPopularMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Get top rated movies
export async function getTopRatedMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Get upcoming movies
export async function getUpcomingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Get now playing movies
export async function getNowPlayingMovies(
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return request<MovieDetails>(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
  );
}

// Get movie credits
export async function getMovieCredits(movieId: number): Promise<Credits> {
  return request<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
  );
}

// Search movies
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
}

// Get movies by genre
export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
}

// Get genres
export async function getGenres(): Promise<Genre[]> {
  const response = await request<{ genres: Genre[] }>(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
  );
  return response.genres;
}

// Get similar movies
export async function getSimilarMovies(
  movieId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Get recommended movies
export async function getRecommendedMovies(
  movieId: number,
  page: number = 1
): Promise<TMDBResponse<Movie>> {
  return request<TMDBResponse<Movie>>(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&page=${page}`
  );
}

// Utility functions for image URLs
export function getPosterUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  return getImageUrl(path, size);
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string {
  return getImageUrl(path, size);
}

export function getProfileUrl(
  path: string | null,
  size: "w45" | "w185" | "h632" | "original" = "w185"
): string {
  return getImageUrl(path, size);
}
