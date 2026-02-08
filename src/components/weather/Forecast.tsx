import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { WEATHER_CODES } from '../../types';
import type { DailyForecast } from '../../types';

interface ForecastProps {
  days: DailyForecast[];
}

export function Forecast({ days }: ForecastProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {days.map((day) => {
            const weather = WEATHER_CODES[day.weatherCode] || {
              description: 'Unknown',
              icon: '?',
            };

            return (
              <div
                key={day.date}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{weather.icon}</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {formatDate(day.date)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex-1 text-center">
                  {weather.description}
                </div>
                <div className="text-right flex-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {Math.round(day.maxTemp)}°
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 ml-2">
                    {Math.round(day.minTemp)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
