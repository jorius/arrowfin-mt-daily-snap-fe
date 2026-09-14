import { useMemo, useSyncExternalStore } from 'react';
import { parseSession, readRawSession, subscribeSession } from '@/lib/auth';
import type { Session } from '@/types/api';

const serverSnapshot = () => null;

/** Session from sessionStorage, hydration-safe (null on the server and during hydration). */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribeSession, readRawSession, serverSnapshot);
  return useMemo(() => parseSession(raw), [raw]);
}
