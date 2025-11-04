import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaLink, FaShare } from 'react-icons/fa';
import { showToast } from '../utils/toast';

interface ShareButtonsProps {
  title: string;
  text?: string;
  url?: string;
  imageUrl?: string;
  className?: string;
  variant?: 'compact' | 'full';
  position?: 'inline' | 'dropdown';
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  text = '',
  url,
  imageUrl,
  className = '',
  variant = 'compact',
  position = 'inline',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use current page URL if not provided
  const shareUrl = url || window.location.href;
  const shareText = text || title;
  const shareTitle = `${shareText} - Check out this on AstroAI!`;

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast.success('Link copied to clipboard! 🔗');
      setIsOpen(false);
    } catch (err) {
      showToast.error('Failed to copy link');
    }
  };

  // Compact variant (just icons)
  if (variant === 'compact' && position === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <motion.button
          className="w-8 h-8 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all"
          onClick={shareOnTwitter}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Share on Twitter"
        >
          <FaTwitter className="text-sm" />
        </motion.button>
        <motion.button
          className="w-8 h-8 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all"
          onClick={shareOnFacebook}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Share on Facebook"
        >
          <FaFacebook className="text-sm" />
        </motion.button>
        <motion.button
          className="w-8 h-8 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all"
          onClick={copyLink}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Copy link"
        >
          <FaLink className="text-sm" />
        </motion.button>
      </div>
    );
  }

  // Dropdown variant
  if (position === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          className="px-3 py-2 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center gap-2 text-primary hover:text-white transition-all"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaShare className="text-sm" />
          <span className="text-sm font-medium">Share</span>
        </motion.button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-dark-card border border-primary/30 rounded-xl p-2 z-50 shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-darker/50 transition-colors text-left text-gray-300 hover:text-white"
                onClick={shareOnTwitter}
                whileHover={{ x: 5 }}
              >
                <FaTwitter className="text-primary" />
                <span className="text-sm font-medium">Share on Twitter</span>
              </motion.button>
              
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-darker/50 transition-colors text-left text-gray-300 hover:text-white"
                onClick={shareOnFacebook}
                whileHover={{ x: 5 }}
              >
                <FaFacebook className="text-primary" />
                <span className="text-sm font-medium">Share on Facebook</span>
              </motion.button>
              
              <div className="h-px bg-primary/20 my-2" />
              
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-darker/50 transition-colors text-left text-gray-300 hover:text-white"
                onClick={copyLink}
                whileHover={{ x: 5 }}
              >
                <FaLink className="text-primary" />
                <span className="text-sm font-medium">Copy link</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    );
  }

  // Full variant with labels
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs text-gray-400 font-medium">Share:</span>
      <div className="flex gap-2">
        <motion.button
          className="px-4 py-2 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center gap-2 text-primary hover:text-white transition-all text-sm"
          onClick={shareOnTwitter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTwitter />
          <span>Twitter</span>
        </motion.button>
        <motion.button
          className="px-4 py-2 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center gap-2 text-primary hover:text-white transition-all text-sm"
          onClick={shareOnFacebook}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFacebook />
          <span>Facebook</span>
        </motion.button>
        <motion.button
          className="px-4 py-2 rounded-lg bg-dark-card/80 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center gap-2 text-primary hover:text-white transition-all text-sm"
          onClick={copyLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaLink />
          <span>Copy Link</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ShareButtons;

