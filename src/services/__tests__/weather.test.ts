import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWeather, searchCity, reverseGeocode } from '../weather';

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const mockApiResponse = {
      latitude: 48.8566,
      longitude: 2.3522,
      timezone: 'Europe/Paris',
      current: {
        temperature_2m: 20,
        weather_code: 0,
        wind_speed_10m: 15,
        relative_humidity_2m: 65,
        time: '2024-01-15T12:00',
      },
      daily: {
        time: ['2024-01-15', '2024-01-16'],
        temperature_2m_max: [22, 24],
        temperature_2m_min: [15, 16],
        weather_code: [0, 1],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const result = await fetchWeather(48.8566, 2.3522);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('api.open-meteo.com'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('latitude=48.8566'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('longitude=2.3522'));

    expect(result).toEqual({
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
    });
  });

  it('should throw error when API request fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchWeather(48.8566, 2.3522)).rejects.toThrow('Failed to fetch weather data');
  });

  it('should include correct query parameters', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          latitude: 0,
          longitude: 0,
          timezone: 'UTC',
          current: {
            temperature_2m: 0,
            weather_code: 0,
            wind_speed_10m: 0,
            relative_humidity_2m: 0,
            time: '',
          },
          daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], weather_code: [] },
        }),
    });

    await fetchWeather(10, 20);

    const fetchUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(fetchUrl).toContain('current=temperature_2m');
    expect(fetchUrl).toContain('weather_code');
    expect(fetchUrl).toContain('wind_speed_10m');
    expect(fetchUrl).toContain('relative_humidity_2m');
    expect(fetchUrl).toContain('daily=temperature_2m_max');
    expect(fetchUrl).toContain('timezone=auto');
    expect(fetchUrl).toContain('forecast_days=7');
  });
});

describe('searchCity', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty array for empty query', async () => {
    const result = await searchCity('');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should return empty array for whitespace-only query', async () => {
    const result = await searchCity('   ');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should search for cities successfully', async () => {
    const mockResults = [
      { id: 1, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', admin1: 'Ile-de-France' },
      { id: 2, name: 'Paris', latitude: 33.6609, longitude: -95.5555, country: 'United States', admin1: 'Texas' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: mockResults }),
    });

    const result = await searchCity('Paris');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('geocoding-api.open-meteo.com'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('name=Paris'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('count=5'));
    expect(result).toEqual(mockResults);
  });

  it('should return empty array when no results found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const result = await searchCity('NonexistentCity12345');
    expect(result).toEqual([]);
  });

  it('should throw error when search API fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(searchCity('Paris')).rejects.toThrow('Failed to search for city');
  });
});

describe('reverseGeocode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reverse geocode coordinates successfully with city', async () => {
    const mockResponse = {
      address: {
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(48.8566, 2.3522);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('nominatim.openstreetmap.org/reverse'),
      expect.objectContaining({
        headers: { 'User-Agent': 'WeatherApp/1.0' },
      })
    );
    expect(result).toEqual({
      name: 'Paris',
      country: 'France',
      admin1: 'Ile-de-France',
    });
  });

  it('should fallback to town when city is not available', async () => {
    const mockResponse = {
      address: {
        town: 'SmallTown',
        country: 'Germany',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result?.name).toBe('SmallTown');
  });

  it('should fallback to village when town is not available', async () => {
    const mockResponse = {
      address: {
        village: 'TinyVillage',
        country: 'Italy',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(45.0, 11.0);
    expect(result?.name).toBe('TinyVillage');
  });

  it('should fallback to municipality when village is not available', async () => {
    const mockResponse = {
      address: {
        municipality: 'Municipality',
        country: 'Spain',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(40.0, -3.0);
    expect(result?.name).toBe('Municipality');
  });

  it('should fallback to county when municipality is not available', async () => {
    const mockResponse = {
      address: {
        county: 'SomeCounty',
        country: 'UK',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(51.0, -1.0);
    expect(result?.name).toBe('SomeCounty');
  });

  it('should return null when API request fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await reverseGeocode(48.8566, 2.3522);
    expect(result).toBeNull();
  });

  it('should return null when fetch throws an error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await reverseGeocode(48.8566, 2.3522);
    expect(result).toBeNull();
  });

  it('should use region as admin1 when state is not available', async () => {
    const mockResponse = {
      address: {
        city: 'TestCity',
        region: 'TestRegion',
        country: 'TestCountry',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await reverseGeocode(0, 0);
    expect(result?.admin1).toBe('TestRegion');
  });
});
