export interface Location {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface HourlyData {
  time: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  rainProbability: number;
  windSpeed: number;
  isDay: number;
}

export interface DailyData {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  precipitation: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  visibility: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
}
