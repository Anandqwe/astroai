import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaExpand } from 'react-icons/fa';

interface CarouselImage {
  id: number | string;
  img_src: string;
  earth_date?: string;
  camera?: {
    name?: string;
    full_name?: string;
  };
  rover?: {
    name?: string;
  };
}

interface ImageCarouselProps {
  images: CarouselImage[];
  onImageClick?: (image: CarouselImage, index: number) => void;
  autoPlay?: boolean;
  interval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImageClick,
  autoPlay = false,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, images.length]);

  // Reset image loaded state when index changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No images available
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full">
      {/* Main Image Container */}
      <div className="relative bg-dark-darker rounded-2xl overflow-hidden aspect-video mb-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={currentImage.img_src}
              alt={`${currentImage.rover?.name || 'Mars'} - ${currentImage.camera?.full_name || 'Photo'}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick?.(currentImage, currentIndex)}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Loading Indicator */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-darker">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {currentImage.rover?.name || 'Mars Rover'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {currentImage.camera?.full_name || currentImage.camera?.name || 'Camera'}
                  </p>
                  {currentImage.earth_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(currentImage.earth_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Expand Button */}
                {onImageClick && (
                  <motion.button
                    onClick={() => onImageClick(currentImage, currentIndex)}
                    className="p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-lg text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="View Full Screen"
                  >
                    <FaExpand />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-full text-white z-10"
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              title="Previous"
            >
              <FaChevronLeft size={20} />
            </motion.button>

            <motion.button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-full text-white z-10"
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.95 }}
              title="Next"
            >
              <FaChevronRight size={20} />
            </motion.button>
          </>
        )}

        {/* Controls Overlay (top-right) */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlayPause}
              className="p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-lg text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </motion.button>

            {/* Counter */}
            <div className="px-4 py-2 bg-dark-card/80 border border-primary/30 rounded-lg text-white font-medium text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                  : 'border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => handleThumbnailClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image.img_src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Active Indicator */}
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-primary/20 border-2 border-primary"
                  layoutId="activeThumb"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && isPlaying && (
        <div className="mt-2 h-1 bg-dark-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: interval / 1000,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

