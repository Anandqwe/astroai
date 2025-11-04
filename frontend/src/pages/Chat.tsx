import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ChatMessage from '../components/ChatMessage';
import SuggestedQuestions from '../components/SuggestedQuestions';
import ChatHistory from '../components/ChatHistory';
import { AnimatedButton, AnimatedInput, Tooltip } from '../components/MicroInteractions';
import { aiService } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';
import { showToast } from '../utils/toast';
import { exportService } from '../utils/export';
import { FaDownload } from 'react-icons/fa';

const CHAT_STORAGE_KEY = 'astroai_chat_history';

const loadChatHistory = (): ChatMessageType[] => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch {
    return [];
  }
};

const saveChatHistory = (messages: ChatMessageType[]): void => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save chat history:', err);
  }
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputControls = useAnimation();

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Save chat history when messages change (for backward compatibility)
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
      scrollToBottom();
    }
  }, [messages]);

  const handleLoadConversation = (loadedMessages: ChatMessageType[]) => {
    setMessages(loadedMessages);
    setHistoryOpen(false); // Close sidebar on mobile after loading
  };

  const handleSendMessage = async (messageOverride?: string): Promise<void> => {
    const messageToSend = messageOverride || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    // Particle burst animation
    const buttonRect = document.querySelector('.send-button')?.getBoundingClientRect();
    if (buttonRect) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    }

    // Input animation
    inputControls.start({
      scale: [1, 0.98, 1],
      transition: { duration: 0.3 }
    });

    // Only add user message if not regenerating (regenerate already has user message in chat)
    if (!messageOverride) {
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        message: messageToSend,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }
    
    setIsLoading(true);

    try {
      const response = await aiService.chat(messageToSend);
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: response.response || 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      showToast.success('Response received from Astro AI! 🤖');
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check for API key error
      const isApiKeyError = error?.response?.status === 403 || 
                           error?.response?.data?.code === 'API_KEY_ERROR' ||
                           error?.response?.data?.error?.toLowerCase().includes('api key');
      
      const errorDetails = error?.response?.data?.details || error?.response?.data?.error || '';
      const userFriendlyMessage = isApiKeyError 
        ? '🔑 API Key Issue: Please update your GEMINI_API_KEY in the server .env file. Generate a new key at https://aistudio.google.com/app/apikey'
        : error?.response?.data?.error || 'Sorry, I\'m having trouble connecting right now. Please try again later.';
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: userFriendlyMessage,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      if (isApiKeyError) {
        showToast.error('API Key Error - Check server configuration');
      } else {
        showToast.error('Failed to connect to AI. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = (): void => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
    showToast.info('Chat history cleared');
  };

  const exportChat = (): void => {
    if (messages.length === 0) {
      showToast.info('No chat history to export');
      return;
    }
    try {
      exportService.exportChatHistory(messages);
      showToast.success('Chat history exported!');
    } catch (err) {
      showToast.error('Failed to export chat history');
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5 relative overflow-hidden">
      {/* Chat History Sidebar */}
      <ChatHistory
        currentMessages={messages}
        onLoadConversation={handleLoadConversation}
        onClearCurrent={() => {
          setMessages([]);
          localStorage.removeItem(CHAT_STORAGE_KEY);
        }}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(124, 58, 237, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Particle effects container */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-primary"
            initial={{ x: particle.x, y: particle.y, scale: 1, opacity: 1 }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 200,
              y: particle.y + (Math.random() - 0.5) * 200,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-300 ${historyOpen ? 'lg:ml-64' : ''}`}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FaRobot className="text-6xl text-primary" />
            </motion.div>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-full bg-clip-text text-transparent">
            Ask Astro AI
          </h1>
          <p className="text-lg text-gray-400">
            Your intelligent space companion. Ask me anything about the cosmos!
          </p>
        </motion.div>

        <motion.div
          className="bg-dark-card/80 border border-primary/20 rounded-2xl backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Chat Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
            {messages.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FaRobot className="text-5xl text-primary/30 mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg mb-2">Start a conversation!</p>
                <p className="text-gray-500 text-sm mb-6">
                  Ask me about planets, stars, asteroids, or anything space-related
                </p>
                <SuggestedQuestions onQuestionClick={(question) => {
                  setInputMessage(question);
                  // Auto-focus on input after setting question
                  setTimeout(() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    input?.focus();
                  }, 100);
                }} />
              </motion.div>
            ) : (
              <>
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: index * 0.05
                      }}
                    >
                      <ChatMessage
                        message={msg.message}
                        sender={msg.sender}
                        timestamp={msg.timestamp}
                        onRegenerate={msg.sender === 'ai' && index > 0 ? () => {
                          // Find the user message that preceded this AI response
                          const userMessage = messages[index - 1];
                          if (userMessage && userMessage.sender === 'user') {
                            // Remove the current AI response and regenerate
                            const newMessages = messages.slice(0, index);
                            setMessages(newMessages);
                            // Regenerate response
                            handleSendMessage(userMessage.message);
                          }
                        } : undefined}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="flex gap-4 mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <div className="flex-1">
                      <div className="bg-dark-card border border-primary/20 rounded-xl px-4 py-3 inline-block">
                        <div className="flex gap-2">
                          <motion.span
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.span
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          />
                          <motion.span
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <motion.div
            className="border-t border-primary/20 p-4 bg-dark-darker/50"
            animate={inputControls}
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <AnimatedInput
                  type="textarea"
                  placeholder="Ask me about space... (Press Enter to send, Shift+Enter for new line)"
                  value={inputMessage}
                  onChange={setInputMessage}
                  disabled={isLoading}
                  className="w-full"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    // Send on Enter, new line on Shift+Enter
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading && inputMessage.trim()) {
                        handleSendMessage();
                      }
                    }
                  }}
                />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Tooltip content="Send message (Enter)" position="top">
                  <AnimatedButton
                    onClick={() => {
                      if (!isLoading && inputMessage.trim()) {
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading || !inputMessage.trim()}
                    variant="primary"
                    size="sm"
                    className="send-button"
                  >
                    <FaPaperPlane />
                  </AnimatedButton>
                </Tooltip>
                {messages.length > 0 && (
                  <>
                    <Tooltip content="Export chat history" position="top">
                      <AnimatedButton
                        onClick={exportChat}
                        variant="outline"
                        size="sm"
                      >
                        <FaDownload />
                      </AnimatedButton>
                    </Tooltip>
                    <Tooltip content="Clear chat" position="top">
                      <AnimatedButton
                        onClick={clearChat}
                        variant="outline"
                        size="sm"
                      >
                        <FaTrash />
                      </AnimatedButton>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
