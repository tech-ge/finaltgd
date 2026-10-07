export interface AdminState {
  accountId: number | null;
  role: 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' | null;
  orgId: number | null;
}

export const initialAdminState: AdminState = {
  accountId: null,
  role: null,
  orgId: null,
};
