export interface PathPoint {
  lat: number;
  lon: number;
  at: Date;
}

export interface RecordedPath {
  accountId: number;
  origin: PathPoint;
  destination: PathPoint;
  waypoints: PathPoint[];
}

export function summarize(path: RecordedPath): {
  accountId: number;
  durationSeconds: number;
  waypointCount: number;
} {
  const last = path.waypoints[path.waypoints.length - 1];
  const duration = last
    ? (last.at.getTime() - path.origin.at.getTime()) / 1000
    : (path.destination.at.getTime() - path.origin.at.getTime()) / 1000;

  return {
    accountId: path.accountId,
    durationSeconds: Math.max(0, Math.round(duration)),
    waypointCount: path.waypoints.length,
  };
}
