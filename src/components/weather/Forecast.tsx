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
        <div className="space-y-2">
          {days.map((day) => {
            const weather = WEATHER_CODES[day.weatherCode] || {
              description: 'Unknown',
              icon: '?',
            };

            return (
              <div
                key={day.date}
                className="flex items-center justify-between py-3 px-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">
                    {weather.icon}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold min-w-24">
                    {formatDate(day.date)}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 flex-1 text-center">
                  {weather.description}
                </div>
                <div className="text-right flex-1 font-semibold">
                  <span className="text-slate-900 dark:text-slate-100">
                    {Math.round(day.maxTemp)}°
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-3 font-normal">
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
