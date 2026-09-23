// WMO Weather interpretation codes mapping
// Reference: https://open-meteo.com/en/docs

export interface WeatherInfo {
  condition: string;
  icon: string;
  category: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog' | 'snow' | 'drizzle';
  description: string;
}

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherInfo {
  const weatherMap: Record<number, WeatherInfo> = {
    0: { condition: 'Clear Sky', icon: isDay ? '☀️' : '🌙', category: 'clear', description: 'Clear skies' },
    1: { condition: 'Mainly Clear', icon: isDay ? '🌤️' : '🌙', category: 'clear', description: 'Mainly clear' },
    2: { condition: 'Partly Cloudy', icon: isDay ? '⛅' : '☁️', category: 'cloudy', description: 'Partly cloudy' },
    3: { condition: 'Overcast', icon: '☁️', category: 'cloudy', description: 'Overcast skies' },
    45: { condition: 'Foggy', icon: '🌫️', category: 'fog', description: 'Foggy conditions' },
    48: { condition: 'Rime Fog', icon: '🌫️', category: 'fog', description: 'Depositing rime fog' },
    51: { condition: 'Light Drizzle', icon: '🌦️', category: 'drizzle', description: 'Light drizzle' },
    53: { condition: 'Moderate Drizzle', icon: '🌦️', category: 'drizzle', description: 'Moderate drizzle' },
    55: { condition: 'Dense Drizzle', icon: '🌧️', category: 'drizzle', description: 'Dense drizzle' },
    56: { condition: 'Freezing Drizzle', icon: '🌧️', category: 'drizzle', description: 'Light freezing drizzle' },
    57: { condition: 'Heavy Freezing Drizzle', icon: '🌧️', category: 'drizzle', description: 'Dense freezing drizzle' },
    61: { condition: 'Light Rain', icon: '🌦️', category: 'rain', description: 'Slight rain' },
    63: { condition: 'Rain', icon: '🌧️', category: 'rain', description: 'Moderate rain' },
    65: { condition: 'Heavy Rain', icon: '🌧️', category: 'rain', description: 'Heavy rain' },
    66: { condition: 'Freezing Rain', icon: '🌧️', category: 'rain', description: 'Light freezing rain' },
    67: { condition: 'Heavy Freezing Rain', icon: '🌧️', category: 'rain', description: 'Heavy freezing rain' },
    71: { condition: 'Light Snow', icon: '🌨️', category: 'snow', description: 'Slight snowfall' },
    73: { condition: 'Snow', icon: '🌨️', category: 'snow', description: 'Moderate snowfall' },
    75: { condition: 'Heavy Snow', icon: '❄️', category: 'snow', description: 'Heavy snowfall' },
    77: { condition: 'Snow Grains', icon: '❄️', category: 'snow', description: 'Snow grains' },
    80: { condition: 'Light Showers', icon: '🌦️', category: 'rain', description: 'Slight rain showers' },
    81: { condition: 'Rain Showers', icon: '🌧️', category: 'rain', description: 'Moderate rain showers' },
    82: { condition: 'Violent Showers', icon: '🌧️', category: 'rain', description: 'Violent rain showers' },
    85: { condition: 'Light Snow Showers', icon: '🌨️', category: 'snow', description: 'Slight snow showers' },
    86: { condition: 'Heavy Snow Showers', icon: '🌨️', category: 'snow', description: 'Heavy snow showers' },
    95: { condition: 'Thunderstorm', icon: '⛈️', category: 'storm', description: 'Thunderstorm' },
    96: { condition: 'Thunderstorm with Hail', icon: '⛈️', category: 'storm', description: 'Thunderstorm with slight hail' },
    99: { condition: 'Severe Thunderstorm', icon: '⛈️', category: 'storm', description: 'Thunderstorm with heavy hail' },
  };

  return weatherMap[code] || { condition: 'Unknown', icon: '🌡️', category: 'clear', description: 'Unknown conditions' };
}

export function getUVCategory(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: '#4ade80' };
  if (uv <= 5) return { label: 'Moderate', color: '#facc15' };
  if (uv <= 7) return { label: 'High', color: '#fb923c' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
}

export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry';
  if (humidity < 60) return 'Comfortable';
  if (humidity < 80) return 'Humid';
  return 'Very Humid';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function generateWeatherInsights(data: {
  humidity: number;
  rainProbability: number;
  uvIndex: number;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
}): string[] {
  const insights: string[] = [];

  if (data.humidity > 75 && data.temperature > 30) {
    insights.push('High humidity may make it feel warmer than actual temperature.');
  }
  if (data.rainProbability > 60) {
    insights.push('Rain is likely — carry an umbrella if heading out.');
  }
  if (data.uvIndex > 7) {
    insights.push('UV levels are very high. Use sunscreen and avoid prolonged sun exposure.');
  } else if (data.uvIndex > 5) {
    insights.push('UV levels are high. Consider sun protection during peak hours.');
  }
  if (Math.abs(data.feelsLike - data.temperature) > 3) {
    if (data.feelsLike > data.temperature) {
      insights.push('It feels warmer than the actual temperature due to humidity.');
    } else {
      insights.push('Wind chill makes it feel cooler than the actual temperature.');
    }
  }
  if (data.windSpeed > 40) {
    insights.push('Strong winds expected. Be cautious outdoors.');
  }
  if (data.temperature > 42) {
    insights.push('Extreme heat alert — stay hydrated and avoid outdoor activities.');
  }
  if (data.temperature < 5) {
    insights.push('Very cold conditions. Dress warmly and watch for frost.');
  }
  if (data.rainProbability > 30 && data.rainProbability <= 60) {
    insights.push('There is a chance of rain. Keep an umbrella handy.');
  }
  if (insights.length === 0) {
    insights.push('Pleasant weather conditions. A good day to be outdoors!');
  }

  return insights.slice(0, 4);
}
