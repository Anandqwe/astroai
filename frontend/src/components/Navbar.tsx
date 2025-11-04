import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { favoritesService } from '../services/api';
import { getPreloadForPath } from '../utils/preload';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
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

  // Update favorites count when location changes
  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = favoritesService.getFavorites();
      setFavoritesCount(favorites.length);
    };

    updateFavoritesCount();
  }, [location]);

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
          ? 'backdrop-blur-xl border-b border-primary/30 shadow-2xl shadow-primary/10'
          : 'backdrop-blur-lg border-b border-primary/20'
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

          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:flex-row md:gap-10 md:items-center list-none">
            {['/', '/dashboard', '/favorites', '/prediction', '/chat', '/about', '/settings'].map((path, index) => {
              const labels = ['Home', 'Dashboard', 'Favorites', 'Predict', 'Ask Astro', 'About', 'Settings'];
              return (
                <motion.li
                  key={path}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link 
                    to={path}
                    className={[
                      isActive(path),
                      'text-lg font-medium relative py-2 transition-all duration-300',
                      'hover:text-white block group',
                      'border-b-2 border-transparent hover:border-primary/70'
                    ].join(' ')}
                    onMouseEnter={() => {
                      const preload = getPreloadForPath(path);
                      if (preload) preload();
                    }}
                  >
                    <motion.span
                      className="inline-flex items-center gap-2"
                      whileHover={{
                        textShadow: '0 0 10px rgba(124, 58, 237, 0.8)',
                      }}
                    >
                      {labels[index]}
                      {/* Favorites Count Badge */}
                      {path === '/favorites' && favoritesCount > 0 && (
                        <motion.span
                          className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-primary text-white text-xs font-bold rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {favoritesCount}
                        </motion.span>
                      )}
                    </motion.span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer transition-colors duration-300 hover:text-primary z-50"
            onClick={toggleMenu} 
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                />
                {/* Drawer */}
                <motion.ul
                  className="fixed top-[70px] left-0 w-64 h-[calc(100vh-70px)] bg-dark-darker/95 backdrop-blur-xl border-r border-primary/20 py-5 z-50 flex flex-col gap-0 list-none md:hidden overflow-y-auto"
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {['/', '/dashboard', '/favorites', '/prediction', '/chat', '/about', '/settings'].map((path, index) => {
                    const labels = ['Home', 'Dashboard', 'Favorites', 'Predict', 'Ask Astro', 'About', 'Settings'];
                    return (
                      <motion.li
                        key={path}
                        className="w-full text-center py-4 border-b border-primary/10"
                        whileHover={{ scale: 1.05, x: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Link 
                          to={path}
                          className={[
                            isActive(path),
                            'text-lg font-medium relative py-2 transition-all duration-300',
                            'hover:text-white block w-full group',
                            'border-b-2 border-transparent hover:border-primary/70'
                          ].join(' ')}
                          onClick={() => setIsOpen(false)}
                        >
                          <motion.span
                            className="inline-flex items-center gap-2"
                            whileHover={{
                              textShadow: '0 0 10px rgba(124, 58, 237, 0.8)',
                            }}
                          >
                            {labels[index]}
                            {/* Favorites Count Badge */}
                            {path === '/favorites' && favoritesCount > 0 && (
                              <motion.span
                                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-primary text-white text-xs font-bold rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                {favoritesCount}
                              </motion.span>
                            )}
                          </motion.span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
