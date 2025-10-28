import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaRocket, FaSatellite, FaRobot, FaChartLine, FaArrowRight } from 'react-icons/fa';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { AnimatedButton, Tooltip } from '../components/MicroInteractions';
import { usePrefersReducedMotion } from '../hooks/useAccessibility';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Parallax effects - disabled for users with reduced motion preference
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -200]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -400]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleGetStarted = (): void => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <FaSatellite />,
      title: 'NASA Data',
      description: 'Access real-time data from NASA APIs including Astronomy Picture of the Day, Mars Rover images, and near-Earth asteroid tracking.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaRobot />,
      title: 'AI Assistant',
      description: 'Ask Astro AI anything about space! Get intelligent answers powered by advanced AI technology and comprehensive space knowledge.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaChartLine />,
      title: 'Data Visualization',
      description: 'Visualize asteroid trajectories, analyze Mars missions, and explore space data through interactive charts and predictions.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-180px)]">
      {/* Hero Section */}
      <section className="min-h-[700px] flex items-center justify-center text-center py-20 px-5 relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)]"
          style={{ y: y2 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)]"
          style={{ y: y1, opacity }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
        >
          {/* Animated Rocket Icon */}
          <motion.div 
            className="text-8xl text-primary mb-8 inline-block"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <FaRocket />
          </motion.div>

          {/* Animated particles when hovering */}
          {isHovering && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    left: '50%',
                    top: '20%',
                  }}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    x: [0, Math.cos((i / 8) * Math.PI * 2) * 100],
                    y: [0, Math.sin((i / 8) * Math.PI * 2) * 100],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          <motion.h1 
            className="text-6xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to{' '}
            <motion.span 
              className="bg-gradient-full bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              AstroAI
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-400 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Your intelligent companion for exploring the cosmos through NASA data and AI-powered insights
          </motion.p>

          <Tooltip content="Start exploring space data" position="bottom">
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.span>
            </AnimatedButton>
          </Tooltip>
        </motion.div>
      </section>      {/* Features Section */}
      <section className="py-20 px-5 bg-dark-card/30 relative overflow-hidden">
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInWhenVisible delay={0.2}>
            <h2 className="text-center text-5xl font-black mb-16 text-white">
              Explore the Universe
            </h2>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2} direction="up">
                <motion.div 
                  className="bg-dark-card/80 border border-primary/20 rounded-2xl p-10 text-center relative overflow-hidden group h-full"
                  whileHover={{ 
                    y: -10,
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Animated icon */}
                  <motion.div 
                    className="text-6xl text-primary mb-6 flex justify-center relative z-10"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-3xl font-bold mb-5 text-white relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg relative z-10">
                    {feature.description}
                  </p>

                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                      filter: 'blur(20px)',
                    }}
                  />
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-5 text-center relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))] -z-10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        <FadeInWhenVisible>
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.h2 
              className="text-5xl font-black mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Explore?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Start your journey through the cosmos today
            </motion.p>
            <motion.button 
              className="bg-gradient-primary text-white px-10 py-4 rounded-lg text-lg font-semibold relative overflow-hidden group"
              onClick={handleGetStarted}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  opacity: 0.3,
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Launch Dashboard
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
              </span>
            </motion.button>
          </div>
        </FadeInWhenVisible>
      </section>
    </div>
  );
};

export default Home;
