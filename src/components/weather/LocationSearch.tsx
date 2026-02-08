import { useState, useCallback } from 'react';
import { Input, Button } from '../ui';
import { searchCity } from '../../services/weather';
import type { GeocodingResult } from '../../types';

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const cities = await searchCity(query);
      setResults(cities);
      if (cities.length === 0) {
        setError('No cities found');
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleSelect = (result: GeocodingResult) => {
    onLocationSelect(result.latitude, result.longitude);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors duration-150 ${
                index < results.length - 1
                  ? 'border-b border-slate-200 dark:border-slate-700'
                  : ''
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {result.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {[result.admin1, result.country].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
