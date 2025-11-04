import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaRedo } from 'react-icons/fa';
import { ChatMessageProps } from '../types';
import { showToast } from '../utils/toast';

interface ChatMessageWithActionsProps extends ChatMessageProps {
  onRegenerate?: () => void;
}

const ChatMessage: React.FC<ChatMessageWithActionsProps> = ({ 
  message, 
  sender, 
  timestamp,
  onRegenerate 
}) => {
  const isUser = sender === 'user';
  const [isHovering, setIsHovering] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
      showToast.success('Copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      showToast.error('Failed to copy');
    }
  };

  return (
    <div 
      className={`flex gap-4 mb-5 animate-[slideIn_0.3s_ease-out] group ${isUser ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`
        w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-card
        ${isUser ? 'bg-gradient-accent' : 'bg-gradient-primary'}
      `}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={`flex-1 max-w-[70%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`flex items-center gap-2.5 mb-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold text-white text-sm">
            {isUser ? 'You' : 'Astro AI'}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-400 opacity-70">
              {new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </div>
        <div className="relative">
          <div className={`
            rounded-xl px-4 py-3 text-white leading-relaxed text-base whitespace-pre-wrap break-words relative
            ${isUser 
              ? 'bg-primary/20 border border-primary' 
              : 'bg-dark-card border border-primary/20'
            }
          `}>
            {message}
          </div>
          
          {/* Message Actions (appear on hover) */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                className={`absolute ${isUser ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 flex gap-2 z-10`}
                initial={{ opacity: 0, scale: 0.8, x: isUser ? -10 : 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: isUser ? -10 : 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Copy Button */}
                <motion.button
                  className="w-8 h-8 rounded-lg bg-dark-card/90 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy message"
                >
                  <FaCopy className="text-xs" />
                </motion.button>
                
                {/* Regenerate Button (only for AI messages) */}
                {!isUser && onRegenerate && (
                  <motion.button
                    className="w-8 h-8 rounded-lg bg-dark-card/90 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all"
                    onClick={onRegenerate}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Regenerate response"
                  >
                    <FaRedo className="text-xs" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
