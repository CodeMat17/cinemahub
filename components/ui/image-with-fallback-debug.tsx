"use client";

import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackDebugProps {
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
}

export function ImageWithFallbackDebug({
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
}: ImageWithFallbackDebugProps) {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    if (!src) {
      console.log("No src provided, using placeholder");
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMzAwSDMwMFY0NTBIMjAwVjMwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTIyMCAzMjBIMjgwVjQzMEgyMjBWMzIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
    }

    let url: string;
    switch (imageType) {
      case "poster":
        url = getPosterUrl(src, posterSize);
        break;
      case "backdrop":
        url = getBackdropUrl(src, backdropSize);
        break;
      case "profile":
        url = getProfileUrl(src, "w185");
        break;
      default:
        url = src;
    }

    console.log(`Generated ${imageType} URL:`, url);
    return url;
  });

  const handleLoad = () => {
    console.log("Image loaded successfully:", imageSrc);
  };

  const handleError = (e: any) => {
    console.error("Image failed to load:", imageSrc, e);
  };

  return (
    <div className='relative'>
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
