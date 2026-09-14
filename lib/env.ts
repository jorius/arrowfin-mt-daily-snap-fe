// NEXT_PUBLIC_* values are inlined at build time; keep the literal property access.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? API_URL;
