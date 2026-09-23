import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherInfo } from '../utils/weatherUtils';

const WeatherScene3D = lazy(() => import('./WeatherScene3D'));

export default function WeatherHero() {
  const { weather, loading } = useWeatherContext();

  if (loading || !weather) return <HeroSkeleton />;

  const { current, location } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <WeatherScene3D
          weatherCategory={weatherInfo.category}
          isDay={current.isDay}
          temperature={current.temperature}
        />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Location & Date */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/70">
              {location.name}, {location.state}
            </span>
          </div>
          <p className="text-xs text-white/40 mb-8">{formatDate()}</p>

          {/* Weather Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-7xl sm:text-8xl mb-4"
          >
            {weatherInfo.icon}
          </motion.div>

          {/* Condition */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/60 mb-2"
          >
            {current.condition}
          </motion.p>

          {/* Temperature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mb-6"
          >
            <span className="text-8xl sm:text-9xl font-extralight text-white tracking-tighter">
              {current.temperature}
            </span>
            <span className="text-3xl sm:text-4xl font-light text-white/50 ml-1">°C</span>
          </motion.div>

          {/* Feels like */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-white/50 mb-8"
          >
            Feels like {current.feelsLike}°C
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap"
          >
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70">{current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/70">{current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/70">UV {current.uvIndex}</span>
            </div>
          </motion.div>

          {/* Last updated */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs text-white/30 mt-6"
          >
            Updated {formatTime(current.lastUpdated)} IST
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-16">
      <div className="text-center px-4 space-y-6">
        <div className="w-32 h-4 bg-white/5 rounded-full animate-shimmer mx-auto" />
        <div className="w-20 h-20 bg-white/5 rounded-full animate-shimmer mx-auto" />
        <div className="w-48 h-24 bg-white/5 rounded-2xl animate-shimmer mx-auto" />
        <div className="w-36 h-4 bg-white/5 rounded-full animate-shimmer mx-auto" />
      </div>
    </section>
  );
}
