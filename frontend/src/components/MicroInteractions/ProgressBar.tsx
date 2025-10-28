import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  showPercentage = true,
  size = 'md',
  variant = 'primary',
  label,
  className = '',
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate to new progress value
  React.useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, animated]);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantGradients = {
    primary: 'from-primary to-secondary',
    secondary: 'from-secondary to-accent',
    accent: 'from-accent to-primary',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    error: 'from-red-500 to-pink-500',
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <motion.div className="flex justify-between items-center">
          <label className="text-gray-300 font-rajdhani text-sm font-semibold">
            {label}
          </label>
          {showPercentage && (
            <motion.span
              className="text-primary font-rajdhani text-sm font-bold"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              {Math.round(displayProgress)}%
            </motion.span>
          )}
        </motion.div>
      )}

      <div className={`relative w-full ${sizeClasses[size]} rounded-full bg-dark-darker/60 overflow-hidden border border-gray-600/50`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${variantGradients[variant]} shadow-lg shadow-primary/50`}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{
            duration: animated ? 0.8 : 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['100%', '-100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.div>

        {/* Animated border glow */}
        <motion.div
          className={`absolute inset-0 rounded-full pointer-events-none ${sizeClasses[size]}`}
          animate={{
            boxShadow: [
              `inset 0 0 0px rgba(124, 58, 237, 0), 0 0 10px rgba(124, 58, 237, 0.3)`,
              `inset 0 0 0px rgba(124, 58, 237, 0), 0 0 20px rgba(124, 58, 237, 0.6)`,
              `inset 0 0 0px rgba(124, 58, 237, 0), 0 0 10px rgba(124, 58, 237, 0.3)`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
