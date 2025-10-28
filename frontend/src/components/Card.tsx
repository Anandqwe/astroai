import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite,
  className = '' 
}) => {
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <motion.div 
      className={`
        bg-dark-card/80 border border-primary/20 rounded-xl overflow-hidden cursor-pointer 
        transition-all duration-300 h-full flex flex-col hover-glow
        hover:border-primary
        ${className}
      `} 
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {imageUrl && (
        <div className="relative w-full h-56 overflow-hidden bg-dark-darker">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
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
          <p className="text-gray-400 leading-relaxed text-base flex-1">
            {description.length > 150 
              ? `${description.substring(0, 150)}...` 
              : description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
