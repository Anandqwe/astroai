import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

/**
 * Error Retry Component
 * Shows when data fails to load with a retry button
 */

interface ErrorRetryProps {
  error?: string;
  onRetry: () => void;
  title?: string;
  className?: string;
}

const ErrorRetry: React.FC<ErrorRetryProps> = ({
  error = 'Failed to load data',
  onRetry,
  title = 'Oops! Something went wrong',
  className = '',
}) => {
  return (
    <motion.div
      className={`bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 text-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Error Icon */}
      <motion.div
        className="text-6xl text-red-500 mb-4 inline-block"
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <FaExclamationTriangle />
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>

      {/* Error Message */}
      <p className="text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
        {error}
      </p>

      {/* Retry Button */}
      <motion.button
        onClick={onRetry}
        className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-3 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRedo />
        Try Again
      </motion.button>
    </motion.div>
  );
};

export default ErrorRetry;

