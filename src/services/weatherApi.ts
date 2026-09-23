import { WeatherData, CurrentWeather, HourlyData, DailyData, Location } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherUtils';

const BASE_URL = 'https://api.open-meteo.com/v1';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    surface_pressure: number;
    is_day: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

export async function fetchWeather(location: Location): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,is_day,uv_index',
    hourly: 'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}/forecast?${params}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data: OpenMeteoResponse = await response.json();

  const weatherInfo = getWeatherInfo(data.current.weather_code, data.current.is_day === 1);

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    rainProbability: data.hourly.precipitation_probability[0] || 0,
    precipitation: data.current.precipitation,
    uvIndex: Math.round(data.current.uv_index * 10) / 10,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    windGusts: Math.round(data.current.wind_gusts_10m),
    pressure: Math.round(data.current.surface_pressure),
    visibility: 10, // Open-Meteo free doesn't provide visibility
    condition: weatherInfo.condition,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    lastUpdated: data.current.time,
  };

  // Get next 24 hours of hourly data
  const now = new Date();
  const currentHourIndex = data.hourly.time.findIndex(t => new Date(t) >= now);
  const startIndex = Math.max(0, currentHourIndex);

  const hourly: HourlyData[] = data.hourly.time.slice(startIndex, startIndex + 24).map((time, i) => ({
    time,
    temperature: Math.round(data.hourly.temperature_2m[startIndex + i]),
    humidity: data.hourly.relative_humidity_2m[startIndex + i],
    weatherCode: data.hourly.weather_code[startIndex + i],
    rainProbability: data.hourly.precipitation_probability[startIndex + i] || 0,
    windSpeed: Math.round(data.hourly.wind_speed_10m[startIndex + i]),
    isDay: data.hourly.is_day[startIndex + i],
  }));

  const daily: DailyData[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    rainProbability: data.daily.precipitation_probability_max[i] || 0,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: Math.round(data.daily.uv_index_max[i] * 10) / 10,
  }));

  return { location, current, hourly, daily };
}
