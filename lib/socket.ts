import { io, type Socket } from 'socket.io-client';
import { WS_URL } from './env';

/**
 * One socket per API key. The key travels in the handshake and is verified by
 * the server once, at connection time; there is no subscribe message.
 */
export function createSocket(apiKey: string): Socket {
  return io(WS_URL, {
    auth: { apiKey },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 5000,
  });
}
