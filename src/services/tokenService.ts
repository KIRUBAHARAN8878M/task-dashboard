const KEY_USER = 'auth_user';
const KEY_ACCESS = 'auth_access'; // { t, exp }

export interface StoredAccess { t: string; exp: number; }

export const tokenService = {
  read() {
    const u = localStorage.getItem(KEY_USER);
    const a = localStorage.getItem(KEY_ACCESS);
    return {
      user: u ? JSON.parse(u) : null,
      access: a ? (JSON.parse(a) as StoredAccess) : null,
    };
  },
  write(user: unknown, access: StoredAccess) {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    localStorage.setItem(KEY_ACCESS, JSON.stringify(access));
  },
  clear() {
    localStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_ACCESS);
  },
};
