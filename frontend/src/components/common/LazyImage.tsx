'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  rootMargin?: string;
  threshold?: number;
  quality?: number;
}

interface WebPSupport {
  supported: boolean;
  checked: boolean;
}

let webpSupport: WebPSupport = {
  supported: false,
  checked: false,
};

// Check WebP support
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (webpSupport.checked) {
      resolve(webpSupport.supported);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      webpSupport.checked = true;
      webpSupport.supported = false;
      resolve(false);
      return;
    }

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 1, 1);

    const webpData = canvas.toDataURL('image/webp');
    webpSupport.checked = true;
    webpSupport.supported = webpData.indexOf('data:image/webp') === 0;

    resolve(webpSupport.supported);
  });
};

export default function LazyImage({
  src,
  webpSrc,
  alt,
  width = 300,
  height = 300,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC13ZWlnaHQ9IjUwMCI+TG9hZGluZy4uLjwvdGV4dD4KPHN2Zz4K',
  blurDataURL,
  onLoad,
  onError,
  priority = false,
  rootMargin = '50px',
  threshold = 0.1,
  quality = 75,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [useWebP, setUseWebP] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check WebP support on mount
  useEffect(() => {
    if (webpSrc) {
      checkWebPSupport().then(setUseWebP);
    }
  }, [webpSrc]);

  // Update image source based on WebP support and loading state
  useEffect(() => {
    if (isInView && !hasError) {
      const finalSrc = useWebP && webpSrc ? webpSrc : src;
      setImageSrc(finalSrc);
    }
  }, [isInView, useWebP, webpSrc, src, hasError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [priority, rootMargin, threshold]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setImageSrc(placeholder);
    if (onError) onError();
  }, [onError, placeholder]);

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm font-medium">
            {isInView ? 'Loading...' : 'Image'}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center border border-gray-200"
          style={{ width, height }}
        >
          <div className="text-center text-gray-500">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs">Failed to load</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* WebP indicator for development */}
      {process.env.NODE_ENV === 'development' && useWebP && webpSrc && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
          WebP
        </div>
      )}
    </div>
  );
}

/**
 * Image Gallery with Lazy Loading
 */
interface LazyImageGalleryProps {
  images: Array<{
    src: string;
    webpSrc?: string;
    alt: string;
    caption?: string;
    id?: string;
  }>;
  columns?: number;
  gap?: number;
  imageClassName?: string;
  galleryClassName?: string;
  onImageClick?: (image: any, index: number) => void;
  priority?: number; // Number of images to load with priority
}

export function LazyImageGallery({
  images,
  columns = 4,
  gap = 16,
  imageClassName = '',
  galleryClassName = '',
  onImageClick,
  priority = 2,
}: LazyImageGalleryProps) {
  return (
    <div
      className={`grid ${galleryClassName}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className={`group cursor-pointer ${imageClassName}`}
          onClick={() => onImageClick?.(image, index)}
        >
          <LazyImage
            src={image.src}
            webpSrc={image.webpSrc}
            alt={image.alt}
            className="rounded-lg group-hover:scale-105 transition-transform duration-200"
            priority={index < priority}
            width={300}
            height={300}
          />
          {image.caption && (
            <p className="mt-2 text-sm text-gray-600 text-center line-clamp-2">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Progressive Image with multiple sizes
 */
interface ProgressiveImageProps {
  srcSet: {
    small: string;
    medium: string;
    large: string;
    webpSmall?: string;
    webpMedium?: string;
    webpLarge?: string;
  };
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  srcSet,
  alt,
  className = '',
  priority = false,
}: ProgressiveImageProps) {
  const [useWebP, setUseWebP] = useState(false);

  useEffect(() => {
    checkWebPSupport().then(setUseWebP);
  }, []);

  const getSrcSet = () => {
    if (useWebP && srcSet.webpSmall && srcSet.webpMedium && srcSet.webpLarge) {
      return `${srcSet.webpSmall} 300w, ${srcSet.webpMedium} 600w, ${srcSet.webpLarge} 1200w`;
    }
    return `${srcSet.small} 300w, ${srcSet.medium} 600w, ${srcSet.large} 1200w`;
  };

  const getSrc = () => {
    if (useWebP && srcSet.webpMedium) {
      return srcSet.webpMedium;
    }
    return srcSet.medium;
  };

  return (
    <LazyImage
      src={getSrc()}
      alt={alt}
      className={className}
      priority={priority}
      width={600}
      height={400}
    />
  );
}
