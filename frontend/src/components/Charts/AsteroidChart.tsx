import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { AsteroidData } from '../../types';

/**
 * Asteroid Comparison Chart
 * Displays asteroid diameter, velocity, and miss distance
 */

interface AsteroidChartProps {
  asteroids: AsteroidData[];
}

const AsteroidChart: React.FC<AsteroidChartProps> = ({ asteroids }) => {
  // Transform asteroid data for chart
  const chartData = asteroids.map((asteroid) => ({
    name: asteroid.name.replace(/[()]/g, '').substring(0, 15),
    diameter: asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2),
    velocity: asteroid.close_approach_data[0]
      ? (parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second) / 10).toFixed(1)
      : 0,
    distance: asteroid.close_approach_data[0]
      ? (parseFloat(asteroid.close_approach_data[0].miss_distance.lunar) / 10).toFixed(1)
      : 0,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card/95 border border-primary/30 rounded-lg p-4 backdrop-blur-md">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === 'diameter' && ' km'}
              {entry.name === 'velocity' && ' km/s (÷10)'}
              {entry.name === 'distance' && ' LD (÷10)'}
            </p>
          ))}
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
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-white mb-4">Asteroid Comparison</h3>
      <p className="text-gray-400 text-sm mb-6">
        Diameter (km), Velocity (÷10 km/s), and Miss Distance (÷10 Lunar Distance)
      </p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
            iconType="circle"
          />
          <Bar 
            dataKey="diameter" 
            fill="#3b82f6" 
            name="Diameter"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="velocity" 
            fill="#8b5cf6" 
            name="Velocity (÷10)"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="distance" 
            fill="#ec4899" 
            name="Distance (÷10)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AsteroidChart;

