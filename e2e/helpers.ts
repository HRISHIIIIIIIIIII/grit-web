const API = process.env.E2E_API_URL ?? 'http://localhost:8010';

export interface TestUser {
  email: string;
  password: string;
  token: string;
}

export async function apiRegisterAndLogin(name: string): Promise<TestUser> {
  const email = `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
  const password = 'supersecret123';
  await fetch(`${API}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name: name }),
  });
  const res = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const { access_token } = await res.json();
  return { email, password, token: access_token };
}

export async function apiPost(token: string, path: string, body: unknown): Promise<any> {
  const res = await fetch(`${API}/api/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return res.json();
}
