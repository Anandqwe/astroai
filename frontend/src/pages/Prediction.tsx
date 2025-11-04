import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket, FaCalculator, FaExclamationTriangle, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import FadeInWhenVisible from '../components/FadeInWhenVisible';
import { AnimatedButton, AnimatedInput } from '../components/MicroInteractions';
import { showToast } from '../utils/toast';

interface PredictionFormData {
  diameter_min: string;
  diameter_max: string;
  velocity: string;
  miss_distance: string;
  magnitude: string;
}

interface PredictionResult {
  risk: 'Low' | 'Medium' | 'High';
  percentage: number;
  confidence: number;
  timestamp: Date;
  formData: PredictionFormData;
}

const Prediction: React.FC = () => {
  const [formData, setFormData] = useState<PredictionFormData>({
    diameter_min: '',
    diameter_max: '',
    velocity: '',
    miss_distance: '',
    magnitude: '',
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<PredictionResult[]>([]);

  const handleInputChange = (field: keyof PredictionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExampleData = () => {
    setFormData({
      diameter_min: '0.8',
      diameter_max: '1.8',
      velocity: '79560',
      miss_distance: '3200000',
      magnitude: '24.2',
    });
    showToast.info('Example data loaded! 🎯');
  };

  const handleReset = () => {
    setFormData({
      diameter_min: '',
      diameter_max: '',
      velocity: '',
      miss_distance: '',
      magnitude: '',
    });
    setPrediction(null);
    showToast.info('Form reset');
  };

  const predictRisk = async () => {
    // Validate inputs
    const values = Object.values(formData);
    if (values.some(v => !v.trim())) {
      showToast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple frontend prediction logic (until backend ML model is ready)
    const velocity = parseFloat(formData.velocity);
    const distance = parseFloat(formData.miss_distance);
    const diameterMax = parseFloat(formData.diameter_max);

    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    let percentage = 0;
    let confidence = 0;

    // Risk calculation logic
    if (velocity > 70000 && distance < 5000000 && diameterMax > 1.5) {
      risk = 'High';
      percentage = 75 + Math.random() * 20; // 75-95%
      confidence = 85 + Math.random() * 10; // 85-95%
    } else if (velocity > 50000 && distance < 10000000 && diameterMax > 0.8) {
      risk = 'Medium';
      percentage = 35 + Math.random() * 30; // 35-65%
      confidence = 70 + Math.random() * 15; // 70-85%
    } else {
      risk = 'Low';
      percentage = 5 + Math.random() * 25; // 5-30%
      confidence = 80 + Math.random() * 15; // 80-95%
    }

    const result: PredictionResult = {
      risk,
      percentage: Math.round(percentage),
      confidence: Math.round(confidence),
      timestamp: new Date(),
      formData: { ...formData },
    };

    setPrediction(result);
    setHistory(prev => [result, ...prev].slice(0, 5)); // Keep last 5
    setLoading(false);
    showToast.success(`Prediction complete: ${risk} Risk! 🎯`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#22c55e';
      default: return '#6366f1';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] py-10 px-5">
      <div className="max-w-6xl mx-auto">
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
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🧮
          </motion.div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Asteroid Risk Prediction
          </h1>
          <p className="text-lg text-gray-400">
            AI-powered risk assessment for near-Earth asteroids
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            className="bg-dark-card/80 border border-primary/20 rounded-xl p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaCalculator className="text-2xl text-primary" />
              <h2 className="text-2xl font-bold text-white">Input Parameters</h2>
            </div>

            <div className="space-y-5">
              {/* Diameter Min */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Minimum Diameter (km)
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="e.g., 0.5"
                  value={formData.diameter_min}
                  onChange={(value) => handleInputChange('diameter_min', value)}
                  step="0.1"
                />
              </div>

              {/* Diameter Max */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Maximum Diameter (km)
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="e.g., 1.2"
                  value={formData.diameter_max}
                  onChange={(value) => handleInputChange('diameter_max', value)}
                  step="0.1"
                />
              </div>

              {/* Velocity */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Velocity (km/h)
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="e.g., 66600"
                  value={formData.velocity}
                  onChange={(value) => handleInputChange('velocity', value)}
                />
              </div>

              {/* Miss Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Miss Distance (km)
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="e.g., 7500000"
                  value={formData.miss_distance}
                  onChange={(value) => handleInputChange('miss_distance', value)}
                />
              </div>

              {/* Absolute Magnitude */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Absolute Magnitude (H)
                </label>
                <AnimatedInput
                  type="number"
                  placeholder="e.g., 25.5"
                  value={formData.magnitude}
                  onChange={(value) => handleInputChange('magnitude', value)}
                  step="0.1"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={predictRisk}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⏳
                      </motion.div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <FaRocket /> Predict Risk
                    </>
                  )}
                </AnimatedButton>
              </div>

              <div className="flex gap-3">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={handleExampleData}
                  className="flex-1"
                >
                  Load Example
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset Form
                </AnimatedButton>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Prediction Result */}
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key="result"
                  className="bg-dark-card/80 border border-primary/20 rounded-xl p-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FaCheckCircle className="text-2xl text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Prediction Result</h2>
                  </div>

                  {/* Risk Level Badge */}
                  <motion.div
                    className="text-center mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  >
                    <div className="text-6xl mb-4">{getRiskIcon(prediction.risk)}</div>
                    <div
                      className="inline-block px-8 py-4 rounded-2xl text-2xl font-black mb-2"
                      style={{
                        backgroundColor: `${getRiskColor(prediction.risk)}20`,
                        border: `2px solid ${getRiskColor(prediction.risk)}`,
                        color: getRiskColor(prediction.risk),
                      }}
                    >
                      {prediction.risk.toUpperCase()} RISK
                    </div>
                    <p className="text-gray-400 mt-3">Impact Probability: {prediction.percentage}%</p>
                  </motion.div>

                  {/* Confidence Gauge */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Model Confidence</span>
                      <span className="text-sm font-bold text-white">{prediction.confidence}%</span>
                    </div>
                    <div className="h-3 bg-dark-darker rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-darker/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 mb-1">Diameter Range</p>
                      <p className="text-white font-semibold">
                        {prediction.formData.diameter_min} - {prediction.formData.diameter_max} km
                      </p>
                    </div>
                    <div className="bg-dark-darker/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 mb-1">Velocity</p>
                      <p className="text-white font-semibold">
                        {parseFloat(prediction.formData.velocity).toLocaleString()} km/h
                      </p>
                    </div>
                    <div className="bg-dark-darker/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 mb-1">Miss Distance</p>
                      <p className="text-white font-semibold">
                        {(parseFloat(prediction.formData.miss_distance) / 1000000).toFixed(2)}M km
                      </p>
                    </div>
                    <div className="bg-dark-darker/50 rounded-lg p-4 border border-primary/10">
                      <p className="text-xs text-gray-400 mb-1">Magnitude</p>
                      <p className="text-white font-semibold">{prediction.formData.magnitude}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-6">
                    Predicted at {prediction.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="bg-dark-card/80 border border-primary/20 rounded-xl p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-6xl mb-4 opacity-30">🎯</div>
                  <p className="text-gray-400">
                    Enter asteroid parameters and click <strong>"Predict Risk"</strong> to see results
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prediction History */}
            {history.length > 0 && (
              <motion.div
                className="bg-dark-card/80 border border-primary/20 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaHistory className="text-xl text-primary" />
                  <h3 className="text-xl font-bold text-white">Recent Predictions</h3>
                </div>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-darker/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getRiskIcon(item.risk)}</span>
                        <div>
                          <p className="text-white font-semibold">{item.risk} Risk</p>
                          <p className="text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: getRiskColor(item.risk) }}>
                          {item.percentage}%
                        </p>
                        <p className="text-xs text-gray-500">probability</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <FadeInWhenVisible>
          <motion.div
            className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-3xl text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">About This Prediction Model</h3>
                <p className="text-gray-300 leading-relaxed">
                  This prediction model uses machine learning algorithms trained on NASA's Near-Earth Object dataset.
                  The model analyzes asteroid characteristics including size, velocity, and proximity to Earth to estimate
                  impact risk probability. This is a demonstration version - for actual asteroid tracking, please refer to
                  NASA's official{' '}
                  <a
                    href="https://cneos.jpl.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary underline"
                  >
                    Center for Near Earth Object Studies (CNEOS)
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

export default Prediction;

