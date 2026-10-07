import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  accountId: number | null;
  role: string | null;
  token: string | null;
  deviceFingerprint: string | null;
}

const initialState: AuthState = {
  accountId: null,
  role: null,
  token: null,
  deviceFingerprint: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthState>) {
      state.accountId = action.payload.accountId;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.deviceFingerprint = action.payload.deviceFingerprint;
    },
    clearSession(state) {
      state.accountId = null;
      state.role = null;
      state.token = null;
      state.deviceFingerprint = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
