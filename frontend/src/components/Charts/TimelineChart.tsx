import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { AsteroidData } from '../../types';

/**
 * Asteroid Approach Timeline Chart
 * Shows when asteroids will approach Earth
 */

interface TimelineChartProps {
  asteroids: AsteroidData[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ asteroids }) => {
  // Transform data for timeline
  const chartData = asteroids
    .filter(a => a.close_approach_data[0])
    .map((asteroid) => ({
      name: asteroid.name.replace(/[()]/g, '').substring(0, 12),
      date: new Date(asteroid.close_approach_data[0].close_approach_date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      distance: parseFloat(asteroid.close_approach_data[0].miss_distance.lunar).toFixed(1),
      velocity: (parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second)).toFixed(1),
      hazardous: asteroid.is_potentially_hazardous_asteroid ? 1 : 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card/95 border border-primary/30 rounded-lg p-4 backdrop-blur-md">
          <p className="text-white font-bold mb-2">{payload[0].payload.name}</p>
          <p className="text-gray-400 text-sm mb-1">Date: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'distance' && ' LD'}
              {entry.dataKey === 'velocity' && ' km/s'}
            </p>
          ))}
          {payload[0].payload.hazardous === 1 && (
            <p className="text-red-400 text-xs mt-2">⚠️ Potentially Hazardous</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-dark-card/80 border border-primary/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-2xl font-bold text-white mb-4">Approach Timeline</h3>
      <p className="text-gray-400 text-sm mb-6">
        Asteroid miss distance (Lunar Distance) and velocity over time
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Area
            type="monotone"
            dataKey="distance"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorDistance)"
            name="Distance (LD)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="velocity"
            stroke="#ec4899"
            fillOpacity={1}
            fill="url(#colorVelocity)"
            name="Velocity (km/s)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TimelineChart;

