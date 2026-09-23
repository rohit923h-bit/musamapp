import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { generateWeatherInsights } from '../utils/weatherUtils';

export default function WeatherInsights() {
  const { weather, loading } = useWeatherContext();
  if (loading || !weather) return null;

  const { current } = weather;
  const insights = generateWeatherInsights({
    humidity: current.humidity,
    rainProbability: current.rainProbability,
    uvIndex: current.uvIndex,
    temperature: current.temperature,
    feelsLike: current.feelsLike,
    windSpeed: current.windSpeed,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Weather Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-white/60 leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
