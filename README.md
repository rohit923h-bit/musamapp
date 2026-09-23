# Mausam 3D 🌦️

A premium 3D weather dashboard for Indian cities, built with React, Three.js, and modern web technologies.

![Mausam 3D](https://img.shields.io/badge/Mausam-3D-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-R3F-purple)

## Features

- 🌍 **Real-time Weather Data** — Powered by Open-Meteo API (no API key required)
- 🎨 **Immersive 3D Scenes** — Dynamic weather visualizations using React Three Fiber
- 🇮🇳 **India-Focused** — 40+ Indian cities with state information
- 📊 **Rich Charts** — Temperature trends and rain probability visualizations
- 🔮 **Glassmorphism UI** — Premium dark atmospheric design
- 📱 **Fully Responsive** — Mobile-first design that works on all devices
- 💾 **Saved Cities** — Save and quickly switch between favorite locations
- 📍 **Geolocation** — Auto-detect your location
- ⚡ **Performance Optimized** — Lazy-loaded 3D, reduced particles on mobile
- ♿ **Accessible** — Semantic HTML, keyboard navigation, reduced-motion support

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React
- **Weather API:** Open-Meteo (free, no API key)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mausam-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation with search
│   ├── WeatherHero.tsx     # Main hero with 3D scene
│   ├── WeatherScene3D.tsx  # Three.js weather visualization
│   ├── WeatherCards.tsx    # Metric cards grid
│   ├── HourlyForecast.tsx  # 24-hour forecast
│   ├── DailyForecast.tsx   # 7-day forecast
│   ├── Charts.tsx          # Temperature & rain charts
│   ├── WeatherInsights.tsx # AI-generated insights
│   ├── ErrorState.tsx      # Error handling UI
│   └── Footer.tsx          # Footer with attribution
├── context/
│   └── WeatherContext.tsx  # Global state management
├── services/
│   └── weatherApi.ts       # API service layer
├── types/
│   └── weather.ts          # TypeScript interfaces
├── utils/
│   ├── weatherUtils.ts     # Weather code mapping & helpers
│   └── indianCities.ts     # Indian city database
├── App.tsx                 # Main application
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## API

This application uses the [Open-Meteo API](https://open-meteo.com/) which is free and requires no API key. Weather data includes:

- Current conditions (temperature, humidity, wind, UV, pressure)
- 24-hour hourly forecast
- 7-day daily forecast
- Sunrise/sunset times

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT
