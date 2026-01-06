'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LuImageOff } from 'react-icons/lu';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallbackIcon?: React.ReactNode;
}

/**
 * SafeImage component with error handling and fallback
 * Prevents 502 errors when images fail to load
 */
export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  fallbackIcon,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default fallback icon
  const defaultFallback = (
    <div className='flex items-center justify-center bg-muted text-muted-foreground'>
      <LuImageOff className='w-8 h-8' />
    </div>
  );

  const fallback = fallbackIcon || defaultFallback;

  // If error occurred, show fallback
  if (hasError) {
    if (fill) {
      return (
        <div className={`absolute inset-0 ${className}`}>
          {fallback}
        </div>
      );
    }
    return (
      <div
        className={className}
        style={{ width, height }}
      >
        {fallback}
      </div>
    );
  }

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  try {
    if (fill) {
      return (
        <>
          {isLoading && (
            <div className='absolute inset-0 bg-muted animate-pulse' />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            priority={priority}
            onError={handleError}
            onLoad={handleLoad}
            unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
          />
        </>
      );
    }

    return (
      <>
        {isLoading && (
          <div
            className='bg-muted animate-pulse'
            style={{ width, height }}
          />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
          unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
        />
      </>
    );
  } catch (error) {
    // If Image component fails, show fallback
    console.error('Image component error:', error);
    return (
      <div
        className={className}
        style={fill ? undefined : { width, height }}
      >
        {fallback}
      </div>
    );
  }
}

