"use client";

import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryImageProps {
  publicId?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
}

export default function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className = '',
  fallbackIcon,
  priority = false,
  objectFit = 'cover',
}: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cloudBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || 'https://res.cloudinary.com/dojo-connect/image/upload';

  // Generate Cloudinary URL if publicId is provided
  const cloudinaryUrl = publicId
    ? `${cloudBase}/w_${width},h_${height},c_${objectFit === 'cover' ? 'fill' : 'fit'},q_auto,f_auto/${publicId}`
    : null;

  const showFallback = !cloudinaryUrl || imageError;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {fallbackIcon ? (
          fallbackIcon
        ) : (
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={cloudinaryUrl as string}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit }}
        priority={priority}
        onError={() => setImageError(true)}
        onLoadingComplete={() => setIsLoading(false)}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}
      />
    </div>
  );
}
