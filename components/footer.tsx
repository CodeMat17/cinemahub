"use client";

import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Brand */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              {/* <Film className='h-6 w-6 text-primary' /> */}
              <span className='text-lg font-bold'>CinemaHub</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Discover your next favorite movie with our comprehensive movie
              database.
            </p>
          </div>

          {/* Links */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Resources</h3>
            <div className='space-y-2'>
              <a
                href='https://www.themoviedb.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                <ExternalLink className='h-3 w-3' />
                TMDB API
              </a>
              <a
                href='https://nextjs.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                <ExternalLink className='h-3 w-3' />
                Next.js
              </a>
              <a
                href='https://tailwindcss.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'>
                <ExternalLink className='h-3 w-3' />
                Tailwind CSS
              </a>
            </div>
          </div>

          {/* Social */}
          {/* <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Connect</h3>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                asChild
                className='h-8 w-8 p-0'>
                <a
                  href='https://github.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='GitHub'>
                  <Github className='h-4 w-4' />
                </a>
              </Button>
            </div>
          </div> */}
        </div>

        <div className='mt-8 pt-8 border-t'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-muted-foreground'>
              © 2025 CinemaHub.
            </p>
            <p className='text-sm text-muted-foreground'>
              Powered by{" "}
              <a
                href='https://www.themoviedb.org/'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-foreground transition-colors'>
                The Movie Database
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
