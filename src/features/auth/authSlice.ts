import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Role = 'ADMIN' | 'MANAGER' | 'USER';
export interface User { id: string; email: string; name: string; role: Role; }

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrated(state, action: PayloadAction<AuthState>) {
      return action.payload;
    },
    signedIn(state, action: PayloadAction<{ user: User; accessToken: string; expiresAt: number }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
    },
    refreshed(state, action: PayloadAction<{ accessToken: string; expiresAt: number }>) {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
    },
    signedOut(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.expiresAt = null;
    },
  },
});

export const { hydrated, signedIn, refreshed, signedOut } = authSlice.actions;
export default authSlice.reducer;
