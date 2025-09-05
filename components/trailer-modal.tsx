"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getBackdropUrl } from "@/lib/tmdb";
import { Movie } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export function TrailerModal({ movie, isOpen, onClose }: TrailerModalProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true);
      const fetchVideos = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${
              process.env.NEXT_PUBLIC_TMDB_API_KEY ||
              "8bad76334191d54d21e9641ab881a3b2"
            }`
          );
          const data = await response.json();

          // Filter for YouTube trailers and teasers
          const youtubeVideos = data.results.filter(
            (video: Video) =>
              video.site === "YouTube" &&
              (video.type === "Trailer" || video.type === "Teaser") &&
              video.official
          );

          setVideos(youtubeVideos);
          if (youtubeVideos.length > 0) {
            setSelectedVideo(youtubeVideos[0]);
          }
        } catch (error) {
          console.error("Failed to fetch videos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVideos();
    }
  }, [movie, isOpen]);

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto p-0'>
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
                  {/* Movie Header */}
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={getBackdropUrl(movie.backdrop_path, "original")}
                      alt={movie.title}
                      fill
                      className='object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent' />

                    <div className='absolute bottom-4 left-4 right-4'>
                      <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                        {movie.title}
                      </h1>
                      <div className='flex flex-wrap gap-2'>
                        {videos.map((video) => (
                          <Badge
                            key={video.id}
                            variant={
                              selectedVideo?.id === video.id
                                ? "default"
                                : "outline"
                            }
                            className='cursor-pointer bg-white/20 text-white border-white/30 hover:bg-white/30'
                            onClick={() => setSelectedVideo(video)}>
                            {video.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Video Player */}
                  {selectedVideo ? (
                    <div className='px-4 sm:px-6'>
                      <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                          title={selectedVideo.name}
                          className='absolute inset-0 h-full w-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>

                      <div className='mt-4 space-y-2'>
                        <h3 className='text-lg font-semibold'>
                          {selectedVideo.name}
                        </h3>
                        <div className='flex items-center gap-2'>
                          <Badge variant='secondary'>
                            {selectedVideo.type}
                          </Badge>
                          {selectedVideo.official && (
                            <Badge variant='outline'>Official</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='px-4 sm:px-6 py-12 text-center'>
                      <Play className='h-16 w-16 mx-auto text-muted-foreground mb-4' />
                      <h3 className='text-lg font-semibold mb-2'>
                        No Trailers Available
                      </h3>
                      <p className='text-muted-foreground mb-4'>
                        We couldn't find any official trailers for this movie.
                      </p>
                      <Button
                        variant='outline'
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/results?search_query=${encodeURIComponent(
                              movie.title + " trailer"
                            )}`,
                            "_blank"
                          )
                        }>
                        <ExternalLink className='h-4 w-4 mr-2' />
                        Search on YouTube
                      </Button>
                    </div>
                  )}

                  {/* Additional Videos */}
                  {videos.length > 1 && (
                    <div className='px-4 sm:px-6 pb-6'>
                      <h3 className='text-lg font-semibold mb-4'>
                        More Videos
                      </h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {videos.slice(1).map((video) => (
                          <div
                            key={video.id}
                            className='relative aspect-video overflow-hidden rounded-lg cursor-pointer group'
                            onClick={() => setSelectedVideo(video)}>
                            <Image
                              src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                              alt={video.name}
                              fill
                              className='object-cover group-hover:scale-105 transition-transform duration-300'
                            />
                            <div className='absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors'>
                              <Play className='h-8 w-8 text-white' />
                            </div>
                            <div className='absolute bottom-2 left-2 right-2'>
                              <p className='text-white text-sm font-medium line-clamp-2'>
                                {video.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
