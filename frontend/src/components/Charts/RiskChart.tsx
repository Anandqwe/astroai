import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { AsteroidData } from '../../types';

/**
 * Risk Distribution Pie Chart
 * Shows hazardous vs non-hazardous asteroids
 */

interface RiskChartProps {
  asteroids: AsteroidData[];
}

const RiskChart: React.FC<RiskChartProps> = ({ asteroids }) => {
  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const safeCount = asteroids.length - hazardousCount;

  const data = [
    { name: 'Potentially Hazardous', value: hazardousCount, color: '#ef4444' },
    { name: 'Non-Hazardous', value: safeCount, color: '#22c55e' },
  ];

  const COLORS = ['#ef4444', '#22c55e'];

  // Custom label
  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / asteroids.length) * 100).toFixed(0);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card/95 border border-primary/30 rounded-lg p-4 backdrop-blur-md">
          <p className="text-white font-bold">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>
            Count: {payload[0].value}
          </p>
          <p className="text-gray-400 text-sm">
            {((payload[0].value / asteroids.length) * 100).toFixed(1)}% of total
          </p>
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
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h3 className="text-2xl font-bold text-white mb-4">Risk Distribution</h3>
      <p className="text-gray-400 text-sm mb-6">
        Hazardous vs Non-Hazardous Asteroids
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400 text-sm mb-1">⚠️ Hazardous</p>
          <p className="text-white text-2xl font-bold">{hazardousCount}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-green-400 text-sm mb-1">✅ Safe</p>
          <p className="text-white text-2xl font-bold">{safeCount}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskChart;

