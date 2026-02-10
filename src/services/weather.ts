import type { WeatherData, GeocodingResult } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      time: data.current.time,
    },
    daily: data.daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
      weatherCode: data.daily.weather_code[index],
    })),
    location: {
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    },
  };
}

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    name: query,
    count: '5',
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to search for city');
  }

  const data = await response.json();

  return data.results || [];
}

export interface ReverseGeocodingResult {
  name: string;
  country?: string;
  admin1?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
    });

    const response = await fetch(`${REVERSE_GEOCODING_URL}?${params}`, {
      headers: {
        'User-Agent': 'WeatherApp/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const name = data.address?.city
      || data.address?.town
      || data.address?.village
      || data.address?.municipality
      || data.address?.county
      || '';

    return {
      name,
      country: data.address?.country,
      admin1: data.address?.state || data.address?.region,
    };
  } catch {
    return null;
  }
}
