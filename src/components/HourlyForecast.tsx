import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherInfo } from '../utils/weatherUtils';

export default function HourlyForecast() {
  const { weather, loading } = useWeatherContext();
  if (loading || !weather) return null;

  const { hourly } = weather;

  const formatHour = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">24-Hour Forecast</h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {hourly.map((hour, i) => {
          const info = getWeatherInfo(hour.weatherCode, hour.isDay === 1);
          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors min-w-[72px]"
            >
              <span className="text-xs text-white/50">{i === 0 ? 'Now' : formatHour(hour.time)}</span>
              <span className="text-xl">{info.icon}</span>
              <span className="text-sm font-semibold text-white">{hour.temperature}°</span>
              <div className="flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-white/40">{hour.rainProbability}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
