import { getSession } from './auth';
import { API_URL } from './env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiInit = RequestInit & { auth?: boolean };

/**
 * fetch wrapper: JSON in/out, Bearer API key unless `auth: false`,
 * throws ApiError for non-2xx and network failures (status 0).
 */
export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { auth = true, headers, ...rest } = init;
  const h = new Headers(headers);
  if (rest.body && !h.has('content-type')) h.set('content-type', 'application/json');
  if (auth) {
    const session = getSession();
    if (!session) throw new ApiError(401, 'Not signed in');
    h.set('authorization', `Bearer ${session.apiKey}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...rest, headers: h });
  } catch {
    throw new ApiError(0, 'Backend unreachable');
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    throw new ApiError(res.status, messageOf(body) ?? res.statusText ?? `HTTP ${res.status}`);
  }
  return body as T;
}

function messageOf(body: unknown): string | null {
  if (body && typeof body === 'object' && 'message' in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  return null;
}
