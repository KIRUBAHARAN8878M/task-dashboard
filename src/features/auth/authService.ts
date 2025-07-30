import { postJSON, getJSON, del } from '../../services/client';
import type { User } from './authSlice';

export interface LoginDto { email: string; password: string; }
export interface RegisterDto { name: string; email: string; password: string; role?: 'ADMIN'|'MANAGER'|'USER'; }
export interface AuthResponse { user: User; accessToken: string; expiresAt: number; }

export const authService = {
  login(data: LoginDto) {
    return postJSON<AuthResponse>('/auth/login', data);
  },
  register(data: RegisterDto) {
    return postJSON<AuthResponse>('/auth/register', data);
  },
  me() {
    return getJSON<User>('/auth/me');
  },
  logout() {
    return del('/auth/logout');
  },
};
