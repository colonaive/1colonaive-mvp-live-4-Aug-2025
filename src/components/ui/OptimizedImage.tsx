// Optimized Image Component with WebP support and lazy loading
import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 85,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP and fallback URLs
  const generateImageUrls = useCallback((src: string, width?: number, quality: number = 85) => {
    const baseUrl = src.startsWith('http') ? src : `https://colonaive.com${src}`;
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    params.append('q', quality.toString());
    
    return {
      webp: `${baseUrl}?${params.toString()}&f=webp`,
      jpeg: `${baseUrl}?${params.toString()}&f=jpeg`,
      original: baseUrl
    };
  }, []);

  // Generate responsive image sizes
  const generateSrcSet = useCallback((src: string, quality: number) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    
    return {
      webp: breakpoints.map(size => {
        const urls = generateImageUrls(src, size, quality);
        return `${urls.webp} ${size}w`;
      }).join(', '),
      jpeg: breakpoints.map(size => {
        const urls = generateImageUrls(src, size, quality);
        return `${urls.jpeg} ${size}w`;
      }).join(', ')
    };
  }, [generateImageUrls]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const { webp: webpSrc, jpeg: jpegSrc, original: originalSrc } = generateImageUrls(src, width, quality);
  const srcSets = generateSrcSet(src, quality);

  // Fallback image placeholder
  const PlaceholderDiv = () => (
    <div 
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{ 
        width: width || 'auto', 
        height: height || 'auto',
        aspectRatio: width && height ? `${width}/${height}` : 'auto'
      }}
    >
      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  );

  // Error fallback
  if (hasError) {
    return <PlaceholderDiv />;
  }

  return (
    <picture className={`block ${className}`}>
      {/* WebP source for modern browsers */}
      <source
        type="image/webp"
        srcSet={srcSets.webp}
        sizes={sizes}
      />
      
      {/* JPEG fallback */}
      <source
        type="image/jpeg"
        srcSet={srcSets.jpeg}
        sizes={sizes}
      />
      
      {/* Main img element */}
      <img
        src={originalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{
          objectFit: 'cover',
          aspectRatio: width && height ? `${width}/${height}` : 'auto'
        }}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          <PlaceholderDiv />
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;