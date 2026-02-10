import { Card, CardContent } from '../ui';
import { WEATHER_CODES } from '../../types';
import type { CurrentWeather as CurrentWeatherType } from '../../types';
import type { LocationInfo } from './LocationSearch';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  location?: LocationInfo;
}

export function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const weather = WEATHER_CODES[data.weatherCode] || {
    description: 'Unknown',
    icon: '?',
  };

  const locationLabel = location?.name
    ? [location.name, location.admin1, location.country].filter(Boolean).join(', ')
    : 'Current Location';

  return (
    <Card className="text-center bg-linear-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <CardContent>
        <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
          {weather.icon}
        </div>

        {/* Location info */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">📍</span>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {locationLabel}
            </h2>
          </div>
          {location && (
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-tight">
              {Math.abs(location.latitude).toFixed(4)}° {location.latitude >= 0 ? 'N' : 'S'}, {Math.abs(location.longitude).toFixed(4)}° {location.longitude >= 0 ? 'E' : 'W'}
            </p>
          )}
        </div>

        <div className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {Math.round(data.temperature)}
          <span className="text-4xl ml-1">°C</span>
        </div>
        <div className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
          {weather.description}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-600 rounded-lg p-4">
            <div className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Wind
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-2 text-lg">
              {data.windSpeed}
              <span className="text-sm ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-600 rounded-lg p-4">
            <div className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Humidity
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-2 text-lg">
              {data.humidity}
              <span className="text-sm ml-1">%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
