import React from 'react';

export interface WorkerPosition {
  employeeId: number;
  fullName: string;
  lat: number;
  lon: number;
  status: string;
}

export interface LiveMapProps {
  workers: WorkerPosition[];
}

export function LiveMap({ workers }: LiveMapProps): React.ReactElement {
  return (
    <div className="aspect-video bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center">
      {workers.length === 0 ? (
        <p className="text-sm text-gray-500">No workers in the field.</p>
      ) : (
        <ul className="text-sm text-gray-300 space-y-1">
          {workers.map((w) => (
            <li key={w.employeeId}>
              {w.fullName} · {w.status} · ({w.lat.toFixed(4)}, {w.lon.toFixed(4)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
