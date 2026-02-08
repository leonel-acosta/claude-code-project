import { useState, useEffect, useCallback } from 'react';
import { fetchWeather } from '../services/weather';
import type { WeatherData } from '../types';

interface UseWeatherState {
  data: WeatherData | null;
  error: string | null;
  isLoading: boolean;
}

export function useWeather(latitude: number | null, longitude: number | null) {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetch = useCallback(async () => {
    if (latitude === null || longitude === null) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchWeather(latitude, longitude);
      setState({ data, error: null, isLoading: false });
    } catch (err) {
      setState({
        data: null,
        error: err instanceof Error ? err.message : 'Failed to fetch weather',
        isLoading: false,
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}
