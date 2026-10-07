import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadSecure, SECURE_KEYS, saveSecure, deleteSecure } from '../services/storage/secureStore';
import { clearSession, setSession } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

export interface LoginInput {
  accountId: number;
  role: string;
  token: string;
  deviceFingerprint: string;
}

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (input: LoginInput) => {
      dispatch(setSession(input));
      await saveSecure(SECURE_KEYS.SESSION_TOKEN, input.token);
      await saveSecure(SECURE_KEYS.ACCOUNT_ID, String(input.accountId));
      await saveSecure(SECURE_KEYS.DEVICE_FINGERPRINT, input.deviceFingerprint);
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    dispatch(clearSession());
    await deleteSecure(SECURE_KEYS.SESSION_TOKEN);
    await deleteSecure(SECURE_KEYS.ACCOUNT_ID);
    await deleteSecure(SECURE_KEYS.DEVICE_FINGERPRINT);
  }, [dispatch]);

  const restore = useCallback(async () => {
    const token = await loadSecure(SECURE_KEYS.SESSION_TOKEN);
    const accountId = await loadSecure(SECURE_KEYS.ACCOUNT_ID);
    const fingerprint = await loadSecure(SECURE_KEYS.DEVICE_FINGERPRINT);

    if (token && accountId && fingerprint) {
      dispatch(
        setSession({
          accountId: Number.parseInt(accountId, 10),
          role: null,
          token,
          deviceFingerprint: fingerprint,
        }),
      );
    }
  }, [dispatch]);

  return { auth, login, logout, restore };
}
