"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleImage as ImageWithFallback } from "@/components/ui/simple-image";
import { FavoritesManager } from "@/lib/favorites";
import { Movie } from "@/lib/types";
import { motion, Variants } from "framer-motion";
import { Heart, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onMovieSelect: (movie: Movie) => void;
  title?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

export function MovieGrid({
  movies,
  loading,
  onMovieSelect,
  title,
  showLoadMore = false,
  onLoadMore,
}: MovieGridProps) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  if (loading && movies.length === 0) {
    return (
      <div className='space-y-4 sm:space-y-6 px-4 xl:px-0'>
        {title && <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4'>
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className='aspect-[2/3] animate-pulse'>
              <CardContent className='p-0 h-full bg-muted' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 px-4 xl:px-0'>
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-xl sm:text-2xl font-bold'>
          {title}
        </motion.h2>
      )}

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4'>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            variants={itemVariants}
            isHovered={hoveredMovie === movie.id}
            onHover={(hovered) => setHoveredMovie(hovered ? movie.id : null)}
            onClick={() => onMovieSelect(movie)}
          />
        ))}
      </motion.div>

      {showLoadMore && onLoadMore && (
        <div className='flex justify-center pt-6 sm:pt-8'>
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant='outline'
            size='default'
            className='w-full sm:w-auto'>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

interface MovieCardProps {
  movie: Movie;
  index: number;
  variants: Variants;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

function MovieCard({
  movie,
  index,
  variants,
  isHovered,
  onHover,
  onClick,
}: MovieCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      FavoritesManager.removeFromFavorites(movie.id);
    } else {
      FavoritesManager.addToFavorites(movie);
    }
    setIsFavorite(!isFavorite);
  };

  // Check if movie is favorite on mount
  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(movie.id));
  }, [movie.id]);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial='hidden'
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.05 }}
      className='group cursor-pointer'
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}>
      <Card className='overflow-hidden bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105'>
        <div className='relative aspect-[2/3] overflow-hidden'>
          {inView && (
            <ImageWithFallback
              src={movie.poster_path}
              alt={movie.title}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-110'
              sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw'
              imageType='poster'
              posterSize='w500'
            />
          )}

          {/* Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 flex items-center justify-center'>
            <div className='flex space-x-2'>
              <Button
                size='sm'
                className='bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}>
                <Play className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                variant='outline'
                className={`backdrop-blur-sm border-white/30 ${
                  isFavorite
                    ? "bg-red-500/30 hover:bg-red-500/40 text-red-100"
                    : "bg-white/20 hover:bg-white/30"
                }`}
                onClick={handleFavoriteClick}>
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </motion.div>

          {/* Rating Badge */}
          <div className='absolute top-2 right-2'>
            <Badge className='bg-black/70 text-white border-0'>
              <Star className='h-3 w-3 mr-1 fill-yellow-400 text-yellow-400' />
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>

          {/* Adult Badge */}
          {movie.adult && (
            <div className='absolute top-2 left-2'>
              <Badge variant='destructive' className='text-xs'>
                18+
              </Badge>
            </div>
          )}
        </div>

        <CardContent className='p-2 sm:p-3'>
          <h3 className='font-semibold text-xs sm:text-sm line-clamp-2 mb-1'>
            {movie.title}
          </h3>
          <p className='text-xs text-muted-foreground'>
            {formatDate(movie.release_date)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
