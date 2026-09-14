import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** false during SSR and hydration, true once the client has taken over. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
