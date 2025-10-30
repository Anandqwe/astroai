import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaSpaceShuttle, FaMeteor } from 'react-icons/fa';
import Card from '../components/Card';
import Loading from '../components/Loading';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { ToggleSwitch, Tooltip, ProgressBar } from '../components/MicroInteractions';
import api, { favoritesService, nasaService } from '../services/api';
import { APODData, MarsPhoto, AsteroidData, MarsDailyResponse } from '../types';

// Mock data
const MOCK_APOD: APODData = {
  title: 'Andromeda Galaxy',
  explanation: 'The Andromeda Galaxy is the nearest major galaxy to the Milky Way and the largest in the Local Group of galaxies. It contains roughly one trillion stars and is located about 2.5 million light-years away.',
  url: 'https://apod.nasa.gov/apod/image/2310/andromeda_spitzer_3000.jpg',
  media_type: 'image',
  date: '2024-10-28',
  hdurl: 'https://apod.nasa.gov/apod/image/2310/andromeda_spitzer_3000.jpg',
  service_version: 'v1',
};

const MOCK_MARS_PHOTOS: MarsPhoto[] = [
  {
    id: 1,
    sol: 3000,
    camera: { id: 1, name: 'FHAZ', rover_id: 1, full_name: 'Front Hazard Avoidance Camera' },
    img_src: 'https://marsrovers.jpl.nasa.gov/imglib/originals/0001MR00003610100100E01_DXXX.jpg',
    earth_date: '2024-10-28',
    rover: { id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' },
  },
  {
    id: 2,
    sol: 2999,
    camera: { id: 2, name: 'RHAZ', rover_id: 1, full_name: 'Rear Hazard Avoidance Camera' },
    img_src: 'https://marsrovers.jpl.nasa.gov/imglib/originals/0001MR00003610090100E01_DXXX.jpg',
    earth_date: '2024-10-27',
    rover: { id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' },
  },
  {
    id: 3,
    sol: 2998,
    camera: { id: 3, name: 'MAST', rover_id: 1, full_name: 'Mast Camera' },
    img_src: 'https://marsrovers.jpl.nasa.gov/imglib/originals/0001MR00003610080100E01_DXXX.jpg',
    earth_date: '2024-10-26',
    rover: { id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' },
  },
];

const MOCK_ASTEROIDS: AsteroidData[] = [
  {
    id: '1',
    name: '(2024 AB)',
    nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html?sstr=2024AB',
    absolute_magnitude_h: 25.5,
    estimated_diameter: { kilometers: { estimated_diameter_min: 0.5, estimated_diameter_max: 1.2 } },
    is_potentially_hazardous_asteroid: false,
    close_approach_data: [
      {
        close_approach_date: '2024-11-01',
        close_approach_date_full: '2024-Nov-01 14:32',
        epoch_date_close_approach: 1730476320000,
        relative_velocity: { kilometers_per_second: '18.5', kilometers_per_hour: '66600', miles_per_hour: '41390' },
        miss_distance: { astronomical: '0.05', lunar: '19.5', kilometers: '7500000', miles: '4660000' },
        orbiting_body: 'Earth',
      },
    ],
  },
  {
    id: '2',
    name: '(2024 CD)',
    nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html?sstr=2024CD',
    absolute_magnitude_h: 24.2,
    estimated_diameter: { kilometers: { estimated_diameter_min: 0.8, estimated_diameter_max: 1.8 } },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: '2024-11-05',
        close_approach_date_full: '2024-Nov-05 08:15',
        epoch_date_close_approach: 1730792100000,
        relative_velocity: { kilometers_per_second: '22.1', kilometers_per_hour: '79560', miles_per_hour: '49420' },
        miss_distance: { astronomical: '0.021', lunar: '8.17', kilometers: '3200000', miles: '1988000' },
        orbiting_body: 'Earth',
      },
    ],
  },
];

const Dashboard: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]);
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [marsDaily, setMarsDaily] = useState<MarsDailyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'apod' | 'mars' | 'asteroids'>('apod');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [dataLoadProgress, setDataLoadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);

  useEffect(() => {
    // Load mock data instead of calling API
    const simulateLoad = async () => {
      for (let i = 0; i <= 100; i += 10) {
        setDataLoadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      setApodData(MOCK_APOD);
      setMarsPhotos(MOCK_MARS_PHOTOS);
      setAsteroids(MOCK_ASTEROIDS);
      setDataLoadProgress(100);
      setLoading(false);
    };
    simulateLoad();
  }, []);

  // Helpers to fetch live data
  const loadMarsLive = async (useMock = false): Promise<void> => {
    setLoadingLive(true);
    setError(null);
    try {
      if (useMock) {
        const res = await api.get<{ photos: MarsPhoto[] }>('/nasa/mars', { params: { rover: 'curiosity', mock: 1 } });
        setMarsPhotos(res.data.photos || []);
        setMarsDaily(null);
      } else {
        // Use the new daily endpoint: returns one photo + weather
        const daily = await nasaService.getMarsDaily();
        setMarsDaily(daily);
        setMarsPhotos(daily.photo ? [daily.photo] : []);
      }
    } catch (e: any) {
      console.error('Live Mars error, falling back to mock:', e);
      // Automatic fallback to mock data if live fails
      try {
        const res = await api.get<{ photos: MarsPhoto[] }>('/nasa/mars', { params: { rover: 'curiosity', mock: 1 } });
        setMarsPhotos(res.data.photos || []);
        setMarsDaily(null);
        setError('Live Mars API had an issue. Showing mock photos for now.');
      } catch (mockErr: any) {
        console.error('Mars mock fallback also failed:', mockErr);
        setError('Could not load Mars photos. Please try again later.');
      }
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
      }
    } else {
      favoritesService.addFavorite(favoriteData);
    }
  };

  if (loading) {
    return <Loading message="Loading cosmic data..." />;
  }

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
          <div className="flex items-center justify-between">
            <Tooltip content="Automatically refresh data" position="right">
              <ToggleSwitch
                checked={autoRefresh}
                onChange={setAutoRefresh}
                label="Auto-refresh"
              />
            </Tooltip>
          </div>
        </motion.div>

        {/* Tab Navigation */}
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
          {activeTab === 'apod' && apodData && (
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
                  <img 
                    src={apodData.url} 
                    alt={apodData.title} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
                <motion.div 
                  className="p-10 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-3xl font-bold mb-4 text-white">{apodData.title}</h3>
                  <p className="text-primary font-semibold mb-5">{apodData.date}</p>
                  <p className="text-gray-400 leading-relaxed mb-5">{apodData.explanation}</p>
                  {apodData.copyright && (
                    <p className="text-sm text-gray-400 opacity-70">© {apodData.copyright}</p>
                  )}
                </motion.div>
              </motion.div>
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
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-primary text-white disabled:opacity-60"
                      onClick={() => loadMarsLive(false)}
                      disabled={loadingLive}
                    >
                      {loadingLive ? 'Loading…' : 'Load Live'}
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg border border-primary/40 text-primary disabled:opacity-60"
                      onClick={() => loadMarsLive(true)}
                      disabled={loadingLive}
                    >
                      {loadingLive ? 'Loading…' : 'Use Mock'}
                    </button>
                  </div>
                </div>
              </FadeInWhenVisible>
              {error && (
                <div className="mb-4 text-sm text-red-400">{error}</div>
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marsPhotos.map((photo, index) => (
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
                  <div>
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
              <div className="grid gap-5">
                {asteroids.map((asteroid, index) => (
                  <FadeInWhenVisible key={asteroid.id} delay={index * 0.15} direction="up">
                    <motion.div 
                      className="bg-dark-card/80 border border-primary/20 rounded-xl p-6 relative overflow-hidden group"
                      whileHover={{ 
                        x: 10, 
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)'
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Gradient overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />

                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-5 flex-wrap gap-2.5">
                          <h3 className="text-xl font-bold text-white m-0">{asteroid.name}</h3>
                          {asteroid.is_potentially_hazardous_asteroid && (
                            <motion.span 
                              className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: "spring" }}
                              whileHover={{ scale: 1.1 }}
                            >
                              ⚠️ Potentially Hazardous
                            </motion.span>
                          )}
                        </div>
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-400 font-medium">Diameter:</span>
                            <span className="text-base text-white font-semibold">
                              {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - 
                              {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                            </span>
                          </div>
                          {asteroid.close_approach_data[0] && (
                            <>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400 font-medium">Approach Date:</span>
                                <span className="text-base text-white font-semibold">
                                  {asteroid.close_approach_data[0].close_approach_date}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400 font-medium">Velocity:</span>
                                <span className="text-base text-white font-semibold">
                                  {parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-400 font-medium">Miss Distance:</span>
                                <span className="text-base text-white font-semibold">
                                  {parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                                </span>
                              </div>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
