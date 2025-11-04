import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ChatMessage } from '../types';
import { showToast } from '../utils/toast';

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatHistoryProps {
  currentMessages: ChatMessage[];
  onLoadConversation: (messages: ChatMessage[]) => void;
  onClearCurrent: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CONVERSATIONS_KEY = 'astroai_conversations';

const saveConversation = (conversation: Conversation): void => {
  try {
    const conversations = getConversations();
    const existing = conversations.findIndex(c => c.id === conversation.id);
    
    if (existing >= 0) {
      conversations[existing] = conversation;
    } else {
      conversations.unshift(conversation); // Add to beginning
    }
    
    // Keep only last 20 conversations
    const limited = conversations.slice(0, 20);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(limited));
  } catch (err) {
    console.error('Failed to save conversation:', err);
  }
};

const getConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
};

const deleteConversation = (id: string): void => {
  try {
    const conversations = getConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete conversation:', err);
  }
};

const getConversationTitle = (messages: ChatMessage[]): string => {
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  if (firstUserMessage) {
    const text = firstUserMessage.message;
    return text.length > 40 ? `${text.substring(0, 40)}...` : text;
  }
  return 'New Conversation';
};

const ChatHistory: React.FC<ChatHistoryProps> = ({
  currentMessages,
  onLoadConversation,
  onClearCurrent,
  isOpen,
  onToggle,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Save current conversation when messages change
  useEffect(() => {
    if (currentMessages.length > 0) {
      const title = getConversationTitle(currentMessages);
      const now = new Date();
      
      // Use existing ID if we have one, otherwise create new
      const convId = currentConversationId || `conv_${Date.now()}`;
      
      // Get existing conversation to preserve createdAt
      const existingConv = conversations.find(c => c.id === convId);
      
      const conversation: Conversation = {
        id: convId,
        title,
        messages: currentMessages,
        createdAt: existingConv?.createdAt || now,
        updatedAt: now,
      };
      
      saveConversation(conversation);
      setCurrentConversationId(convId);
      loadConversations();
    }
  }, [currentMessages, currentConversationId]);

  const loadConversations = () => {
    setConversations(getConversations());
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleLoadConversation = (conv: Conversation) => {
    onLoadConversation(conv.messages);
    setCurrentConversationId(conv.id);
    showToast.success('Conversation loaded');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      deleteConversation(id);
      loadConversations();
      if (currentConversationId === id) {
        onClearCurrent();
        setCurrentConversationId(null);
      }
      showToast.info('Conversation deleted');
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Toggle Button - Only show when sidebar is closed or on mobile */}
      <motion.button
        className={`fixed top-24 ${isOpen ? 'left-64 lg:left-64' : 'left-4'} z-40 w-10 h-10 rounded-lg bg-dark-card/90 hover:bg-dark-card border border-primary/30 hover:border-primary/60 flex items-center justify-center text-primary hover:text-white transition-all duration-300 shadow-lg`}
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isOpen ? 'Hide history' : 'Show history'}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />
            
            {/* Sidebar */}
            <motion.div
              className="fixed top-[70px] left-0 h-[calc(100vh-70px)] w-64 bg-dark-card/95 backdrop-blur-xl border-r border-primary/20 z-40 flex flex-col shadow-2xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-primary/20">
                <h3 className="text-lg font-bold text-white mb-1">Chat History</h3>
                <p className="text-xs text-gray-400">{conversations.length} conversations</p>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {conversations.length === 0 ? (
                  <motion.div
                    className="text-center py-8 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaClock className="text-4xl text-primary/30 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No conversations yet</p>
                    <p className="text-xs text-gray-500 mt-2">Start chatting to save history</p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <motion.div
                        key={conv.id}
                        className={`group relative p-3 rounded-lg border cursor-pointer transition-all ${
                          currentConversationId === conv.id
                            ? 'bg-primary/20 border-primary/50'
                            : 'bg-dark-darker/50 border-primary/10 hover:border-primary/30 hover:bg-dark-darker'
                        }`}
                        onClick={() => handleLoadConversation(conv)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Delete Button */}
                        <motion.button
                          className="absolute top-2 right-2 w-6 h-6 rounded opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash className="text-xs" />
                        </motion.button>

                        {/* Title */}
                        <p className="text-sm font-medium text-white mb-1 pr-6 truncate">
                          {conv.title}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{conv.messages.length} messages</span>
                          <span>•</span>
                          <span>{formatDate(conv.updatedAt)}</span>
                        </div>

                        {/* Active Indicator */}
                        {currentConversationId === conv.id && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-primary/20">
                <p className="text-xs text-gray-500 text-center">
                  {conversations.length}/20 conversations saved
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatHistory;

