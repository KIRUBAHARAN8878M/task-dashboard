import { http, HttpResponse } from 'msw';
import { v4 as uuid } from 'uuid';

type Role = 'ADMIN' | 'MANAGER' | 'USER';
interface User { id: string; email: string; name: string; role: Role; }
interface Token { t: string; exp: number; userId: string; }

const users = new Map<string, User>();
const passwords = new Map<string, string>(); // email -> password
const tokens = new Map<string, Token>();     // token -> metadata

// seed admin
(() => {
  const id = uuid();
  const u: User = { id, email: 'admin@example.com', name: 'Admin', role: 'ADMIN' };
  users.set(u.email, u);
  passwords.set(u.email, 'admin123');
})();

function rand() {
  const a = new Uint32Array(4);
  crypto.getRandomValues(a);
  return Array.from(a).map(n => n.toString(16)).join('');
}
function makeToken(userId: string) {
  const t = rand();
  const exp = Date.now() + 1000 * 60 * 10; // 10 min
  const tok: Token = { t, exp, userId };
  tokens.set(t, tok);
  return tok;
}
function fromAuth(header?: string | null) {
  if (!header) return null;
  const m = header.match(/^Bearer\s+(.+)$/);
  if (!m) return null;
  const tok = tokens.get(m[1]);
  if (!tok || tok.exp < Date.now()) return null;
  return tok;
}

export const handlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string; role?: Role };
    if (!body.email || !body.password || !body.name)
      return HttpResponse.json({ message: 'Missing fields' }, { status: 400 });
    if (users.has(body.email))
      return HttpResponse.json({ message: 'Email already used' }, { status: 409 });

    const id = uuid();
    const user: User = { id, email: body.email, name: body.name, role: body.role ?? 'USER' };
    users.set(user.email, user);
    passwords.set(user.email, body.password);
    const tok = makeToken(user.id);
    return HttpResponse.json({ user, accessToken: tok.t, expiresAt: tok.exp });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    const u = users.get(email);
    if (!u || passwords.get(email) !== password)
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    const tok = makeToken(u.id);
    return HttpResponse.json({ user: u, accessToken: tok.t, expiresAt: tok.exp });
  }),

  http.post('/api/auth/refresh', async ({ request: { headers } }) => {
    const tok = fromAuth(headers.get('authorization'));
    if (!tok) return HttpResponse.json({ message: 'unauthorized' }, { status: 401 });
    const newTok = makeToken(tok.userId);
    const u = Array.from(users.values()).find(x => x.id === tok.userId)!;
    return HttpResponse.json({ user: u, accessToken: newTok.t, expiresAt: newTok.exp });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    const tok = fromAuth(request.headers.get('authorization'));
    if (!tok) return HttpResponse.json({ message: 'unauthorized' }, { status: 401 });
    const u = Array.from(users.values()).find(x => x.id === tok.userId)!;
    return HttpResponse.json(u);
  }),

  http.delete('/api/auth/logout', async ({ request }) => {
    const tok = fromAuth(request.headers.get('authorization'));
    if (tok) tokens.delete(tok.t);
    return HttpResponse.json({ ok: true });
  }),
];
