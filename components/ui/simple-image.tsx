"use client";

import { getBackdropUrl, getPosterUrl, getProfileUrl } from "@/lib/tmdb";
import Image from "next/image";

interface SimpleImageProps {
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

export function SimpleImage({
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
}: SimpleImageProps) {
  // Generate the correct URL based on image type
  let imageUrl: string;

  if (!src) {
    // Use the same placeholder as the original getImageUrl function
    imageUrl =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMDAgMzAwSDMwMFY0NTBIMjAwVjMwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTIyMCAzMjBIMjgwVjQzMEgyMjBWMzIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
  } else {
    switch (imageType) {
      case "poster":
        imageUrl = getPosterUrl(src, posterSize);
        break;
      case "backdrop":
        imageUrl = getBackdropUrl(src, backdropSize);
        break;
      case "profile":
        imageUrl = getProfileUrl(src, "w185");
        break;
      default:
        imageUrl = src;
    }
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
    />
  );
}
