export interface GeofenceObservation {
  orgId: number;
  employeeId: number;
  lat: number;
  lon: number;
  observedAt: number;
}

let currentObservation: GeofenceObservation | null = null;

export function setCurrentObservation(observation: GeofenceObservation): void {
  currentObservation = observation;
}

export function getCurrentObservation(): GeofenceObservation | null {
  return currentObservation;
}

export function clearObservation(): void {
  currentObservation = null;
}
