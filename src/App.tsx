import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { WeatherProvider, useWeatherContext } from './context/WeatherContext';
import Header from './components/Header';
import WeatherHero from './components/WeatherHero';
import WeatherCards from './components/WeatherCards';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { TemperatureChart, RainChart } from './components/Charts';
import WeatherInsights from './components/WeatherInsights';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';

function Dashboard() {
  const { weather, loading, error } = useWeatherContext();

  if (error && !weather) return <ErrorState />;

  // Dynamic background based on weather
  const getBackgroundGradient = () => {
    if (loading || !weather) return 'from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]';
    const { current } = weather;
    if (!current.isDay) return 'from-[#050816] via-[#0a0e2a] to-[#050816]';
    switch (true) {
      case current.weatherCode === 0 || current.weatherCode === 1:
        return 'from-[#0a1628] via-[#0f2040] to-[#0a1628]';
      case current.weatherCode <= 3:
        return 'from-[#0a0e1a] via-[#131b2e] to-[#0a0e1a]';
      case current.weatherCode >= 51 && current.weatherCode <= 67:
        return 'from-[#0a0e1a] via-[#0d1525] to-[#0a0e1a]';
      case current.weatherCode >= 95:
        return 'from-[#0a0a14] via-[#111128] to-[#0a0a14]';
      default:
        return 'from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a]';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBackgroundGradient()} transition-colors duration-1000`}>
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <WeatherHero />

        {/* Dashboard Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          {/* Weather Cards */}
          <section className="mb-8" aria-label="Weather details">
            <WeatherCards />
          </section>

          {/* Forecasts and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Hourly Forecast */}
            <section aria-label="Hourly forecast">
              <HourlyForecast />
            </section>

            {/* Daily Forecast */}
            <section aria-label="Daily forecast">
              <DailyForecast />
            </section>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <section aria-label="Temperature chart">
              <TemperatureChart />
            </section>
            <section aria-label="Rain probability chart">
              <RainChart />
            </section>
          </div>

          {/* Weather Insights */}
          <section className="mb-8" aria-label="Weather insights">
            <WeatherInsights />
          </section>
        </div>
      </main>

      <Footer />

      {/* Error overlay when there's an error but we have cached data */}
      <AnimatePresence>
        {error && weather && (
          <div className="fixed bottom-4 right-4 z-50 glass-card p-4 max-w-sm">
            <p className="text-sm text-white/70">{error}</p>
            <p className="text-xs text-white/40 mt-1">Showing last available data</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
}
