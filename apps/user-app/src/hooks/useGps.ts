import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface GpsPosition {
  lat: number;
  lon: number;
  accuracyMeters: number;
}

export function useGps() {
  const [position, setPosition] = useState<GpsPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('permission_denied');
        return null;
      }
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const next: GpsPosition = {
        lat: result.coords.latitude,
        lon: result.coords.longitude,
        accuracyMeters: result.coords.accuracy ?? 0,
      };
      setPosition(next);
      setError(null);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'location_error';
      setError(message);
      return null;
    }
  }, []);

  return { position, error, request };
}
