import React from 'react';
import { motion } from 'framer-motion';

/**
 * Empty State Component
 * Shows when there's no data to display
 */

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center py-16 px-5 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Icon */}
      <motion.div
        className="text-7xl mb-6"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {typeof icon === 'string' ? icon : icon}
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-3xl font-bold mb-3 text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;

