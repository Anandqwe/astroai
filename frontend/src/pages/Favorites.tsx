import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTrash, FaSearch, FaTh, FaList, FaFilter } from 'react-icons/fa';
import { favoritesService } from '../services/api';
import { FavoriteItem } from '../types';
import EmptyState from '../components/EmptyState';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { AnimatedButton } from '../components/MicroInteractions';
import { showToast } from '../utils/toast';
import { exportService } from '../utils/export';
import { FaDownload } from 'react-icons/fa';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'apod' | 'mars' | 'asteroid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Filter favorites when search or filter changes
  useEffect(() => {
    let filtered = [...favorites];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(fav => fav.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fav =>
        fav.title.toLowerCase().includes(query) ||
        fav.description?.toLowerCase().includes(query)
      );
    }

    setFilteredFavorites(filtered);
  }, [favorites, filterType, searchQuery]);

  const loadFavorites = () => {
    const favs = favoritesService.getFavorites();
    setFavorites(favs);
  };

  const handleRemoveFavorite = (id: number) => {
    favoritesService.removeFavorite(id);
    loadFavorites();
    showToast.info('Removed from favorites');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      favorites.forEach(fav => favoritesService.removeFavorite(fav.id));
      loadFavorites();
      showToast.success('All favorites cleared');
    }
  };

  const filterButtons = [
    { id: 'all', label: 'All', icon: '🌌' },
    { id: 'apod', label: 'APOD', icon: '🖼️' },
    { id: 'mars', label: 'Mars', icon: '🚀' },
    { id: 'asteroid', label: 'Asteroids', icon: '☄️' },
  ];

  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-6xl mb-4 inline-block"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ⭐
          </motion.div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Your Favorites
          </h1>
          <p className="text-lg text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        {favorites.length > 0 && (
          <>
            {/* Controls Bar */}
            <motion.div
              className="bg-dark-card/80 border border-primary/20 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative flex-1 w-full md:max-w-md">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark-darker/50 border border-primary/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* View Mode, Export & Clear */}
                <div className="flex gap-3 items-center">
                  {/* Export Button */}
                  <button
                    onClick={() => {
                      try {
                        exportService.exportFavorites();
                        showToast.success('Favorites exported!');
                      } catch (err) {
                        showToast.error('Failed to export favorites');
                      }
                    }}
                    className="px-4 py-2 rounded-lg border border-primary/30 text-gray-300 hover:text-white hover:border-primary/60 transition-all flex items-center gap-2"
                    disabled={favorites.length === 0}
                  >
                    <FaDownload /> Export
                  </button>
                  {/* View Toggle */}
                  <div className="flex bg-dark-darker/50 rounded-lg p-1 border border-primary/20">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-gradient-primary text-white'
                          : 'text-gray-400 hover:text-white'
                      } transition-all`}
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-gradient-primary text-white'
                          : 'text-gray-400 hover:text-white'
                      } transition-all`}
                    >
                      <FaList />
                    </button>
                  </div>

                  {/* Clear All */}
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                  >
                    <FaTrash /> Clear All
                  </AnimatedButton>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-3 mt-4 flex-wrap">
                {filterButtons.map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id as any)}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                      filterType === filter.id
                        ? 'bg-gradient-primary text-white'
                        : 'bg-dark-darker/50 border border-primary/20 text-gray-400 hover:text-white hover:border-primary/40'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Results Count */}
            {(searchQuery || filterType !== 'all') && (
              <motion.p
                className="text-gray-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Showing {filteredFavorites.length} of {favorites.length} items
              </motion.p>
            )}
          </>
        )}

        {/* Empty State */}
        {favorites.length === 0 && (
          <EmptyState
            icon={<FaHeart className="text-7xl text-primary/50" />}
            title="No favorites yet"
            description="Start exploring the cosmos and save your favorite discoveries! Every star, planet, and galaxy awaits."
            action={
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Explore Dashboard
              </AnimatedButton>
            }
          />
        )}

        {/* No Results from Filter/Search */}
        {favorites.length > 0 && filteredFavorites.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No results found"
            description={`No favorites match your ${searchQuery ? 'search' : 'filter'}. Try adjusting your criteria.`}
            action={
              <AnimatedButton
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
              >
                Clear Filters
              </AnimatedButton>
            }
          />
        )}

        {/* Favorites Grid/List */}
        <AnimatePresence mode="wait">
          {filteredFavorites.length > 0 && (
            <motion.div
              key={viewMode}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredFavorites.map((favorite, index) => (
                <FadeInWhenVisible key={favorite.id} delay={index * 0.05}>
                  <motion.div
                    className={`bg-dark-card/80 border border-primary/20 rounded-xl overflow-hidden group hover:border-primary/50 transition-all ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                    whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)' }}
                    layout
                  >
                    {/* Image */}
                    {favorite.imageUrl && (
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === 'grid' ? 'h-48' : 'w-48 h-48 flex-shrink-0'
                        }`}
                      >
                        <motion.img
                          src={favorite.imageUrl}
                          alt={favorite.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-dark-darker/80 backdrop-blur-sm rounded-full text-xs font-semibold border border-primary/30">
                          {favorite.type === 'apod' && '🖼️ APOD'}
                          {favorite.type === 'mars' && '🚀 Mars'}
                          {favorite.type === 'asteroid' && '☄️ Asteroid'}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {favorite.title}
                      </h3>
                      {favorite.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {favorite.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(favorite.date).toLocaleDateString()}
                        </span>
                        <motion.button
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </FadeInWhenVisible>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;

