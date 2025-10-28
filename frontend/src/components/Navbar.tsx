import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string): string => {
    return location.pathname === path ? 'text-white' : 'text-gray-400';
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-darker/80 backdrop-blur-xl border-b border-primary/30 shadow-2xl shadow-primary/10'
          : 'bg-dark-darker/60 backdrop-blur-lg border-b border-primary/20'
      }`}
      style={{ opacity: navOpacity }}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white text-3xl font-black font-orbitron transition-all duration-300 group"
          >
            <motion.div
              animate={{
                rotate: [0, 15, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FaRocket className="text-primary group-hover:text-secondary transition-colors duration-300" />
            </motion.div>
            <motion.span
              className="bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
              whileHover={{
                textShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
              }}
            >
              AstroAI
            </motion.span>
          </Link>

          <motion.button 
            className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer transition-colors duration-300 hover:text-primary"
            onClick={toggleMenu} 
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>

          <ul className={`
            md:flex md:flex-row md:gap-10 md:items-center
            ${isOpen ? 'flex' : 'hidden'}
            flex-col gap-0 list-none
            md:static md:w-auto md:bg-transparent md:p-0 md:border-0
            fixed top-[70px] left-0 w-full bg-dark-darker/95 backdrop-blur-xl border-b border-primary/20 py-5
            transition-transform duration-300
          `}>
            {['/', '/dashboard', '/chat', '/about'].map((path, index) => {
              const labels = ['Home', 'Dashboard', 'Ask Astro', 'About'];
              return (
                <motion.li
                  key={path}
                  className="w-full md:w-auto text-center py-4 md:py-0 border-b md:border-0 border-primary/10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link 
                    to={path}
                    className={`
                      ${isActive(path)}
                      text-lg font-medium relative py-2 transition-all duration-300
                      hover:text-white block w-full group
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-gradient-primary after:transition-all after:duration-300
                      hover:after:w-full hover:after:shadow-[0_0_15px_rgba(124,58,237,0.8)]
                      ${location.pathname === path ? 'after:w-full after:shadow-[0_0_15px_rgba(124,58,237,0.8)]' : ''}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.span
                      whileHover={{
                        textShadow: '0 0 10px rgba(124, 58, 237, 0.8)',
                      }}
                    >
                      {labels[index]}
                    </motion.span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
