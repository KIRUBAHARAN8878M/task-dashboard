import type { AppDispatch } from './store';
import { hydrated } from '../features/auth/authSlice';

export function bootstrapAuth(dispatch: AppDispatch) {
  const user = localStorage.getItem('auth_user');
  const access = localStorage.getItem('auth_access'); // {t, exp}
  const parsedUser = user ? JSON.parse(user) : null;
  const parsedAccess = access ? JSON.parse(access) : null;
  dispatch(hydrated({
    isAuthenticated: !!(parsedUser && parsedAccess?.t),
    user: parsedUser,
    accessToken: parsedAccess?.t ?? null,
    expiresAt: parsedAccess?.exp ?? null,
  }));
}
