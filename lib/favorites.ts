"use client";

import { Movie } from "./types";

const FAVORITES_KEY = "cinema-hub-favorites";
const WATCHLIST_KEY = "cinema-hub-watchlist";

export class FavoritesManager {
  private static getStorageData(key: string): Movie[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private static setStorageData(key: string, data: Movie[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // Favorites methods
  static getFavorites(): Movie[] {
    return this.getStorageData(FAVORITES_KEY);
  }

  static addToFavorites(movie: Movie): void {
    const favorites = this.getFavorites();
    if (!favorites.find((fav) => fav.id === movie.id)) {
      favorites.push(movie);
      this.setStorageData(FAVORITES_KEY, favorites);
    }
  }

  static removeFromFavorites(movieId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    this.setStorageData(FAVORITES_KEY, updatedFavorites);
  }

  static isFavorite(movieId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.id === movieId);
  }

  // Watchlist methods
  static getWatchlist(): Movie[] {
    return this.getStorageData(WATCHLIST_KEY);
  }

  static addToWatchlist(movie: Movie): void {
    const watchlist = this.getWatchlist();
    if (!watchlist.find((item) => item.id === movie.id)) {
      watchlist.push(movie);
      this.setStorageData(WATCHLIST_KEY, watchlist);
    }
  }

  static removeFromWatchlist(movieId: number): void {
    const watchlist = this.getWatchlist();
    const updatedWatchlist = watchlist.filter((item) => item.id !== movieId);
    this.setStorageData(WATCHLIST_KEY, updatedWatchlist);
  }

  static isInWatchlist(movieId: number): boolean {
    const watchlist = this.getWatchlist();
    return watchlist.some((item) => item.id === movieId);
  }

  // Clear all data
  static clearAll(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(FAVORITES_KEY);
      localStorage.removeItem(WATCHLIST_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}
