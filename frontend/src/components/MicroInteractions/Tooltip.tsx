import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 0.2,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-50 px-3 py-2 rounded-lg text-sm font-rajdhani
              bg-gradient-to-r from-primary to-secondary text-white
              whitespace-nowrap shadow-lg
              ${positionClasses[position]}
            `}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              duration: 0.2,
              delay,
            }}
          >
            {content}
            
            {/* Tooltip arrow */}
            <motion.div
              className={`
                absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary
                transform rotate-45
                ${
                  position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                  position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                  position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                  'left-[-4px] top-1/2 -translate-y-1/2'
                }
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tooltip;
