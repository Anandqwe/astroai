import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaRocket, FaCode, FaBrain } from 'react-icons/fa';
import { Tooltip } from '../components/MicroInteractions';

const About: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl text-primary mx-auto mb-6 inline-block"
          >
            <FaRocket />
          </motion.div>
          <motion.h1 
            className="text-5xl font-black mb-4 bg-gradient-full bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            About AstroAI
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your gateway to exploring the cosmos through cutting-edge AI technology and real-time NASA data
          </motion.p>
        </motion.div>

        {/* Project Description */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-dark-card/80 border border-primary/20 rounded-2xl p-8 backdrop-blur-md hover:border-primary/40 transition-all duration-300">
            <h2 className="text-3xl font-bold mb-6 text-white">What is AstroAI?</h2>
            <p className="text-gray-400 leading-relaxed text-lg mb-4">
              AstroAI is an intelligent space exploration platform that combines NASA's extensive APIs 
              with advanced artificial intelligence to bring you an immersive cosmic experience. Whether 
              you're fascinated by distant galaxies, curious about Mars missions, or want to track 
              near-Earth asteroids, AstroAI has you covered.
            </p>
            <p className="text-gray-400 leading-relaxed text-lg">
              Our platform provides real-time access to Astronomy Picture of the Day (APOD), Mars Rover 
              imagery, asteroid tracking data, and an AI-powered chat assistant ready to answer all your 
              space-related questions.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <FaCode />,
                title: 'NASA Data Integration',
                description: 'Real-time access to NASA APIs including APOD, Mars Rover photos, and asteroid tracking data.'
              },
              {
                icon: <FaBrain />,
                title: 'AI Assistant',
                description: 'Intelligent chatbot powered by advanced AI to answer your space and astronomy questions.'
              },
              {
                icon: <FaRocket />,
                title: 'Interactive Dashboard',
                description: 'Beautiful, responsive interface to explore space data with stunning visualizations.'
              },
              {
                icon: <FaRocket />,
                title: 'Data Visualization',
                description: 'Interactive charts and graphs to analyze asteroid trajectories and space mission data.'
              }
            ].map((feature, index) => (
              <Tooltip key={index} content={`Explore ${feature.title}`} position="top">
                <motion.div 
                  className="bg-dark-card/80 border border-primary/20 rounded-xl p-6 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="text-4xl text-primary mb-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              </Tooltip>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: 'Your Name',
                role: 'Full Stack Developer',
                github: 'https://github.com/yourusername',
                linkedin: 'https://linkedin.com/in/yourprofile'
              },
              {
                name: 'Your Friend\'s Name',
                role: 'Full Stack Developer',
                github: 'https://github.com/friendusername',
                linkedin: 'https://linkedin.com/in/friendprofile'
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="bg-dark-card/80 border border-primary/20 rounded-xl p-6 text-center hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center text-4xl"
                  whileHover={{ scale: 1.1 }}
                >
                  👨‍💻
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-white">{member.name}</h3>
                <p className="text-primary mb-4">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <Tooltip content="GitHub profile" position="bottom">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
                    >
                      <FaGithub />
                    </a>
                  </Tooltip>
                  <Tooltip content="LinkedIn profile" position="bottom">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors duration-300 text-2xl"
                    >
                      <FaLinkedin />
                    </a>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Built With</h2>
          <div className="bg-dark-card/80 border border-primary/20 rounded-xl p-8 hover:border-primary/40 transition-all duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {['React', 'TypeScript', 'Tailwind CSS', 'NASA APIs', 'Node.js', 'AI/ML', 'Framer Motion', 'Three.js'].map((tech, index) => (
                <Tooltip key={index} content={tech} position="top">
                  <motion.div 
                    className="p-4 bg-dark-darker/50 rounded-lg border border-primary/10 hover:border-primary transition-all duration-300 cursor-pointer"
                    whileHover={{ y: -3, borderColor: "rgba(124, 58, 237, 1)" }}
                  >
                    <p className="text-white font-semibold">{tech}</p>
                  </motion.div>
                </Tooltip>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
