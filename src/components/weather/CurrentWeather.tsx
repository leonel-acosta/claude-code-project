import { Card, CardContent } from '../ui';
import { WEATHER_CODES } from '../../types';
import type { CurrentWeather as CurrentWeatherType } from '../../types';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const weather = WEATHER_CODES[data.weatherCode] || {
    description: 'Unknown',
    icon: '?',
  };

  return (
    <Card className="text-center">
      <CardContent>
        <div className="text-6xl mb-4">{weather.icon}</div>
        <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {Math.round(data.temperature)}°C
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {weather.description}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-gray-500 dark:text-gray-400">Wind</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {data.windSpeed} km/h
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-gray-500 dark:text-gray-400">Humidity</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {data.humidity}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
