import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDownload, FaSearchPlus, FaSearchMinus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    url: string;
    title?: string;
    date?: string;
    explanation?: string;
  };
  images?: Array<{
    url: string;
    title?: string;
    date?: string;
    explanation?: string;
  }>;
  currentIndex?: number;
  onNavigate?: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  image,
  images = [],
  currentIndex = 0,
  onNavigate
}) => {
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset zoom when image changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setImageLoaded(false);
    }
  }, [isOpen, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 0 && currentIndex > 0) {
        onNavigate?.(currentIndex - 1);
      }
      if (e.key === 'ArrowRight' && images.length > 0 && currentIndex < images.length - 1) {
        onNavigate?.(currentIndex + 1);
      }
      if (e.key === '+' || e.key === '=') {
        setZoom(prev => Math.min(prev + 0.25, 3));
      }
      if (e.key === '-' || e.key === '_') {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `astroai-${image.title?.replace(/\s+/g, '-') || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate?.(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate?.(currentIndex + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Header Controls */}
        <motion.div
          className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              {image.title && (
                <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
              )}
              {image.date && (
                <p className="text-sm text-gray-400">{image.date}</p>
              )}
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <motion.button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom Out (- key)"
              >
                <FaSearchMinus />
              </motion.button>

              <span className="text-white font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <motion.button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom In (+ key)"
              >
                <FaSearchPlus />
              </motion.button>

              {/* Download Button */}
              <motion.button
                onClick={handleDownload}
                className="p-3 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download Image"
              >
                <FaDownload />
              </motion.button>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="p-3 bg-dark-card/80 hover:bg-red-500/80 border border-primary/30 hover:border-red-500/50 rounded-lg text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Close (ESC)"
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Image Container */}
        <div
          className="relative w-full h-full flex items-center justify-center p-20"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            src={image.url}
            alt={image.title || 'Full screen image'}
            className="max-w-full max-h-full object-contain cursor-zoom-in"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease-out'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: zoom, opacity: imageLoaded ? 1 : 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => {
              if (zoom === 1) {
                setZoom(2);
              } else {
                setZoom(1);
              }
            }}
          />

          {/* Loading Indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              {currentIndex > 0 && (
                <motion.button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-full text-white"
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  title="Previous (← key)"
                >
                  <FaChevronLeft size={24} />
                </motion.button>
              )}

              {/* Next Button */}
              {currentIndex < images.length - 1 && (
                <motion.button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-dark-card/80 hover:bg-dark-card border border-primary/30 rounded-full text-white"
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  title="Next (→ key)"
                >
                  <FaChevronRight size={24} />
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Bottom Info Panel */}
        {image.explanation && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent max-h-[30vh] overflow-y-auto custom-scrollbar"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-300 text-sm leading-relaxed">
                {image.explanation}
              </p>
            </div>
          </motion.div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <motion.div
            className="absolute bottom-6 right-6 px-4 py-2 bg-dark-card/80 border border-primary/30 rounded-full text-white font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {currentIndex + 1} / {images.length}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;

