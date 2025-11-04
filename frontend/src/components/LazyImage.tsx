import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3Ctext fill="%236366f1" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading...%3C/text%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the image
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              onLoad?.();
            };
            
            img.onerror = () => {
              setHasError(true);
              onError?.();
              // Set a fallback error image
              setImageSrc('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3Ctext fill="%23ef4444" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E');
            };
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      observer.disconnect();
    };
  }, [src, threshold, rootMargin, onLoad, onError]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-70'
        }`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0.7,
          scale: isLoaded ? 1 : 1.02
        }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Loading shimmer effect */}
      {!isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-darker/50">
          <span className="text-red-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;

