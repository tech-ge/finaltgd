import React from 'react';

export interface QrPreviewProps {
  payload: string;
}

export function QrPreview({ payload }: QrPreviewProps): React.ReactElement {
  return (
    <div className="aspect-square max-w-sm bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center p-4">
      <code className="text-xs text-gray-400 break-all text-center">
        {payload.slice(0, 96)}
      </code>
    </div>
  );
}
