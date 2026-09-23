import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Bookmark, X, Cloud } from 'lucide-react';
import { searchCities, City } from '../utils/indianCities';
import { useWeatherContext } from '../context/WeatherContext';
import { Location } from '../types/weather';

export default function Header() {
  const { location, savedCities, setLocation, addSavedCity, removeSavedCity, useGeolocation } = useWeatherContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [savedOpen, setSavedOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(searchCities(q));
    }, 200);
  }, []);

  const selectCity = useCallback((city: City) => {
    const loc: Location = { name: city.name, state: city.state, country: 'India', latitude: city.latitude, longitude: city.longitude };
    setLocation(loc);
    setQuery('');
    setResults([]);
    setSearchOpen(false);
  }, [setLocation]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const isSaved = savedCities.some(c => c.name === location.name);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Mausam
          </span>
        </motion.div>

        {/* Location display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-full"
        >
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white/90">
            {location.name}, {location.state}
          </span>
          <button
            onClick={() => isSaved ? removeSavedCity(location.name) : addSavedCity({ name: location.name, state: location.state, country: 'India', latitude: location.latitude, longitude: location.longitude })}
            className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isSaved ? 'Remove from saved' : 'Save city'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white/50'}`} />
          </button>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-xl glass-card hover:bg-white/10 transition-all"
            aria-label="Search city"
          >
            <Search className="w-5 h-5 text-white/80" />
          </button>
          <button
            onClick={useGeolocation}
            className="p-2.5 rounded-xl glass-card hover:bg-white/10 transition-all"
            aria-label="Use my location"
          >
            <MapPin className="w-5 h-5 text-white/80" />
          </button>
          <button
            onClick={() => setSavedOpen(!savedOpen)}
            className="p-2.5 rounded-xl glass-card hover:bg-white/10 transition-all relative"
            aria-label="Saved cities"
          >
            <Bookmark className="w-5 h-5 text-white/80" />
            {savedCities.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] flex items-center justify-center font-bold">
                {savedCities.length}
              </span>
            )}
          </button>
        </motion.div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-16 left-4 right-4 max-w-lg mx-auto glass-card p-3 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-white/50 ml-2" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search Indian cities..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm py-2"
              />
              <button onClick={() => { setSearchOpen(false); setQuery(''); }} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>
            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {results.map((city) => (
                  <button
                    key={`${city.name}-${city.state}`}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white/90">{city.name}</div>
                      <div className="text-xs text-white/50">{city.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <p className="text-sm text-white/40 text-center py-4">No cities found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved cities dropdown */}
      <AnimatePresence>
        {savedOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 glass-card p-3 rounded-2xl shadow-2xl w-64"
          >
            <h3 className="text-sm font-semibold text-white/80 px-2 mb-2">Saved Cities</h3>
            {savedCities.length === 0 ? (
              <p className="text-xs text-white/40 px-2 py-3">No saved cities yet. Use the bookmark icon to save a city.</p>
            ) : (
              <div className="space-y-1">
                {savedCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => { setLocation(city); setSavedOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm text-white/90">{city.name}</div>
                      <div className="text-xs text-white/50">{city.state}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSavedCity(city.name); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-500/20 transition-all"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
