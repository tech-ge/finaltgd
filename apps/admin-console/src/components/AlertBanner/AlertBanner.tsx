import React from 'react';

export interface AlertBannerProps {
  level: 'info' | 'warning' | 'danger';
  message: string;
}

export function AlertBanner({ level, message }: AlertBannerProps): React.ReactElement {
  const bg =
    level === 'danger'
      ? 'bg-red-600'
      : level === 'warning'
        ? 'bg-yellow-600'
        : 'bg-blue-600';
  return (
    <div className={`${bg} text-white px-4 py-2 rounded-lg text-sm`}>{message}</div>
  );
}
