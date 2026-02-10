import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGeolocation } from '../useGeolocation';
import { mockGeolocation } from '../../test/setup';

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial loading state', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {});

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return coordinates on successful geolocation', async () => {
    const mockPosition = {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.latitude).toBe(48.8566);
    expect(result.current.longitude).toBe(2.3522);
    expect(result.current.error).toBeNull();
  });

  it('should handle permission denied error', async () => {
    const mockError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Location permission denied. Please enable location access.');
    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
  });

  it('should handle position unavailable error', async () => {
    const mockError = {
      code: 2,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Location information is unavailable.');
  });

  it('should handle timeout error', async () => {
    const mockError = {
      code: 3,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Location request timed out.');
  });

  it('should provide refetch function', async () => {
    const mockPosition = {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    // Test that refetch calls getCurrentPosition again
    act(() => {
      result.current.refetch();
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2);
  });

  it('should call getCurrentPosition with correct options', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {});

    renderHook(() => useGeolocation());

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
});
