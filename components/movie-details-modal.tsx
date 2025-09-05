"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SimpleImage as ImageWithFallback } from "@/components/ui/simple-image";
import { FavoritesManager } from "@/lib/favorites";
import { getMovieCredits, getMovieDetails } from "@/lib/tmdb";
import { Credits, Movie, MovieDetails } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Play,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onTrailerClick?: (movie: Movie) => void;
}

export function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
  onTrailerClick,
}: MovieDetailsModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true);
      setIsFavorite(FavoritesManager.isFavorite(movie.id));
      setIsInWatchlist(FavoritesManager.isInWatchlist(movie.id));

      const fetchDetails = async () => {
        try {
          const [details, movieCredits] = await Promise.all([
            getMovieDetails(movie.id),
            getMovieCredits(movie.id),
          ]);
          setMovieDetails(details);
          setCredits(movieCredits);
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [movie, isOpen]);

  const handleFavoriteToggle = () => {
    if (!movie) return;

    if (isFavorite) {
      FavoritesManager.removeFromFavorites(movie.id);
    } else {
      FavoritesManager.addToFavorites(movie);
    }
    setIsFavorite(!isFavorite);
  };

  const handleWatchlistToggle = () => {
    if (!movie) return;

    if (isInWatchlist) {
      FavoritesManager.removeFromWatchlist(movie.id);
    } else {
      FavoritesManager.addToWatchlist(movie);
    }
    setIsInWatchlist(!isInWatchlist);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto p-0'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='relative'>
              {/* Close Button */}
              <Button
                variant='ghost'
                size='sm'
                className='absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white'
                onClick={onClose}>
                <X className='h-4 w-4' />
              </Button>

              {loading ? (
                <div className='flex items-center justify-center h-96'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className='h-12 w-12 border-4 border-primary border-t-transparent rounded-full'
                  />
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Hero Section */}
                  <div className='relative h-96 overflow-hidden'>
                    <ImageWithFallback
                      src={movie.backdrop_path}
                      alt={movie.title}
                      fill
                      className='object-cover'
                      imageType='backdrop'
                      backdropSize='original'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent' />

                    <div className='absolute bottom-6 left-6 right-6'>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='space-y-4'>
                        <h1 className='text-4xl font-bold text-white'>
                          {movieDetails?.title || movie.title}
                        </h1>

                        <div className='flex flex-wrap items-center gap-4 text-white/90'>
                          <div className='flex items-center gap-1'>
                            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                            {movie.vote_average.toFixed(1)} ({movie.vote_count}{" "}
                            votes)
                          </div>
                          {movieDetails?.runtime && (
                            <div className='flex items-center gap-1'>
                              <Clock className='h-4 w-4' />
                              {formatRuntime(movieDetails.runtime)}
                            </div>
                          )}
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {new Date(movie.release_date).getFullYear()}
                          </div>
                          {movieDetails?.status && (
                            <Badge variant='secondary'>
                              {movieDetails.status}
                            </Badge>
                          )}
                        </div>

                        <div className='flex flex-wrap gap-3 sm:gap-4'>
                          <Button
                            size='default'
                            className='bg-primary hover:bg-primary/90'
                            onClick={() => onTrailerClick?.(movie)}>
                            <Play className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                            Watch Trailer
                          </Button>
                          <Button
                            size='default'
                            variant='outline'
                            onClick={handleFavoriteToggle}
                            className={
                              isFavorite
                                ? "bg-red-500/10 border-red-500 text-red-500"
                                : ""
                            }>
                            <Heart
                              className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                                isFavorite ? "fill-current" : ""
                              }`}
                            />
                            {isFavorite ? "Favorited" : "Add to Favorites"}
                          </Button>
                          <Button
                            size='default'
                            variant='outline'
                            onClick={handleWatchlistToggle}
                            className={
                              isInWatchlist
                                ? "bg-blue-500/10 border-blue-500 text-blue-500"
                                : ""
                            }>
                            <Star
                              className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${
                                isInWatchlist ? "fill-current" : ""
                              }`}
                            />
                            {isInWatchlist
                              ? "In Watchlist"
                              : "Add to Watchlist"}
                          </Button>
                          {movieDetails?.homepage && (
                            <Button size='default' variant='outline' asChild>
                              <a
                                href={movieDetails.homepage}
                                target='_blank'
                                rel='noopener noreferrer'>
                                <ExternalLink className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                                Official Site
                              </a>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className='p-6 space-y-8'>
                    {/* Overview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}>
                      <h2 className='text-2xl font-bold mb-4'>Overview</h2>
                      <p className='text-muted-foreground leading-relaxed'>
                        {movieDetails?.overview || movie.overview}
                      </p>
                      {movieDetails?.tagline && (
                        <p className='text-lg italic text-primary mt-4'>
                          &quot;{movieDetails.tagline}&quot;
                        </p>
                      )}
                    </motion.div>

                    {/* Genres */}
                    {movieDetails?.genres && movieDetails.genres.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}>
                        <h3 className='text-lg font-semibold mb-3'>Genres</h3>
                        <div className='flex flex-wrap gap-2'>
                          {movieDetails.genres.map((genre) => (
                            <Badge key={genre.id} variant='outline'>
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Cast */}
                    {credits?.cast && credits.cast.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}>
                        <h3 className='text-lg font-semibold mb-4'>Cast</h3>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                          {credits.cast.slice(0, 12).map((actor) => (
                            <Card key={actor.id} className='overflow-hidden'>
                              <div className='aspect-[2/3] relative'>
                                <ImageWithFallback
                                  src={actor.profile_path}
                                  alt={actor.name}
                                  fill
                                  className='object-cover'
                                  imageType='profile'
                                />
                              </div>
                              <CardContent className='p-3'>
                                <h4 className='font-semibold text-sm line-clamp-1'>
                                  {actor.name}
                                </h4>
                                <p className='text-xs text-muted-foreground line-clamp-1'>
                                  {actor.character}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Production Info */}
                    {movieDetails && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Production Companies */}
                        {movieDetails.production_companies &&
                          movieDetails.production_companies.length > 0 && (
                            <div>
                              <h3 className='text-lg font-semibold mb-3'>
                                Production Companies
                              </h3>
                              <div className='space-y-2'>
                                {movieDetails.production_companies.map(
                                  (company) => (
                                    <div
                                      key={company.id}
                                      className='flex items-center gap-2'>
                                      {company.logo_path && (
                                        <ImageWithFallback
                                          src={company.logo_path}
                                          alt={company.name}
                                          width={32}
                                          height={32}
                                          className='object-contain'
                                          imageType='poster'
                                          posterSize='w92'
                                        />
                                      )}
                                      <span className='text-sm'>
                                        {company.name}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Financial Info */}
                        <div>
                          <h3 className='text-lg font-semibold mb-3'>
                            Financial Information
                          </h3>
                          <div className='space-y-2 text-sm'>
                            {movieDetails.budget > 0 && (
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Budget:
                                </span>
                                <span>
                                  {formatCurrency(movieDetails.budget)}
                                </span>
                              </div>
                            )}
                            {movieDetails.revenue > 0 && (
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>
                                  Revenue:
                                </span>
                                <span>
                                  {formatCurrency(movieDetails.revenue)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
