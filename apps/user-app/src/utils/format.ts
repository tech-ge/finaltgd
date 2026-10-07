export function formatTgd(amount: string): string {
  const numeric = Number.parseFloat(amount);
  if (!Number.isFinite(numeric)) {
    return '0.0000';
  }
  return numeric.toFixed(4);
}

export function formatMeters(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatEta(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}
