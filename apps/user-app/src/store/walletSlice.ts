import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WalletState {
  balance: string;
  currency: string;
  lastUpdated: number | null;
}

const initialState: WalletState = {
  balance: '0',
  currency: 'TGD',
  lastUpdated: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<{ balance: string; currency: string }>) {
      state.balance = action.payload.balance;
      state.currency = action.payload.currency;
      state.lastUpdated = Date.now();
    },
  },
});

export const { setBalance } = walletSlice.actions;
export default walletSlice.reducer;
