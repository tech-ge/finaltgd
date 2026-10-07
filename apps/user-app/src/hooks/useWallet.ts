import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CurrencyApi } from '../services/api/currency.api';
import { setBalance } from '../store/walletSlice';
import type { AppDispatch, RootState } from '../store';

export function useWallet(api: CurrencyApi) {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useSelector((state: RootState) => state.wallet);
  const auth = useSelector((state: RootState) => state.auth);

  const refresh = useCallback(async () => {
    if (!auth.accountId) {
      return;
    }
    const result = await api.balance(auth.accountId);
    dispatch(setBalance({ balance: result.balance, currency: result.currency }));
  }, [api, auth.accountId, dispatch]);

  return { wallet, refresh };
}
