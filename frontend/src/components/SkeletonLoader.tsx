import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Loader Components
 * Beautiful loading placeholders while data is being fetched
 */

interface SkeletonProps {
  className?: string;
}

// Base Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

// Skeleton Card for Mars Photos / APOD
export const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      className="bg-dark-card/80 border border-primary/20 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />
      
      {/* Content skeleton */}
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </motion.div>
  );
};

// Skeleton Grid
interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ 
  count = 6, 
  columns = 3 
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// Skeleton for Asteroid List Item
export const SkeletonAsteroidItem: React.FC = () => {
  return (
    <motion.div
      className="bg-dark-card/80 border border-primary/20 rounded-xl p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton List for Asteroids
interface SkeletonListProps {
  count?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonAsteroidItem key={index} />
      ))}
    </div>
  );
};

// Skeleton for Chat Message
export const SkeletonChatMessage: React.FC = () => {
  return (
    <motion.div
      className="flex gap-4 mb-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </motion.div>
  );
};

// Skeleton for Large Content (APOD)
export const SkeletonAPOD: React.FC = () => {
  return (
    <motion.div
      className="bg-dark-card/80 border border-primary/20 rounded-2xl overflow-hidden grid md:grid-cols-2 gap-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Skeleton className="w-full h-full min-h-[400px]" />
      <div className="p-10 flex flex-col justify-center">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-5 w-24 mb-5" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </motion.div>
  );
};

export default Skeleton;

