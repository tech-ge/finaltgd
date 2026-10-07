import React from 'react';

export interface WorkerCardProps {
  fullName: string;
  role: string;
  status: string;
}

export function WorkerCard({ fullName, role, status }: WorkerCardProps): React.ReactElement {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <h3 className="font-semibold">{fullName}</h3>
      <p className="text-xs text-gray-400">{role}</p>
      <p className="text-xs text-gray-500 mt-1">Status: {status}</p>
    </div>
  );
}
