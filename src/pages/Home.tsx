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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Weather App
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name}
            </span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <LocationSearch onLocationSelect={handleLocationSelect} />
          </div>
          {customLocation && (
            <Button variant="outline" onClick={handleUseMyLocation}>
              Use My Location
            </Button>
          )}
        </div>

        {geolocation.isLoading && !customLocation && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Getting your location...
            </p>
          </div>
        )}

        {geolocation.error && !customLocation && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{geolocation.error}</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              You can search for a city to view weather data.
            </p>
          </div>
        )}

        {weather.isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading weather data...
            </p>
          </div>
        )}

        {weather.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{weather.error}</p>
            <Button onClick={weather.refetch} className="mt-2" size="sm">
              Retry
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
