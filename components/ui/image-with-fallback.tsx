"use client";

import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/lib/tmdb";
import { AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  posterSize?: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
  backdropSize?: "w300" | "w780" | "w1280" | "original";
  imageType?: "poster" | "backdrop" | "profile";
  onLoad?: () => void;
  onError?: () => void;
}

// Default placeholder SVG for movies
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMzAwSDMwMFY0NTBIMjAwVjMwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTIyMCAzMjBIMjgwVjQzMEgyMjBWMzIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";

// Error placeholder SVG
const ERROR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjM3NSIgcj0iNDAiIGZpbGw9IiNlZjQ0NDQiLz4KPHBhdGggZD0iTTIzMCAzNjVIMjcwVjM4NUgyMzBWNjY1WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMjMwIDM4NUgyNzBWNjA1SDIzMFYzODVaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=";

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  quality = 75,
  posterSize = "w500",
  backdropSize = "w1280",
  imageType = "poster",
  onLoad,
  onError,
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (!src) return DEFAULT_PLACEHOLDER;

    switch (imageType) {
      case "poster":
        return getPosterUrl(src, posterSize);
      case "backdrop":
        return getBackdropUrl(src, backdropSize);
      case "profile":
        return getProfileUrl(src, "w185");
      default:
        return src;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setShowRetry(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();

    if (retryCount < MAX_RETRIES) {
      // Auto-retry with exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setImageSrc(
          (prev) => `${prev}?retry=${retryCount + 1}&t=${Date.now()}`
        );
        setIsLoading(true);
      }, delay);
    } else {
      // Show manual retry option after max retries
      setShowRetry(true);
    }
  }, [retryCount, onError]);

  const handleManualRetry = useCallback(() => {
    setRetryCount(0);
    setHasError(false);
    setShowRetry(false);
    setIsLoading(true);

    // Reset to original URL
    if (!src) {
      setImageSrc(DEFAULT_PLACEHOLDER);
      setIsLoading(false);
      return;
    }

    let newSrc: string;
    switch (imageType) {
      case "poster":
        newSrc = getPosterUrl(src, posterSize);
        break;
      case "backdrop":
        newSrc = getBackdropUrl(src, backdropSize);
        break;
      case "profile":
        newSrc = getProfileUrl(src, "w185");
        break;
      default:
        newSrc = src;
    }

    setImageSrc(`${newSrc}?retry=${Date.now()}`);
  }, [src, imageType, posterSize, backdropSize]);

  return (
    <div className='relative'>
      {/* Loading State - Simplified */}
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-muted/20 z-10 ${
            fill ? "w-full h-full" : ""
          }`}>
          <div className='h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin' />
        </div>
      )}

      {/* Error State with Retry */}
      {hasError && showRetry && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-muted/80 z-20 ${
            fill ? "w-full h-full" : ""
          }`}>
          <AlertCircle className='h-8 w-8 text-destructive mb-2' />
          <button
            onClick={handleManualRetry}
            className='flex items-center gap-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'>
            <RefreshCw className='h-4 w-4' />
            Retry
          </button>
        </div>
      )}

      {/* Next.js Image Component */}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
