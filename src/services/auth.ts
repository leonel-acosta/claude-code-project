import type { User } from '../types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin;

const AUTH_STORAGE_KEY = 'weather_app_auth';

export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  token: string;
  user: User;
}> {
  // In a real app, this exchange should happen on your backend
  // to protect the client secret. This is a simplified example.
  // You would call your backend API here which would:
  // 1. Exchange the code for tokens with Google
  // 2. Verify the ID token
  // 3. Return user info and your own session token

  // For demo purposes, we'll simulate this:
  console.warn(
    'OAuth token exchange should be done server-side. This is a demo implementation.'
  );

  // Simulated response - replace with actual backend call
  return {
    token: `demo_token_${code.substring(0, 10)}`,
    user: {
      id: 'demo_user_id',
      email: 'demo@example.com',
      name: 'Demo User',
    },
  };
}

export function saveAuthToStorage(token: string, user: User): void {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ token, user })
  );
}

export function getAuthFromStorage(): { token: string; user: User } | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
