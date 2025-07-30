import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/reduxHooks';
import { signedIn, signedOut } from './authSlice';
import { tokenService } from '../../services/tokenService';
import { authService, type LoginDto, type RegisterDto } from './authService';

export function useAuth() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s.auth);

  const login = useCallback(async (dto: LoginDto) => {
    const res = await authService.login(dto);
    tokenService.write(res.user, { t: res.accessToken, exp: res.expiresAt });
    dispatch(signedIn(res));
    return res.user;
  }, [dispatch]);

  const register = useCallback(async (dto: RegisterDto) => {
    const res = await authService.register(dto);
    tokenService.write(res.user, { t: res.accessToken, exp: res.expiresAt });
    dispatch(signedIn(res));
    return res.user;
  }, [dispatch]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    tokenService.clear();
    dispatch(signedOut());
  }, [dispatch]);

  return { ...state, login, register, logout };
}
