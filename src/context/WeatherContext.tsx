import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WeatherData, Location } from '../types/weather';
import { fetchWeather } from '../services/weatherApi';
import { indianCities, City } from '../utils/indianCities';

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  location: Location;
  savedCities: Location[];
  setLocation: (loc: Location) => void;
  addSavedCity: (loc: Location) => void;
  removeSavedCity: (name: string) => void;
  useGeolocation: () => void;
  retry: () => void;
}

const defaultLocation: Location = {
  name: 'New Delhi',
  state: 'Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.2090,
};

const WeatherContext = createContext<WeatherContextType | null>(null);

function loadSavedCities(): Location[] {
  try {
    const saved = localStorage.getItem('mausam_saved_cities');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function loadLastLocation(): Location {
  try {
    const saved = localStorage.getItem('mausam_last_location');
    return saved ? JSON.parse(saved) : defaultLocation;
  } catch { return defaultLocation; }
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocationState] = useState<Location>(loadLastLocation);
  const [savedCities, setSavedCities] = useState<Location[]>(loadSavedCities);

  const loadWeather = useCallback(async (loc: Location) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc);
      setWeather(data);
      localStorage.setItem('mausam_last_location', JSON.stringify(loc));
    } catch (err) {
      setError('Unable to fetch weather data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  const setLocation = useCallback((loc: Location) => {
    setLocationState(loc);
  }, []);

  const addSavedCity = useCallback((loc: Location) => {
    setSavedCities(prev => {
      if (prev.find(c => c.name === loc.name)) return prev;
      const updated = [...prev, loc];
      localStorage.setItem('mausam_saved_cities', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeSavedCity = useCallback((name: string) => {
    setSavedCities(prev => {
      const updated = prev.filter(c => c.name !== name);
      localStorage.setItem('mausam_saved_cities', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const useGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Find nearest Indian city
        const { latitude, longitude } = pos.coords;
        let nearest: City = indianCities[0];
        let minDist = Infinity;
        for (const city of indianCities) {
          const dist = Math.sqrt(
            Math.pow(city.latitude - latitude, 2) + Math.pow(city.longitude - longitude, 2)
          );
          if (dist < minDist) { minDist = dist; nearest = city; }
        }
        setLocation({ name: nearest.name, state: nearest.state, country: 'India', latitude, longitude });
      },
      () => {
        // Fall back to default
        setLocation(defaultLocation);
      }
    );
  }, [setLocation]);

  const retry = useCallback(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  return (
    <WeatherContext.Provider value={{
      weather, loading, error, location, savedCities,
      setLocation, addSavedCity, removeSavedCity, useGeolocation, retry,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used within WeatherProvider');
  return ctx;
}
