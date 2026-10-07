export type Role = 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER';

export interface ActorContext {
  accountId: number;
  orgId: number;
  role: Role;
}

export interface RoleRules {
  canCreate: Role[];
  canRemove: Role[];
  canView: Role[];
}

export const ROLE_RULES: Record<Role, RoleRules> = {
  CEO: {
    canCreate: ['ADMIN'],
    canRemove: ['ADMIN'],
    canView: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
  ADMIN: {
    canCreate: ['SUPERVISOR'],
    canRemove: ['SUPERVISOR'],
    canView: ['SUPERVISOR', 'WORKER'],
  },
  SUPERVISOR: {
    canCreate: ['WORKER'],
    canRemove: ['WORKER'],
    canView: ['WORKER'],
  },
  WORKER: {
    canCreate: [],
    canRemove: [],
    canView: [],
  },
};

export function assertCanCreate(actor: ActorContext, target: Role): void {
  const rules = ROLE_RULES[actor.role];
  if (!rules.canCreate.includes(target)) {
    throw new Error(`role_not_allowed_to_create: ${actor.role} -> ${target}`);
  }
}

export function assertCanRemove(actor: ActorContext, target: Role): void {
  const rules = ROLE_RULES[actor.role];
  if (!rules.canRemove.includes(target)) {
    throw new Error(`role_not_allowed_to_remove: ${actor.role} -> ${target}`);
  }
}

export function assertCanView(actor: ActorContext, target: Role): void {
  const rules = ROLE_RULES[actor.role];
  if (!rules.canView.includes(target)) {
    throw new Error(`role_not_allowed_to_view: ${actor.role} -> ${target}`);
  }
}
