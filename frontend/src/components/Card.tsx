import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CardProps } from '../types';
import ImageModal from './ImageModal';
import ShareButtons from './ShareButtons';
import LazyImage from './LazyImage';

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite,
  className = '' 
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    if (imageUrl) {
      setModalOpen(true);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // If onClick is provided and it's not the image being clicked
    if (onClick && !modalOpen) {
      onClick(e);
    }
  };

  return (
    <>
      <motion.div 
        className={`
          bg-dark-card/80 border border-primary/20 rounded-xl overflow-hidden cursor-pointer 
          transition-all duration-300 h-full flex flex-col hover-glow
          hover:border-primary
          ${className}
        `} 
        onClick={handleCardClick}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {imageUrl && (
          <div 
            className="relative w-full h-56 overflow-hidden bg-dark-darker group"
            onClick={handleImageClick}
          >
            <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
              <LazyImage 
                src={imageUrl} 
                alt={title}
                className="w-full h-full"
              />
            </div>
            
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-card/90 px-4 py-2 rounded-lg border border-primary/30">
                Click to expand
              </span>
            </div>
            {onToggleFavorite && (
              <button 
                className="absolute top-4 right-4 bg-black/70 border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-gray-400 text-lg transition-all duration-300 z-10 hover:bg-black/90 hover:scale-110"
                onClick={handleFavoriteClick}
                aria-label="Toggle favorite"
              >
                {isFavorite ? 
                  <FaHeart className="text-accent animate-pulse" /> : 
                  <FaRegHeart />
                }
              </button>
            )}
          </div>
        )}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-gray-400 leading-relaxed text-base flex-1 mb-3">
              {description.length > 150 
                ? `${description.substring(0, 150)}...` 
                : description}
            </p>
          )}
          {/* Share Buttons */}
          <div className="mt-auto pt-3 border-t border-primary/10">
            <ShareButtons
              title={title}
              text={description || title}
              imageUrl={imageUrl}
              variant="compact"
              position="inline"
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        image={{
          url: imageUrl || '',
          title: title,
          explanation: description
        }}
      />
    </>
  );
};

export default Card;
