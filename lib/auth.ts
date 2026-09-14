import type { Session } from '@/types/api';

/**
 * The API key lives in sessionStorage: tab-scoped and gone when the tab closes.
 * See SECURITY.md for the XSS trade-off. Expiry is enforced by the server
 * (a 401 clears the session); the client never compares `expiresAt` with its
 * own clock because the backend runs on a replay clock.
 */
const STORAGE_KEY = 'arrowfin.session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<Session>;
    if (!session.apiKey || !session.principal?.traderId) return null;
    return session as Session;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage can be unavailable (private mode); the user simply has to log in again.
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
