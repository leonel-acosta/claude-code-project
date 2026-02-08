import { useState, useCallback } from 'react';
import { useGeolocation, useWeather, useAuth } from '../hooks';
import { CurrentWeather, Forecast, LocationSearch } from '../components/weather';
import { Button, Spinner } from '../components/ui';
import { useTheme } from '../context';

export function Home() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const geolocation = useGeolocation();

  const [customLocation, setCustomLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const latitude = customLocation?.latitude ?? geolocation.latitude;
  const longitude = customLocation?.longitude ?? geolocation.longitude;

  const weather = useWeather(latitude, longitude);

  const handleLocationSelect = useCallback((lat: number, lon: number) => {
    setCustomLocation({ latitude: lat, longitude: lon });
  }, []);

  const handleUseMyLocation = useCallback(() => {
    setCustomLocation(null);
    geolocation.refetch();
  }, [geolocation]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌤️</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Weather
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="!border-slate-300 dark:!border-slate-600"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
              {user?.name}
            </span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>
          {customLocation && (
            <Button
              variant="outline"
              onClick={handleUseMyLocation}
              className="!border-slate-300 dark:!border-slate-600"
            >
              📍 Use My Location
            </Button>
          )}
        </div>

        {geolocation.isLoading && !customLocation && (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner size="lg" />
            <p className="mt-5 text-slate-600 dark:text-slate-400 font-medium">
              Getting your location...
            </p>
          </div>
        )}

        {geolocation.error && !customLocation && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-5 mb-6">
            <p className="font-semibold text-red-700 dark:text-red-300">{geolocation.error}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              You can search for a city to view weather data.
            </p>
          </div>
        )}

        {weather.isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner size="lg" />
            <p className="mt-5 text-slate-600 dark:text-slate-400 font-medium">
              Loading weather data...
            </p>
          </div>
        )}

        {weather.error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-5 mb-6">
            <p className="font-semibold text-red-700 dark:text-red-300">{weather.error}</p>
            <Button onClick={weather.refetch} className="mt-4" size="sm" variant="secondary">
              Try Again
            </Button>
          </div>
        )}

        {weather.data && (
          <div className="space-y-6">
            <CurrentWeather data={weather.data.current} />
            <Forecast days={weather.data.daily} />
          </div>
        )}
      </main>
    </div>
  );
}
