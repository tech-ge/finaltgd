export type Role = 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' | 'BUSINESS' | 'USER';

export interface Permission {
  resource: string;
  action: string;
  roles: Role[];
}

export const PERMISSIONS: Permission[] = [
  { resource: 'wallet', action: 'deposit', roles: ['USER', 'BUSINESS'] },
  { resource: 'wallet', action: 'send', roles: ['USER', 'BUSINESS'] },
  { resource: 'wallet', action: 'escrow', roles: ['USER', 'BUSINESS'] },
  { resource: 'wallet', action: 'read', roles: ['USER', 'BUSINESS', 'ADMIN', 'CEO'] },
  { resource: 'attendance', action: 'checkin', roles: ['WORKER', 'SUPERVISOR', 'ADMIN', 'CEO'] },
  { resource: 'attendance', action: 'monitor', roles: ['SUPERVISOR', 'ADMIN', 'CEO'] },
  { resource: 'admin', action: 'manage', roles: ['ADMIN', 'CEO'] },
  { resource: 'admin', action: 'read', roles: ['ADMIN', 'CEO', 'SUPERVISOR'] },
  { resource: 'ai', action: 'invoke', roles: ['USER', 'BUSINESS'] },
  { resource: 'assistant', action: 'invoke', roles: ['USER'] },
  { resource: 'business', action: 'manage', roles: ['BUSINESS'] },
  { resource: 'business', action: 'read', roles: ['BUSINESS', 'USER'] },
  { resource: 'health', action: 'read', roles: ['USER'] },
];

export function hasPermission(role: Role, resource: string, action: string): boolean {
  const match = PERMISSIONS.find((p) => p.resource === resource && p.action === action);
  if (!match) {
    return false;
  }
  return match.roles.includes(role);
}

export function permissionsFor(role: Role): Permission[] {
  return PERMISSIONS.filter((p) => p.roles.includes(role));
}
