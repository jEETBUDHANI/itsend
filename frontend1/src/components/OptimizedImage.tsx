import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * Provides optimized image loading with:
 * - Lazy loading by default
 * - WebP format support with fallback
 * - Async decoding
 * - Responsive sizing
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) => {
  const baseName = src.split('.').slice(0, -1).join('.');
  const extension = src.split('.').pop();

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source
        srcSet={`${baseName}.webp`}
        type="image/webp"
      />
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
