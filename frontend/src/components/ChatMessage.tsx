import React from 'react';
import { ChatMessageProps } from '../types';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`flex gap-4 mb-5 animate-[slideIn_0.3s_ease-out] ${isUser ? 'flex-row-reverse' : ''}`}>
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
        <div className={`
          rounded-xl px-4 py-3 text-white leading-relaxed text-base whitespace-pre-wrap break-words
          ${isUser 
            ? 'bg-primary/20 border border-primary' 
            : 'bg-dark-card border border-primary/20'
          }
        `}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
