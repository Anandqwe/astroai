import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import ChatMessage from '../components/ChatMessage';
import { AnimatedButton, AnimatedInput, Tooltip } from '../components/MicroInteractions';
import { aiService } from '../services/api';
import { ChatMessage as ChatMessageType } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputControls = useAnimation();

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  useEffect(() => {
    // Only auto-scroll when new messages are added
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;

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

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.chat(inputMessage);
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: response.response || 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = (): void => {
    setMessages([]);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5 relative overflow-hidden">
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

      <div className="max-w-5xl mx-auto relative z-10">
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
                <p className="text-gray-500 text-sm">
                  Ask me about planets, stars, asteroids, or anything space-related
                </p>
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
                  placeholder="Ask me about space..."
                  value={inputMessage}
                  onChange={setInputMessage}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Tooltip content="Send message" position="top">
                  <AnimatedButton
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    variant="primary"
                    size="sm"
                    className="send-button"
                  >
                    <FaPaperPlane />
                  </AnimatedButton>
                </Tooltip>
                {messages.length > 0 && (
                  <Tooltip content="Clear chat" position="top">
                    <AnimatedButton
                      onClick={clearChat}
                      variant="outline"
                      size="sm"
                    >
                      <FaTrash />
                    </AnimatedButton>
                  </Tooltip>
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
