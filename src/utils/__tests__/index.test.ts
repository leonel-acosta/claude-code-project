import { describe, it, expect } from 'vitest';
import { formatTemperature, formatDate, formatTime } from '../index';

describe('formatTemperature', () => {
  describe('Celsius formatting', () => {
    it('should format positive temperature in Celsius', () => {
      expect(formatTemperature(25)).toBe('25°C');
    });

    it('should format negative temperature in Celsius', () => {
      expect(formatTemperature(-5)).toBe('-5°C');
    });

    it('should format zero temperature in Celsius', () => {
      expect(formatTemperature(0)).toBe('0°C');
    });

    it('should round decimal temperatures in Celsius', () => {
      expect(formatTemperature(25.4)).toBe('25°C');
      expect(formatTemperature(25.6)).toBe('26°C');
    });

    it('should explicitly accept C unit', () => {
      expect(formatTemperature(20, 'C')).toBe('20°C');
    });
  });

  describe('Fahrenheit formatting', () => {
    it('should convert and format temperature in Fahrenheit', () => {
      expect(formatTemperature(0, 'F')).toBe('32°F');
    });

    it('should convert positive Celsius to Fahrenheit', () => {
      expect(formatTemperature(100, 'F')).toBe('212°F');
    });

    it('should convert negative Celsius to Fahrenheit', () => {
      expect(formatTemperature(-40, 'F')).toBe('-40°F');
    });

    it('should round decimal conversions', () => {
      expect(formatTemperature(20, 'F')).toBe('68°F');
    });
  });
});

describe('formatDate', () => {
  it('should format ISO date string to readable format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should include weekday in the format', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Monday');
  });

  it('should handle datetime strings', () => {
    const result = formatDate('2024-06-20T14:30:00');
    expect(result).toContain('June');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });

  it('should format different months correctly', () => {
    expect(formatDate('2024-12-25')).toContain('December');
    expect(formatDate('2024-07-04')).toContain('July');
  });
});

describe('formatTime', () => {
  it('should format time from datetime string', () => {
    const result = formatTime('2024-01-15T14:30:00');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('should format morning time', () => {
    const result = formatTime('2024-01-15T09:15:00');
    expect(result).toMatch(/09:15|9:15/);
  });

  it('should format afternoon time', () => {
    const result = formatTime('2024-01-15T15:45:00');
    expect(result).toMatch(/03:45|3:45|15:45/);
  });

  it('should format midnight', () => {
    const result = formatTime('2024-01-15T00:00:00');
    expect(result).toMatch(/12:00|00:00/);
  });

  it('should format noon', () => {
    const result = formatTime('2024-01-15T12:00:00');
    expect(result).toMatch(/12:00/);
  });
});
