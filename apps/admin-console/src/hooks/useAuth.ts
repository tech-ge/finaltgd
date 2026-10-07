import { useState } from 'react';

export interface AuthState {
  accountId: number | null;
  role: 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' | null;
  token: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    accountId: null,
    role: null,
    token: null,
  });

  const login = (next: AuthState): void => setState(next);
  const logout = (): void => setState({ accountId: null, role: null, token: null });

  return { state, login, logout };
}
