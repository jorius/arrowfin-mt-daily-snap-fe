import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { createSocket } from '@/lib/socket';
import type { FillEvent } from '@/types/api';

export type StreamStatus =
  | 'connecting'
  | 'live'
  | 'reconnecting'
  | 'stale'
  | 'unauthorized';

export interface FillStream {
  status: StreamStatus;
  lastEvent: FillEvent | null;
  lastEventAt: string | null;
}

/** After this long without a connection the figures on screen are declared stale. */
const STALE_AFTER_MS = 5_000;

/**
 * One socket per API key for the lifetime of the page. Fill events for the
 * selected account invalidate the snapshot query: the server stays the source
 * of truth, the client never does P&L math. A reconnect refetches every
 * snapshot query because fills may have been missed while away.
 */
export function useFillStream(apiKey: string | null, accountId: string | null): FillStream {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [lastEvent, setLastEvent] = useState<FillEvent | null>(null);
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);
  const accountRef = useRef<string | null>(accountId);

  useEffect(() => {
    accountRef.current = accountId;
  }, [accountId]);

  useEffect(() => {
    if (!apiKey) return;
    const socket = createSocket(apiKey);
    let sawDisconnect = false;
    let staleTimer: ReturnType<typeof setTimeout> | null = null;
    const clearStale = () => {
      if (staleTimer) {
        clearTimeout(staleTimer);
        staleTimer = null;
      }
    };
    const armStale = () => {
      if (!staleTimer) staleTimer = setTimeout(() => setStatus('stale'), STALE_AFTER_MS);
    };

    socket.on('connect', () => {
      clearStale();
      setStatus('live');
      if (sawDisconnect) {
        void queryClient.invalidateQueries({ queryKey: ['snapshot'] });
      }
    });

    socket.on('disconnect', () => {
      sawDisconnect = true;
      setStatus('reconnecting');
      armStale();
    });

    socket.on('connect_error', (err: Error) => {
      if (err.message === 'unauthorized') {
        setStatus('unauthorized');
        socket.disconnect();
        return;
      }
      setStatus((prev) => (prev === 'live' ? 'reconnecting' : prev));
      armStale();
    });

    socket.on('fill', (event: FillEvent) => {
      setLastEvent(event);
      setLastEventAt(new Date().toISOString());
      if (event.accountId === accountRef.current) {
        void queryClient.invalidateQueries({ queryKey: ['snapshot', event.accountId] });
      }
    });

    return () => {
      clearStale();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [apiKey, queryClient]);

  return { status: apiKey ? status : 'unauthorized', lastEvent, lastEventAt };
}
