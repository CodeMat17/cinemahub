"use client";

import { MovieGrid } from "@/components/movie-grid";
import { Button } from "@/components/ui/button";
import { FavoritesManager } from "@/lib/favorites";
import { Movie } from "@/lib/types";
import { ArrowLeft, Heart, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FavoritesSectionProps {
  onMovieSelect: (movie: Movie) => void;
  onBackClick?: () => void;
  onResetToDefault?: () => void;
}

export function FavoritesSection({
  onMovieSelect,
  onBackClick,
  onResetToDefault,
}: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<"favorites" | "watchlist">(
    "favorites"
  );

  useEffect(() => {
    const loadData = () => {
      setFavorites(FavoritesManager.getFavorites());
      setWatchlist(FavoritesManager.getWatchlist());
    };

    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearAllFavorites = () => {
    FavoritesManager.clearAll();
    setFavorites([]);
    setWatchlist([]);
  };

  const currentMovies = activeTab === "favorites" ? favorites : watchlist;
  const hasMovies = favorites.length > 0 || watchlist.length > 0;

  if (!hasMovies) {
    return (
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center space-y-6'>
          <div className='space-y-4'>
            <Heart className='h-16 w-16 mx-auto text-muted-foreground' />
            <h2 className='text-2xl font-bold'>No Favorites Yet</h2>
            <p className='text-muted-foreground max-w-md mx-auto'>
              Start exploring movies and add them to your favorites or watchlist
              to see them here.
            </p>
          </div>
          <Button
            onClick={() => {
              if (onResetToDefault) {
                onResetToDefault();
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className='bg-primary hover:bg-primary/90'>
            Explore Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {onBackClick && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onBackClick}
                className='h-9 w-9 p-0'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            )}
            <div>
              <h1 className='text-3xl font-bold'>My Collection</h1>
              <p className='text-muted-foreground'>
                Your favorite movies and watchlist
              </p>
            </div>
          </div>

          {hasMovies && (
            <Button
              variant='outline'
              onClick={clearAllFavorites}
              className='w-full sm:w-auto'>
              <Trash2 className='h-4 w-4 mr-2' />
              Clear All
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 bg-muted p-1 rounded-lg w-fit'>
          <Button
            variant={activeTab === "favorites" ? "default" : "ghost"}
            size='sm'
            onClick={() => setActiveTab("favorites")}
            className='flex items-center gap-2'>
            <Heart className='h-4 w-4' />
            Favorites ({favorites.length})
          </Button>
          <Button
            variant={activeTab === "watchlist" ? "default" : "ghost"}
            size='sm'
            onClick={() => setActiveTab("watchlist")}
            className='flex items-center gap-2'>
            <Star className='h-4 w-4' />
            Watchlist ({watchlist.length})
          </Button>
        </div>

        {/* Movies Grid */}
        {currentMovies.length > 0 ? (
          <MovieGrid
            movies={currentMovies}
            title={`${activeTab === "favorites" ? "❤️" : "⭐"} ${
              activeTab === "favorites" ? "Favorite Movies" : "Watchlist"
            }`}
            onMovieSelect={onMovieSelect}
          />
        ) : (
          <div className='text-center py-12'>
            <div className='space-y-4'>
              {activeTab === "favorites" ? (
                <>
                  <Heart className='h-12 w-12 mx-auto text-muted-foreground' />
                  <h3 className='text-lg font-semibold'>No Favorite Movies</h3>
                  <p className='text-muted-foreground'>
                    Movies you mark as favorites will appear here.
                  </p>
                </>
              ) : (
                <>
                  <Star className='h-12 w-12 mx-auto text-muted-foreground' />
                  <h3 className='text-lg font-semibold'>
                    No Movies in Watchlist
                  </h3>
                  <p className='text-muted-foreground'>
                    Movies you add to your watchlist will appear here.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
