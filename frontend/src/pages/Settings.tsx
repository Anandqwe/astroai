import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { ToggleSwitch, Tooltip } from '../components/MicroInteractions';
import { showToast } from '../utils/toast';
import { settingsService, type AstroSettings } from '../utils/settings';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AstroSettings>(settingsService.get());

  useEffect(() => {
    settingsService.set(settings);
  }, [settings]);

  const handleReset = (): void => {
    const next = settingsService.reset();
    setSettings(next);
    showToast.info('Settings reset to defaults');
  };

  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-full bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-gray-400">
            Personalize your AstroAI experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data */}
          <FadeInWhenVisible>
            <div className="glass rounded-xl p-6 border border-primary/20">
              <h2 className="text-xl font-bold text-white mb-4">Data</h2>
              <div className="flex items-center justify-between mb-4">
                <Tooltip content="Automatically refresh dashboard data" position="left">
                  <span className="text-gray-300">Auto Refresh</span>
                </Tooltip>
                <ToggleSwitch
                  checked={settings.autoRefresh}
                  onChange={(v) => setSettings({ ...settings, autoRefresh: v })}
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Refresh Interval</span>
                <select
                  className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings({ ...settings, refreshInterval: Number(e.target.value) as AstroSettings['refreshInterval'] })}
                >
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Default Rover</span>
                <select
                  className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
                  value={settings.defaultRover}
                  onChange={(e) => setSettings({ ...settings, defaultRover: e.target.value as AstroSettings['defaultRover'] })}
                >
                  <option value="curiosity">Curiosity</option>
                  <option value="perseverance">Perseverance</option>
                </select>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* View */}
          <FadeInWhenVisible>
            <div className="glass rounded-xl p-6 border border-primary/20">
              <h2 className="text-xl font-bold text-white mb-4">View</h2>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Default Mars View</span>
                <select
                  className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
                  value={settings.defaultView}
                  onChange={(e) => setSettings({ ...settings, defaultView: e.target.value as AstroSettings['defaultView'] })}
                >
                  <option value="carousel">Carousel</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            className="px-5 py-2 rounded-lg border border-primary/30 text-gray-300 hover:text-white hover:border-primary/60"
            onClick={handleReset}
          >
            Reset to Defaults
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-primary text-white"
            onClick={() => showToast.success('Settings saved')}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
