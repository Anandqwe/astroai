import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaSpaceShuttle, FaMeteor, FaChartBar } from 'react-icons/fa';
import Card from '../components/Card';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { ToggleSwitch, Tooltip, ProgressBar } from '../components/MicroInteractions';
import { SkeletonAPOD, SkeletonGrid, SkeletonList } from '../components/SkeletonLoader';
import { AsteroidChart, RiskChart, TimelineChart } from '../components/Charts';
import { DateRangePicker, RoverSelector, AsteroidFilter } from '../components/Filters';
import ErrorRetry from '../components/ErrorRetry';
import ImageModal from '../components/ImageModal';
import ImageCarousel from '../components/ImageCarousel';
import { favoritesService, nasaService } from '../services/api';
import { settingsService } from '../utils/settings';
import { APODData, MarsPhoto, AsteroidData, MarsDailyResponse } from '../types';
import { showToast } from '../utils/toast';
import { exportService } from '../utils/export';
import { FaDownload } from 'react-icons/fa';
import ShareButtons from '../components/ShareButtons';
import LazyImage from '../components/LazyImage';
import ExpandableCard from '../components/ExpandableCard';

const Dashboard: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]);
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [marsDaily, setMarsDaily] = useState<MarsDailyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'apod' | 'mars' | 'asteroids'>('apod');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [dataLoadProgress, setDataLoadProgress] = useState<number>(0);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(60);
  const [defaultRover, setDefaultRover] = useState<'curiosity' | 'perseverance'>('curiosity');
  const [error, setError] = useState<string | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [showCharts, setShowCharts] = useState<boolean>(true);
  const [marsViewMode, setMarsViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [marsModalOpen, setMarsModalOpen] = useState(false);
  const [selectedMarsIndex, setSelectedMarsIndex] = useState(0);
  const [marsDateStart, setMarsDateStart] = useState<string | null>(null);
  const [marsDateEnd, setMarsDateEnd] = useState<string | null>(null);
  const [marsRoverFilter, setMarsRoverFilter] = useState<'curiosity' | 'perseverance' | 'opportunity' | 'spirit'>(
    'curiosity'
  );
  const [asteroidFilter, setAsteroidFilter] = useState({
    hazardous: 'all' as 'all' | 'yes' | 'no',
    sizeMaxKm: 10,
    velocityMinKmh: 0,
    searchName: '',
  });
  const hasShownToast = useRef<boolean>(false);

  useEffect(() => {
    // Initialize from settings
    try {
      const s = settingsService.get();
      setAutoRefresh(s.autoRefresh);
      setMarsViewMode(s.defaultView);
      setRefreshIntervalSec(s.refreshInterval);
      setDefaultRover(s.defaultRover);
    } catch {}

    // Load real data from backend API
    const loadRealData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Progress simulation for visual feedback
        setDataLoadProgress(20);
        
        // Fetch all NASA data in parallel
        const [apodResponse, marsResponse, asteroidsResponse] = await Promise.all([
          nasaService.getAPOD().catch(() => null),
          nasaService.getMarsPhotos(defaultRover, 1000).catch(() => null),
          nasaService.getAsteroids().catch(() => null),
        ]);
        
        setDataLoadProgress(70);
        
        // Set APOD data
        if (apodResponse) {
          setApodData(apodResponse);
        }
        
        // Set Mars photos
        if (marsResponse && marsResponse.photos) {
          setMarsPhotos(marsResponse.photos);
        }
        
        // Set Asteroids data
        if (asteroidsResponse && asteroidsResponse.near_earth_objects) {
          // NASA returns asteroids grouped by date, flatten them
          const allAsteroids: AsteroidData[] = [];
          Object.values(asteroidsResponse.near_earth_objects).forEach((dateGroup: any) => {
            if (Array.isArray(dateGroup)) {
              allAsteroids.push(...dateGroup);
            }
          });
          setAsteroids(allAsteroids.slice(0, 10)); // Show first 10
        }
        
        setDataLoadProgress(100);
        setLoading(false);
        
        // Show welcome toast after data loads (only once)
        if (!hasShownToast.current) {
          setTimeout(() => {
            showToast.success('Real NASA data loaded! 🚀');
          }, 200);
          hasShownToast.current = true;
        }
      } catch (err: any) {
        console.error('Error loading NASA data:', err);
        
        // Check for timeout errors
        const isTimeout = err?.response?.status === 504 || 
                         err?.response?.data?.code === 'TIMEOUT' ||
                         err?.code === 'ECONNABORTED';
        
        const errorMessage = isTimeout
          ? 'NASA API timeout - The service may be temporarily unavailable. Please try again in a few moments.'
          : err?.response?.data?.error || err?.message || 'Failed to load data';
        
        setError(errorMessage);
        setLoading(false);
        
        if (isTimeout) {
          showToast.error('NASA API timeout - Please retry');
        } else if (err?.code === 'ECONNREFUSED') {
          showToast.error('Failed to connect to backend. Make sure server is running on port 5000.');
        } else {
          showToast.error('Failed to load some data. Check console for details.');
        }
      }
    };
    
    loadRealData();
  }, []);

  // Auto-refresh based on settings
  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(() => {
      // Reuse initial loader to refresh all sections
      (async () => {
        try {
          const [apodResponse, marsResponse, asteroidsResponse] = await Promise.all([
            nasaService.getAPOD().catch(() => null),
            nasaService.getMarsPhotos(defaultRover, 1000).catch(() => null),
            nasaService.getAsteroids().catch(() => null),
          ]);

          if (apodResponse) setApodData(apodResponse);
          if (marsResponse && marsResponse.photos) setMarsPhotos(marsResponse.photos.slice(0, 6));
          if (asteroidsResponse && asteroidsResponse.near_earth_objects) {
            const allAsteroids: AsteroidData[] = [];
            Object.values(asteroidsResponse.near_earth_objects).forEach((dateGroup: any) => {
              if (Array.isArray(dateGroup)) allAsteroids.push(...dateGroup);
            });
            setAsteroids(allAsteroids.slice(0, 10));
          }
        } catch {}
      })();
    }, Math.max(15, refreshIntervalSec) * 1000);

    return () => window.clearInterval(id);
  }, [autoRefresh, refreshIntervalSec, defaultRover]);

  // Helpers to fetch live data
  const loadMarsLive = async (): Promise<void> => {
    setLoadingLive(true);
    setError(null);
    try {
      // Use the new daily endpoint: returns one photo + weather
      const daily = await nasaService.getMarsDaily();
      setMarsDaily(daily);
      setMarsPhotos(daily.photo ? [daily.photo] : []);
      showToast.success('Mars data refreshed! 🔴');
    } catch (e: any) {
      console.error('Live Mars error:', e);
      setError('Could not load Mars photos. Please try again later.');
      showToast.error('Failed to load Mars data');
    } finally {
      setLoadingLive(false);
    }
  };

  const loadAsteroidsLive = async (): Promise<void> => {
    try {
      setLoadingLive(true);
      setError(null);
      const today = new Date().toISOString().slice(0, 10);
      const res = await nasaService.getAsteroids(today, today);
      // Flatten near_earth_objects into a single array
      const all: AsteroidData[] = Object.values(res.near_earth_objects || {}).flat();
      setAsteroids(all);
    } catch (e: any) {
      console.error('Live Asteroids error:', e);
      setError('Could not load asteroid data. Please retry.');
    } finally {
      setLoadingLive(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const toggleFavorite = (item: any, type: string): void => {
    const favoriteData = {
      type: type as 'apod' | 'mars' | 'asteroid',
      title: item.title || item.name,
      description: item.explanation || item.earth_date,
      imageUrl: item.url || item.img_src,
      date: new Date().toISOString(),
      data: item,
    };

    if (favoritesService.isFavorite(favoriteData.title)) {
      const favorites = favoritesService.getFavorites();
      const favorite = favorites.find(f => f.title === favoriteData.title);
      if (favorite) {
        favoritesService.removeFavorite(favorite.id);
        showToast.info('Removed from favorites');
      }
    } else {
      favoritesService.addFavorite(favoriteData);
      showToast.success('Added to favorites! ⭐');
    }
  };

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
          <motion.h1 
            className="text-5xl font-black mb-4 bg-gradient-primary bg-clip-text text-transparent"
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
            Space Dashboard
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore real-time NASA data and cosmic discoveries
          </motion.p>

          {/* Data Loading Progress */}
          {loading && (
            <motion.div
              className="mt-6 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProgressBar
                progress={dataLoadProgress}
                label="Loading data"
                showPercentage
                variant="primary"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Settings & Analytics Panel */}
        <motion.div
          className="glass rounded-xl p-6 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Tooltip content="Automatically refresh data" position="right">
                <ToggleSwitch
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                  label="Auto-refresh"
                />
              </Tooltip>
            </div>
            <div className="flex items-center justify-between">
              <Tooltip content="Show data visualization charts" position="right">
                <ToggleSwitch
                  checked={showCharts}
                  onChange={setShowCharts}
                  label="Show Charts"
                />
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && !loading && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ErrorRetry
              error={error}
              onRetry={handleRetry}
              title="Failed to Connect to Backend"
            />
            <p className="text-center text-gray-400 mt-4">
              Make sure the backend server is running on port 5000
            </p>
          </motion.div>
        )}

        {/* Tab Navigation & Content */}
        {!error && (
          <>
            <motion.div 
              className="flex justify-center gap-5 mb-10 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {[
                { id: 'apod', icon: <FaImage />, label: 'APOD' },
                { id: 'mars', icon: <FaSpaceShuttle />, label: 'Mars Rover' },
                { id: 'asteroids', icon: <FaMeteor />, label: 'Asteroids' }
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  className={`px-8 py-3 rounded-lg text-base font-semibold cursor-pointer flex items-center gap-2.5 relative overflow-hidden ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-white border-0'
                      : 'bg-dark-card/80 border-2 border-primary/20 text-gray-400'
                  }`}
                  onClick={() => setActiveTab(tab.id as 'apod' | 'mars' | 'asteroids')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    {tab.icon} {tab.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* APOD Section */}
            <AnimatePresence mode="wait">
          {activeTab === 'apod' && (
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <FadeInWhenVisible>
                <h2 className="text-3xl font-bold mb-8 text-white">Astronomy Picture of the Day</h2>
              </FadeInWhenVisible>
              
              {loading ? (
                <SkeletonAPOD />
              ) : apodData ? (
                <motion.div 
                  className="bg-dark-card/80 border border-primary/20 rounded-2xl overflow-hidden grid md:grid-cols-2 gap-0 group"
                  whileHover={{ borderColor: 'rgba(99, 102, 241, 0.5)' }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-full h-full min-h-[400px] overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LazyImage 
                      src={apodData.url} 
                      alt={apodData.title}
                      className="w-full h-full min-h-[400px]"
                    />
                  </motion.div>
                  <motion.div 
                    className="p-10 flex flex-col justify-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-3xl font-bold text-white flex-1">{apodData.title}</h3>
                      <ShareButtons
                        title={apodData.title}
                        text={`${apodData.title} - ${apodData.explanation?.substring(0, 100)}...`}
                        imageUrl={apodData.url}
                        variant="compact"
                        position="inline"
                      />
                    </div>
                    <p className="text-primary font-semibold mb-5">{apodData.date}</p>
                    <p className="text-gray-400 leading-relaxed mb-5">{apodData.explanation}</p>
                    {apodData.copyright && (
                      <p className="text-sm text-gray-400 opacity-70">© {apodData.copyright}</p>
                    )}
                  </motion.div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mars Photos Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'mars' && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <FadeInWhenVisible>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <h2 className="text-3xl font-bold text-white m-0">Mars Rover Photos</h2>
                  <div className="flex gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex bg-dark-card border border-primary/30 rounded-lg overflow-hidden">
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          marsViewMode === 'carousel'
                            ? 'bg-gradient-primary text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setMarsViewMode('carousel')}
                      >
                        Carousel
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          marsViewMode === 'grid'
                            ? 'bg-gradient-primary text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setMarsViewMode('grid')}
                      >
                        Grid
                      </button>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-primary text-white disabled:opacity-60"
                      onClick={loadMarsLive}
                      disabled={loadingLive}
                    >
                      {loadingLive ? 'Loading…' : 'Refresh Mars Data'}
                    </button>
                  </div>
                </div>
              </FadeInWhenVisible>
              
              {error && (
                <div className="mb-4 text-sm text-red-400">{error}</div>
              )}
              {/* Filters Panel */}
              <div className="mb-6 bg-dark-card/80 border border-primary/20 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <RoverSelector value={marsRoverFilter} onChange={setMarsRoverFilter} />
                  <DateRangePicker
                    start={marsDateStart || ''}
                    end={marsDateEnd || ''}
                    onDateChange={(s, e) => {
                      setMarsDateStart(s);
                      setMarsDateEnd(e);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400">Filters apply to the loaded photos; change rover in Settings to load different mission by default.</p>
              </div>
              {marsDaily && (
                <div className="mb-8 bg-dark-card/80 border border-primary/20 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white m-0">Daily Mars Image</h3>
                      <p className="text-primary text-sm mt-1">{marsDaily.date} • Source: {marsDaily.source}</p>
                    </div>
                    {marsDaily.weather && (
                      <div className="text-sm text-gray-300">
                        <div className="font-semibold mb-1">Weather</div>
                        <div className="flex gap-4 flex-wrap">
                          {marsDaily.weather.terrestrial_date && (
                            <span>Date: {marsDaily.weather.terrestrial_date}</span>
                          )}
                          {typeof marsDaily.weather.min_temp !== 'undefined' && marsDaily.weather.min_temp !== null && (
                            <span>Min: {marsDaily.weather.min_temp}°C</span>
                          )}
                          {typeof marsDaily.weather.max_temp !== 'undefined' && marsDaily.weather.max_temp !== null && (
                            <span>Max: {marsDaily.weather.max_temp}°C</span>
                          )}
                          {typeof marsDaily.weather.pressure !== 'undefined' && marsDaily.weather.pressure !== null && (
                            <span>Pressure: {marsDaily.weather.pressure} Pa</span>
                          )}
                          {marsDaily.weather.season && (
                            <span>Season: {marsDaily.weather.season}</span>
                          )}
                          {marsDaily.weather.stale && (
                            <span className="text-yellow-400">(stale)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {loading ? (
                <SkeletonGrid count={6} columns={3} />
              ) : (
                <>
                  {/* Carousel View */}
                  {marsViewMode === 'carousel' && marsPhotos.length > 0 && (
                    <FadeInWhenVisible>
                      <ImageCarousel
                        images={marsPhotos}
                        onImageClick={(_image, index) => {
                          setSelectedMarsIndex(index);
                          setMarsModalOpen(true);
                        }}
                        autoPlay={false}
                        interval={5000}
                      />
                    </FadeInWhenVisible>
                  )}

                  {/* Grid View */}
                  {marsViewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {marsPhotos
                        .filter((p) => (marsRoverFilter ? p.rover.name.toLowerCase() === marsRoverFilter : true))
                        .filter((p) => (marsDateStart ? p.earth_date >= marsDateStart : true))
                        .filter((p) => (marsDateEnd ? p.earth_date <= marsDateEnd : true))
                        .slice(0, 18)
                        .map((photo, index) => (
                        <FadeInWhenVisible key={photo.id} delay={index * 0.1} direction="up">
                          <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card
                              title={`${photo.rover.name} - Sol ${photo.sol}`}
                              description={`Camera: ${photo.camera.full_name} | Date: ${photo.earth_date}`}
                              imageUrl={photo.img_src}
                              isFavorite={favoritesService.isFavorite(`${photo.rover.name} - Sol ${photo.sol}`)}
                              onToggleFavorite={() => toggleFavorite({ ...photo, title: `${photo.rover.name} - Sol ${photo.sol}` }, 'mars')}
                            />
                          </motion.div>
                        </FadeInWhenVisible>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Asteroids Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'asteroids' && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <FadeInWhenVisible>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <h2 className="text-3xl font-bold text-white m-0">Near-Earth Asteroids</h2>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg border border-primary/30 text-gray-300 hover:text-white hover:border-primary/60 transition-all flex items-center gap-2"
                      onClick={() => {
                        try {
                          exportService.export(asteroids, 'astroai_asteroids', { format: 'json' });
                          showToast.success('Asteroids data exported!');
                        } catch (err) {
                          showToast.error('Failed to export data');
                        }
                      }}
                      disabled={asteroids.length === 0}
                    >
                      <FaDownload /> Export JSON
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-primary text-white disabled:opacity-60"
                      onClick={loadAsteroidsLive}
                      disabled={loadingLive}
                    >
                      {loadingLive ? 'Loading…' : 'Load Live'}
                    </button>
                  </div>
                </div>
              </FadeInWhenVisible>
              
              {error && (
                <div className="mb-4 text-sm text-red-400">{error}</div>
              )}
              
              {/* Asteroid Filters */}
              <div className="mb-6 bg-dark-card/80 border border-primary/20 rounded-2xl p-4">
                <AsteroidFilter value={asteroidFilter} onChange={setAsteroidFilter} />
              </div>

              {loading ? (
                <SkeletonList count={4} />
              ) : (
                <div className="grid gap-5">
                  {asteroids
                    .filter((a) => {
                      if (asteroidFilter.hazardous === 'all') return true;
                      const isHaz = !!a.is_potentially_hazardous_asteroid;
                      return asteroidFilter.hazardous === 'yes' ? isHaz : !isHaz;
                    })
                    .filter((a) =>
                      a.name.toLowerCase().includes(asteroidFilter.searchName.toLowerCase())
                    )
                    .filter((a) => {
                      const max = a.estimated_diameter.kilometers.estimated_diameter_max;
                      return max <= asteroidFilter.sizeMaxKm;
                    })
                    .filter((a) => {
                      const ca = a.close_approach_data?.[0];
                      if (!ca) return true;
                      const v = parseFloat(ca.relative_velocity.kilometers_per_hour);
                      return v >= asteroidFilter.velocityMinKmh;
                    })
                    .slice(0, 30)
                    .map((asteroid, index) => {
                      const ca = asteroid.close_approach_data?.[0];
                      const diameterMin = asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2);
                      const diameterMax = asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2);
                      const velocity = ca ? parseFloat(ca.relative_velocity.kilometers_per_hour).toLocaleString() : 'N/A';
                      const missDistance = ca ? parseFloat(ca.miss_distance.kilometers).toLocaleString() : 'N/A';
                      
                      const summary = `${diameterMin} - ${diameterMax} km diameter${ca ? ` • ${velocity} km/h velocity` : ''}`;
                      
                      return (
                        <FadeInWhenVisible key={asteroid.id} delay={index * 0.15} direction="up">
                          <ExpandableCard
                            title={
                              <div className="flex items-center justify-between gap-3">
                                <span>{asteroid.name}</span>
                                {asteroid.is_potentially_hazardous_asteroid && (
                                  <motion.span 
                                    className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    ⚠️ Hazardous
                                  </motion.span>
                                )}
                              </div>
                            }
                            summary={summary}
                            details={
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-sm text-gray-400 font-medium block mb-1">Diameter Range:</span>
                                    <span className="text-white font-semibold">
                                      {diameterMin} - {diameterMax} km
                                    </span>
                                  </div>
                                  {ca && (
                                    <>
                                      <div>
                                        <span className="text-sm text-gray-400 font-medium block mb-1">Approach Date:</span>
                                        <span className="text-white font-semibold">{ca.close_approach_date}</span>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-400 font-medium block mb-1">Relative Velocity:</span>
                                        <span className="text-white font-semibold">{velocity} km/h</span>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-400 font-medium block mb-1">Miss Distance:</span>
                                        <span className="text-white font-semibold">{missDistance} km</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                                {ca && (
                                  <div className="space-y-3">
                                    <div>
                                      <span className="text-sm text-gray-400 font-medium block mb-1">Orbiting Body:</span>
                                      <span className="text-white font-semibold">{ca.orbiting_body}</span>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-400 font-medium block mb-1">Velocity (mph):</span>
                                      <span className="text-white font-semibold">
                                        {parseFloat(ca.relative_velocity.miles_per_hour).toLocaleString()} mph
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-400 font-medium block mb-1">Miss Distance (lunar):</span>
                                      <span className="text-white font-semibold">
                                        {parseFloat(ca.miss_distance.lunar).toFixed(2)} LD
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            }
                            variant="default"
                          />
                        </FadeInWhenVisible>
                      );
                    })}
                  </div>
              )}

              {/* Charts Section */}
              {!loading && showCharts && (
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <FadeInWhenVisible>
                    <div className="flex items-center gap-3 mb-8">
                      <FaChartBar className="text-3xl text-primary" />
                      <h2 className="text-3xl font-bold text-white">Data Visualization</h2>
                    </div>
                  </FadeInWhenVisible>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <AsteroidChart asteroids={asteroids} />
                    <RiskChart asteroids={asteroids} />
                  </div>
                  
                  {/* Full-width Timeline Chart */}
                  <TimelineChart asteroids={asteroids} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </div>

      {/* Mars Photos Image Modal */}
      <ImageModal
        isOpen={marsModalOpen}
        onClose={() => setMarsModalOpen(false)}
        image={{
          url: marsPhotos[selectedMarsIndex]?.img_src || '',
          title: marsPhotos[selectedMarsIndex] 
            ? `${marsPhotos[selectedMarsIndex].rover.name} - Sol ${marsPhotos[selectedMarsIndex].sol}` 
            : '',
          date: marsPhotos[selectedMarsIndex]?.earth_date,
          explanation: marsPhotos[selectedMarsIndex] 
            ? `Camera: ${marsPhotos[selectedMarsIndex].camera.full_name}`
            : ''
        }}
        images={marsPhotos.map(photo => ({
          url: photo.img_src,
          title: `${photo.rover.name} - Sol ${photo.sol}`,
          date: photo.earth_date,
          explanation: `Camera: ${photo.camera.full_name}`
        }))}
        currentIndex={selectedMarsIndex}
        onNavigate={setSelectedMarsIndex}
      />
    </div>
  );
};

export default Dashboard;
