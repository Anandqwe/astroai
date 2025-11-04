import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ExpandableCardProps {
  title: string | React.ReactNode;
  summary: string;
  details: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  summary,
  details,
  defaultExpanded = false,
  className = '',
  variant = 'default',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const isCompact = variant === 'compact';

  return (
    <motion.div
      className={`bg-dark-card/80 border border-primary/20 rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}
    >
      {/* Header */}
      <div
        className={`${isCompact ? 'p-4' : 'p-6'} cursor-pointer flex items-start justify-between gap-4 group`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className={`font-bold text-white mb-2 ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h3>
          <p className={`text-gray-400 ${isCompact ? 'text-sm' : 'text-base'} leading-relaxed`}>
            {summary}
          </p>
        </div>
        
        {/* Expand/Collapse Icon */}
        <motion.div
          className="flex-shrink-0 mt-1"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:text-white transition-all">
            <FaChevronDown className="text-sm" />
          </div>
        </motion.div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`${isCompact ? 'px-4 pb-4' : 'px-6 pb-6'} pt-0 border-t border-primary/10`}>
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`text-gray-300 ${isCompact ? 'text-sm' : 'text-base'} leading-relaxed mt-4`}
              >
                {details}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableCard;

