"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleImage as ImageWithFallback } from "@/components/ui/simple-image";
import { getTrendingMovies } from "@/lib/tmdb";
import { HeroMovie } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Info, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  onMovieSelect: (movie: HeroMovie) => void;
  searchQuery?: string;
  selectedGenre?: number | null;
  genres?: Array<{ id: number; name: string }>;
}

export function HeroSection({
  onMovieSelect,
  searchQuery,
  selectedGenre,
  genres,
}: HeroSectionProps) {
  const [featuredMovies, setFeaturedMovies] = useState<HeroMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        let movies: HeroMovie[] = [];

        if (searchQuery) {
          // Show search results in hero
          const { searchMovies } = await import("@/lib/tmdb");
          const searchData = await searchMovies(searchQuery, 1);
          movies = searchData.results.filter(
            (movie) => movie.backdrop_path
          ) as HeroMovie[];
        } else if (selectedGenre) {
          // Show genre-filtered movies in hero
          const { getMoviesByGenre } = await import("@/lib/tmdb");
          const genreData = await getMoviesByGenre(selectedGenre, 1);
          movies = genreData.results.filter(
            (movie) => movie.backdrop_path
          ) as HeroMovie[];
        } else {
          // Show trending movies by default
          const trendingMovies = await getTrendingMovies("week");
          movies = trendingMovies.filter(
            (movie) => movie.backdrop_path
          ) as HeroMovie[];
        }

        setFeaturedMovies(movies.slice(0, 10));
        setCurrentIndex(0); // Reset to first movie when data changes
      } catch (error) {
        console.error("Failed to fetch featured movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, [searchQuery, selectedGenre]);

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentIndex];

  if (loading) {
    return (
      <div className='relative h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className='h-8 w-8 sm:h-12 sm:w-12 border-4 border-primary border-t-transparent rounded-full shadow-lg'
          />
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    // Show a contextual message when no movies are available
    return (
      <div className='relative h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center space-y-4'>
            <h2 className='text-2xl sm:text-3xl font-bold text-foreground'>
              {searchQuery
                ? `No movies found for "${searchQuery}"`
                : selectedGenre
                ? `No movies found in this genre`
                : "No featured movies available"}
            </h2>
            <p className='text-muted-foreground'>
              {searchQuery
                ? "Try searching with different keywords"
                : selectedGenre
                ? "Try selecting a different genre"
                : "Please try again later"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full overflow-hidden'>
      {/* Background Image */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className='absolute inset-0'>
          <ImageWithFallback
            src={currentMovie.backdrop_path}
            alt={currentMovie.title}
            fill
            className='object-cover'
            priority
            sizes='100vw'
            imageType='backdrop'
            backdropSize='original'
          />
          {/* Perfect color blending gradients */}
          <div className='absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent sm:from-background/85 sm:via-background/50 dark:from-background/95 dark:via-background/70 dark:sm:from-background/90 dark:sm:via-background/50' />
          <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent dark:from-background/90 dark:via-background/30' />
          {/* Subtle overlay for enhanced text readability */}
          <div className='absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent dark:hidden' />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className='relative z-10 h-full flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='space-y-4 sm:space-y-6'>
                {/* Contextual Title */}
                {searchQuery && (
                  <div className='text-sm sm:text-base text-primary/80 font-medium mb-2'>
                    🔍 Search Results for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
                {selectedGenre && genres && (
                  <div className='text-sm sm:text-base text-primary/80 font-medium mb-2'>
                    🎭 {genres.find((g) => g.id === selectedGenre)?.name} Movies
                  </div>
                )}

                {/* Movie Title */}
                <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground drop-shadow-2xl dark:drop-shadow-2xl'>
                  {currentMovie.title}
                </h1>

                {/* Movie Info */}
                <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-foreground/90 drop-shadow-lg dark:text-foreground/80 dark:drop-shadow-xl'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3 sm:h-4 sm:w-4' />
                    {new Date(currentMovie.release_date).getFullYear()}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Star className='h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400' />
                    {currentMovie.vote_average.toFixed(1)}
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {currentMovie.adult ? "18+" : "PG"}
                  </Badge>
                </div>

                {/* Movie Overview */}
                <p className='text-sm sm:text-base lg:text-lg text-foreground/85 leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-lg dark:text-foreground/75 dark:drop-shadow-xl'>
                  {currentMovie.overview}
                </p>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                  <Button
                    size='default'
                    className='bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto'
                    onClick={() => onMovieSelect(currentMovie)}>
                    <Play className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                    Watch Trailer
                  </Button>
                  <Button
                    size='default'
                    variant='outline'
                    className='w-full sm:w-auto'
                    onClick={() => onMovieSelect(currentMovie)}>
                    <Info className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                    More Info
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {featuredMovies.length > 1 && (
        <div className='absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
          <div className='flex space-x-1 sm:space-x-2'>
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border-2",
                  index === currentIndex
                    ? "bg-primary scale-125 shadow-lg border-primary"
                    : "bg-white hover:bg-white/90 border-gray-300 dark:bg-white/50 dark:hover:bg-white/75 dark:border-white/40"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {featuredMovies.length > 1 && (
        <motion.div
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          className='absolute bottom-0 left-0 h-1 bg-primary'
        />
      )}
    </div>
  );
}
