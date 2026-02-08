# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weather web application that shows real-time weather data based on the user's current location or a searched city.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Weather API**: Open-Meteo (free, no API key required)
- **Build Tool**: Vite
- **Package Manager**: npm

## API Reference — Open-Meteo

Base URL: `https://api.open-meteo.com/v1/forecast`

- No API key needed
- Requires `latitude` and `longitude` as query params
- Use `current` param for real-time data (e.g. `current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`)
- Use `daily` param for daily forecast
- Use `hourly` param for hourly forecast
- Set `timezone=auto` to get local time
- Set `forecast_days=7` for a week forecast

Geocoding API: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5`

Example request:
```
https://api.open-meteo.com/v1/forecast?latitude=19.43&longitude=-99.13&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7
```

## Build & Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/          # Base UI components (Button, Card, Input, Spinner)
│   └── weather/     # Weather-specific components (CurrentWeather, Forecast, LocationSearch)
├── hooks/           # Custom React hooks (useGeolocation, useWeather)
├── services/        # API calls and external service integrations
│   └── weather.ts   # Open-Meteo API client
├── types/           # TypeScript type definitions
├── utils/           # Utility/helper functions
├── context/         # React context providers (Theme)
├── pages/           # Page-level components (Home)
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

## Code Conventions

- Use functional components with hooks exclusively — no class components
- Name components in PascalCase, hooks with `use` prefix, utilities in camelCase
- Keep API calls in `services/` — components never call `fetch` directly
- Use TypeScript `interface` for object shapes, `type` for unions and utility types
- Tailwind classes go directly on elements — no separate CSS files
- Handle loading, error, and empty states in every component that fetches data
- Use `navigator.geolocation` API for user location, always handle permission denied

## Key Weather Codes (WMO)

Map `weather_code` from the API to icons/descriptions:
- 0: Clear sky
- 1-3: Partly cloudy
- 45, 48: Fog
- 51-55: Drizzle
- 61-65: Rain
- 71-75: Snow
- 80-82: Rain showers
- 95, 96, 99: Thunderstorm
