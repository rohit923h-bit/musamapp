import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, CloudRain, Sun, Wind, Gauge, Eye, Sunrise, Sunset, Thermometer } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { getUVCategory, getHumidityDescription, getWindDirection } from '../utils/weatherUtils';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
};

export default function WeatherCards() {
  const { weather, loading } = useWeatherContext();
  if (loading || !weather) return <CardsSkeleton />;

  const { current } = weather;
  const uvCategory = getUVCategory(current.uvIndex);
  const humidityDesc = getHumidityDescription(current.humidity);
  const windDir = getWindDirection(current.windDirection);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  };

  const cards = [
    {
      icon: <Thermometer className="w-5 h-5 text-orange-400" />,
      title: 'Feels Like',
      value: `${current.feelsLike}°C`,
      subtitle: current.feelsLike > current.temperature ? 'Warmer than actual' : current.feelsLike < current.temperature ? 'Cooler than actual' : 'Same as actual',
      color: 'from-orange-500/10 to-red-500/10',
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      title: 'Humidity',
      value: `${current.humidity}%`,
      subtitle: humidityDesc,
      color: 'from-blue-500/10 to-cyan-500/10',
      extra: (
        <div className="mt-3 w-full bg-white/5 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${current.humidity}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
          />
        </div>
      ),
    },
    {
      icon: <CloudRain className="w-5 h-5 text-indigo-400" />,
      title: 'Rain Chance',
      value: `${current.rainProbability}%`,
      subtitle: current.precipitation > 0 ? `${current.precipitation}mm precipitation` : 'No precipitation',
      color: 'from-indigo-500/10 to-purple-500/10',
      extra: (
        <div className="mt-3 w-full bg-white/5 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${current.rainProbability}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
          />
        </div>
      ),
    },
    {
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      title: 'UV Index',
      value: `${current.uvIndex}`,
      subtitle: uvCategory.label,
      color: 'from-yellow-500/10 to-orange-500/10',
      extra: (
        <div className="mt-3 flex items-center gap-1">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= current.uvIndex ? 'bg-gradient-to-r from-green-400 via-yellow-400 to-red-400' : 'bg-white/5'}`}
              style={i <= current.uvIndex ? { background: i <= 2 ? '#4ade80' : i <= 5 ? '#facc15' : i <= 7 ? '#fb923c' : i <= 10 ? '#ef4444' : '#a855f7' } : {}}
            />
          ))}
        </div>
      ),
    },
    {
      icon: <Wind className="w-5 h-5 text-teal-400" />,
      title: 'Wind',
      value: `${current.windSpeed} km/h`,
      subtitle: `${windDir} direction${current.windGusts > 0 ? ` • Gusts ${current.windGusts} km/h` : ''}`,
      color: 'from-teal-500/10 to-emerald-500/10',
      extra: (
        <div className="mt-3 flex items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: current.windDirection }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-0.5 h-5 bg-gradient-to-t from-teal-400 to-transparent rounded-full origin-bottom" style={{ transform: `rotate(${current.windDirection}deg)` }} />
            </motion.div>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white/40 font-bold">{windDir}</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Gauge className="w-5 h-5 text-violet-400" />,
      title: 'Pressure',
      value: `${current.pressure} hPa`,
      subtitle: current.pressure > 1013 ? 'High pressure' : 'Low pressure',
      color: 'from-violet-500/10 to-purple-500/10',
    },
    {
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      title: 'Visibility',
      value: `${current.visibility} km`,
      subtitle: current.visibility >= 10 ? 'Excellent' : current.visibility >= 5 ? 'Good' : 'Poor',
      color: 'from-sky-500/10 to-blue-500/10',
    },
    {
      icon: <Sunrise className="w-5 h-5 text-amber-400" />,
      title: 'Sunrise',
      value: formatTime(weather.current.sunrise),
      subtitle: 'Morning',
      color: 'from-amber-500/10 to-orange-500/10',
    },
    {
      icon: <Sunset className="w-5 h-5 text-rose-400" />,
      title: 'Sunset',
      value: formatTime(weather.current.sunset),
      subtitle: 'Evening',
      color: 'from-rose-500/10 to-pink-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass-card p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            {card.icon}
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{card.title}</span>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-white">{card.value}</p>
          <p className="text-xs text-white/40 mt-1">{card.subtitle}</p>
          {card.extra}
        </motion.div>
      ))}
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <div className="w-8 h-4 bg-white/5 rounded-full animate-shimmer" />
          <div className="w-20 h-6 bg-white/5 rounded-lg animate-shimmer" />
          <div className="w-16 h-3 bg-white/5 rounded-full animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
