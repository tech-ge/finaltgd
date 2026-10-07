import { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

export interface AccelerometerReading {
  x: number;
  y: number;
  z: number;
}

export function useSensors(intervalMs = 1000) {
  const [reading, setReading] = useState<AccelerometerReading | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    Accelerometer.setUpdateInterval(intervalMs);
    subscription = Accelerometer.addListener((data) => {
      setReading({ x: data.x, y: data.y, z: data.z });
    });
    return () => {
      subscription?.remove();
    };
  }, [intervalMs]);

  return reading;
}
