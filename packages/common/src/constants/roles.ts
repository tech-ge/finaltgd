export const ROLES = ['CEO', 'ADMIN', 'SUPERVISOR', 'WORKER'] as const;
export type RoleName = (typeof ROLES)[number];

export const ACCOUNT_TYPES = ['USER', 'BUSINESS', 'TREASURY', 'ESCROW'] as const;
export type AccountTypeName = (typeof ACCOUNT_TYPES)[number];

export const ROLE_CREATION_MATRIX: Record<RoleName, RoleName[]> = {
  CEO: ['ADMIN'],
  ADMIN: ['SUPERVISOR'],
  SUPERVISOR: ['WORKER'],
  WORKER: [],
};

export function canCreate(actor: RoleName, target: RoleName): boolean {
  return ROLE_CREATION_MATRIX[actor].includes(target);
}
