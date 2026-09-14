// NEXT_PUBLIC_* values are inlined at build time; keep the literal property access.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? API_URL;

function msOr(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return raw !== undefined && raw !== '' && Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Socket.IO client reconnection back-off, first attempt (ms). */
export const WS_RECONNECT_DELAY_MS = msOr(process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY_MS, 1000);
/** Socket.IO client reconnection back-off cap (ms). */
export const WS_RECONNECT_DELAY_MAX_MS = msOr(process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY_MAX_MS, 5000);
/** Time without a connection after which the figures on screen are declared stale (ms). */
export const WS_STALE_AFTER_MS = msOr(process.env.NEXT_PUBLIC_WS_STALE_AFTER_MS, 5000);
