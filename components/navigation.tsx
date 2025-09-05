"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Heart, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface NavigationProps {
  onSearch: (query: string) => void;
  onGenreSelect: (genreId: number | null) => void;
  selectedGenre: number | null;
  genres: Array<{ id: number; name: string }>;
  onFavoritesClick?: () => void;
}

export function Navigation({
  onSearch,
  onGenreSelect,
  selectedGenre,
  genres,
  onFavoritesClick,
}: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6'>
        <div className='flex h-14 sm:h-16 items-center justify-between'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='flex items-center space-x-1 sm:space-x-2'>
            {/* <Film className='h-4 w-4 sm:h-8 sm:w-8 text-primary' /> */}
            <span className='text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              CinemaHub
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-4 xl:space-x-6'>
            <form
              onSubmit={handleSearch}
              className='flex items-center space-x-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='text'
                  placeholder='Search movies...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='px-10 w-48 xl:w-64'
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='Clear search'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
              <Button type='submit' size='sm'>
                Search
              </Button>
            </form>

            {/* Genre Filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-muted-foreground whitespace-nowrap'>
                Genre:
              </span>
              <Select
                value={selectedGenre?.toString() || "all"}
                onValueChange={(value) =>
                  onGenreSelect(value === "all" ? null : parseInt(value))
                }>
                <SelectTrigger className='w-32 xl:w-40'>
                  <SelectValue placeholder='Select genre' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className='flex items-center space-x-1 sm:space-x-2'>
            {onFavoritesClick && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onFavoritesClick}
                className='h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0'>
                <Heart className='h-4 w-4 sm:mr-2' />
                <span className='hidden lg:inline'>Favorites</span>
              </Button>
            )}

            <Button
              variant='ghost'
              size='sm'
              onClick={toggleTheme}
              className='h-8 w-8 sm:h-9 sm:w-9 p-0'>
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden h-8 w-8 sm:h-9 sm:w-9 p-0'
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className='h-4 w-4' />
              ) : (
                <Menu className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className='lg:hidden overflow-hidden'>
          <div className='py-3 sm:py-4 space-y-3 sm:space-y-4 border-t'>
            <form
              onSubmit={handleSearch}
              className='flex items-center space-x-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  type='text'
                  placeholder='Search movies...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 pr-10 h-9 sm:h-10'
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    aria-label='Clear search'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
              <Button type='submit' size='sm' className='h-9 sm:h-10'>
                Search
              </Button>
            </form>

            {/* Mobile Genre Filter */}
            <div className='space-y-2'>
              <span className='text-sm text-muted-foreground'>Genre:</span>
              <Select
                value={selectedGenre?.toString() || "all"}
                onValueChange={(value) =>
                  onGenreSelect(value === "all" ? null : parseInt(value))
                }>
                <SelectTrigger className='w-full h-9 sm:h-10'>
                  <SelectValue placeholder='Select genre' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
