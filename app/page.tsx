"use client";

import { FavoritesSection } from "@/components/favorites-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { MovieDetailsModal } from "@/components/movie-details-modal";
import { MovieGrid } from "@/components/movie-grid";
import { Navigation } from "@/components/navigation";
import { TrailerModal } from "@/components/trailer-modal";
import {
  getGenres,
  getMoviesByGenre,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovies,
} from "@/lib/tmdb";
import { Movie } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fetch genres
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch movies based on current state
  const { data: moviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", searchQuery, selectedGenre, currentPage],
    queryFn: async () => {
      if (searchQuery) {
        return searchMovies(searchQuery, currentPage);
      } else if (selectedGenre) {
        return getMoviesByGenre(selectedGenre, currentPage);
      } else {
        return getPopularMovies(currentPage);
      }
    },
    enabled: true,
  });

  // Fetch different movie categories
  const { data: trendingMovies = [] } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => getTrendingMovies("week"),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: topRatedData } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: () => getTopRatedMovies(1),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: upcomingData } = useQuery({
    queryKey: ["upcoming-movies"],
    queryFn: () => getUpcomingMovies(1),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setCurrentPage(1);
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleResetToDefault = () => {
    setSearchQuery("");
    setSelectedGenre(null);
    setCurrentPage(1);
    setShowFavorites(false);
  };

  const movies = moviesData?.results || [];
  const hasMorePages = moviesData
    ? currentPage < moviesData.total_pages
    : false;

  return (
    <div className='min-h-screen bg-background'>
      <Navigation
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        selectedGenre={selectedGenre}
        genres={genres}
        onFavoritesClick={() => setShowFavorites(true)}
      />

      {showFavorites ? (
        <FavoritesSection
          onMovieSelect={setSelectedMovie}
          onBackClick={() => setShowFavorites(false)}
          onResetToDefault={handleResetToDefault}
        />
      ) : (
        <main className='space-y-12'>
          {/* Hero Section */}
          <HeroSection
            onMovieSelect={setSelectedMovie}
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            genres={genres}
          />

          {/* Movie Sections */}
          <div className='max-w-7xl mx-auto space-y-12'>
            {/* Trending Movies */}
            {!searchQuery && !selectedGenre && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <MovieGrid
                  movies={trendingMovies}
                  title='🔥Trending This Week'
                  onMovieSelect={setSelectedMovie}
                />
              </motion.div>
            )}

            {/* Search Results or Genre Results */}
            {(searchQuery || selectedGenre) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <MovieGrid
                  movies={movies}
                  loading={moviesLoading}
                  title={
                    searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedGenre
                      ? `Movies in ${
                          genres.find((g) => g.id === selectedGenre)?.name
                        }`
                      : "Movies"
                  }
                  onMovieSelect={setSelectedMovie}
                  showLoadMore={hasMorePages}
                  onLoadMore={handleLoadMore}
                />
              </motion.div>
            )}

            {/* Popular Movies */}
            {!searchQuery && !selectedGenre && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <MovieGrid
                  movies={movies}
                  loading={moviesLoading}
                  title='⭐ Popular Movies'
                  onMovieSelect={setSelectedMovie}
                  showLoadMore={hasMorePages}
                  onLoadMore={handleLoadMore}
                />
              </motion.div>
            )}

            {/* Top Rated Movies */}
            {!searchQuery && !selectedGenre && topRatedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}>
                <MovieGrid
                  movies={topRatedData.results}
                  title='🏆 Top Rated Movies'
                  onMovieSelect={setSelectedMovie}
                />
              </motion.div>
            )}

            {/* Upcoming Movies */}
            {!searchQuery && !selectedGenre && upcomingData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}>
                <MovieGrid
                  movies={upcomingData.results}
                  title='🎬 Coming Soon'
                  onMovieSelect={setSelectedMovie}
                />
              </motion.div>
            )}
          </div>
        </main>
      )}

      <Footer />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onTrailerClick={setTrailerMovie}
      />

      {/* Trailer Modal */}
      <TrailerModal
        movie={trailerMovie}
        isOpen={!!trailerMovie}
        onClose={() => setTrailerMovie(null)}
      />
    </div>
  );
}
