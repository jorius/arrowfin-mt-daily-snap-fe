import { io, type Socket } from 'socket.io-client';
import { WS_RECONNECT_DELAY_MAX_MS, WS_RECONNECT_DELAY_MS, WS_URL } from './env';

/** Client-side socket settings, exposed so the UI can show what it is running with. */
export const SOCKET_CLIENT_CONFIG = {
  transports: ['websocket'] as const,
  reconnectionDelayMs: WS_RECONNECT_DELAY_MS,
  reconnectionDelayMaxMs: WS_RECONNECT_DELAY_MAX_MS,
};

/**
 * One socket per API key. The key travels in the handshake and is verified by
 * the server once, at connection time; there is no subscribe message.
 */
export function createSocket(apiKey: string): Socket {
  return io(WS_URL, {
    auth: { apiKey },
    transports: [...SOCKET_CLIENT_CONFIG.transports],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: SOCKET_CLIENT_CONFIG.reconnectionDelayMs,
    reconnectionDelayMax: SOCKET_CLIENT_CONFIG.reconnectionDelayMaxMs,
  });
}
