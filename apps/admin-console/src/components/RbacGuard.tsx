import React from 'react';

export interface RbacGuardProps {
  allowedRoles: string[];
  currentRole: string;
  children: React.ReactNode;
}

export function RbacGuard({ allowedRoles, currentRole, children }: RbacGuardProps): React.ReactElement {
  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl text-sm text-gray-500">
        Access denied for role {currentRole}.
      </div>
    );
  }
  return <>{children}</>;
}
