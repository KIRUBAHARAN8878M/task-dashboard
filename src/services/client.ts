import { tokenService } from './tokenService';

async function raw(path: string, init?: RequestInit) {
  const url = `/api${path.startsWith('/') ? '' : '/'}${path}`;
  return fetch(url, init);
}

async function withAuth(path: string, init: RequestInit = {}) {
  const { access } = tokenService.read();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (access?.t) headers.set('Authorization', `Bearer ${access.t}`);
  return fetch(`/api${path.startsWith('/') ? '' : '/'}${path}`, { ...init, headers });
}

async function refreshToken() {
  const res = await raw('/auth/refresh', { method: 'POST' });
  if (!res.ok) throw new Error('refresh_failed');
  return res.json();
}

export async function api(path: string, init: RequestInit = {}) {
  let res = await withAuth(path, init);
  if (res.status !== 401) return res;

  try {
    const ref = await refreshToken();
    tokenService.write(ref.user, { t: ref.accessToken, exp: ref.expiresAt });
  } catch {
    return res; // propagate original 401 if refresh fails
  }
  return withAuth(path, init);
}

export async function getJSON<T>(path: string) {
  const res = await api(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
export async function postJSON<T>(path: string, body: unknown) {
  const res = await api(path, { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
export async function del(path: string) {
  const res = await api(path, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}
