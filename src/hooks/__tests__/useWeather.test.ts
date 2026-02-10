import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWeather } from '../useWeather';
import * as weatherService from '../../services/weather';

vi.mock('../../services/weather', () => ({
  fetchWeather: vi.fn(),
}));

describe('useWeather', () => {
  const mockWeatherData = {
    current: {
      temperature: 20,
      windSpeed: 15,
      humidity: 65,
      weatherCode: 0,
      time: '2024-01-15T12:00',
    },
    daily: [
      { date: '2024-01-15', maxTemp: 22, minTemp: 15, weatherCode: 0 },
      { date: '2024-01-16', maxTemp: 24, minTemp: 16, weatherCode: 1 },
    ],
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      timezone: 'Europe/Paris',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not fetch when coordinates are null', async () => {
    const { result } = renderHook(() => useWeather(null, null));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(weatherService.fetchWeather).not.toHaveBeenCalled();
  });

  it('should not fetch when latitude is null', async () => {
    const { result } = renderHook(() => useWeather(null, 2.3522));

    expect(weatherService.fetchWeather).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });

  it('should not fetch when longitude is null', async () => {
    const { result } = renderHook(() => useWeather(48.8566, null));

    expect(weatherService.fetchWeather).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });

  it('should fetch weather data when coordinates are provided', async () => {
    vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeatherData);

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(weatherService.fetchWeather).toHaveBeenCalledWith(48.8566, 2.3522);
    expect(result.current.data).toEqual(mockWeatherData);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(weatherService.fetchWeather).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.data).toBeNull();
  });

  it('should handle non-Error rejections', async () => {
    vi.mocked(weatherService.fetchWeather).mockRejectedValue('String error');

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch weather');
  });

  it('should refetch when coordinates change', async () => {
    vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeatherData);

    const { result, rerender } = renderHook(
      ({ lat, lon }) => useWeather(lat, lon),
      { initialProps: { lat: 48.8566, lon: 2.3522 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(weatherService.fetchWeather).toHaveBeenCalledTimes(1);

    // Change coordinates
    rerender({ lat: 40.7128, lon: -74.006 });

    await waitFor(() => {
      expect(weatherService.fetchWeather).toHaveBeenCalledTimes(2);
    });

    expect(weatherService.fetchWeather).toHaveBeenLastCalledWith(40.7128, -74.006);
  });

  it('should provide refetch function', async () => {
    vi.mocked(weatherService.fetchWeather).mockResolvedValue(mockWeatherData);

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(weatherService.fetchWeather).toHaveBeenCalledTimes(2);
  });

  it('should set loading to true while fetching', async () => {
    let resolvePromise: (value: typeof mockWeatherData) => void;
    const promise = new Promise<typeof mockWeatherData>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(weatherService.fetchWeather).mockReturnValue(promise);

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!(mockWeatherData);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear error on successful refetch', async () => {
    vi.mocked(weatherService.fetchWeather)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce(mockWeatherData);

    const { result } = renderHook(() => useWeather(48.8566, 2.3522));

    await waitFor(() => {
      expect(result.current.error).toBe('First error');
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockWeatherData);
    });
  });
});
