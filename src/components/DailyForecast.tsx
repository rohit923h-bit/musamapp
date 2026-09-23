import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Thermometer } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherInfo } from '../utils/weatherUtils';

export default function DailyForecast() {
  const { weather, loading } = useWeatherContext();
  if (loading || !weather) return null;

  const { daily } = weather;

  const formatDay = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">7-Day Forecast</h3>
      <div className="space-y-2">
        {daily.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode, true);
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-[80px]">
                <span className="text-sm font-medium text-white/80">{formatDay(day.date, i)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.icon}</span>
                <span className="text-xs text-white/40 hidden sm:inline">{info.condition}</span>
              </div>
              <div className="flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-white/50">{day.rainProbability}%</span>
              </div>
              <div className="flex items-center gap-2 min-w-[80px] justify-end">
                <span className="text-sm font-semibold text-white">{day.tempMax}°</span>
                <span className="text-sm text-white/40">{day.tempMin}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
