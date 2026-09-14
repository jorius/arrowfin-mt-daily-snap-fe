'use client';

import type { StreamStatus } from '@/hooks/useFillStream';
import { WS_STALE_AFTER_MS } from '@/lib/env';
import { useFormat, useT } from '@/lib/i18n';
import type { MessageKey } from '@/lib/i18n/en';
import { SOCKET_CLIENT_CONFIG } from '@/lib/socket';
import type { ServerHello } from '@/types/api';

const STATUS_KEY: Record<StreamStatus, MessageKey> = {
  connecting: 'conn.connecting',
  live: 'conn.live',
  reconnecting: 'conn.reconnecting',
  stale: 'conn.stale',
  unauthorized: 'conn.unauthorized',
};

/**
 * Shows the socket settings the demo is running with: what the server announced
 * in its `hello` event and what the client was built with. Tolerates a backend
 * that never sends `hello`.
 */
export function ConnectionPanel({
  status,
  transport,
  hello,
  lastEventAt,
}: {
  status: StreamStatus;
  transport: string | null;
  hello: ServerHello | null;
  lastEventAt: string | null;
}) {
  const t = useT();
  const { qty, utcDateTime, utcTime } = useFormat();
  const na = t('connection.na');
  const duration = (ms: number) => (ms >= 1000 ? `${qty(ms / 1000)} s` : `${qty(ms)} ms`);

  const rows: Array<[string, string, boolean?]> = [
    [t('connection.status'), t(STATUS_KEY[status]), status === 'live'],
    [t('connection.transport'), transport ?? hello?.transport ?? na],
    [
      t('connection.heartbeat'),
      hello
        ? t('connection.heartbeat.value', { interval: duration(hello.pingIntervalMs), timeout: duration(hello.pingTimeoutMs) })
        : t('connection.server.na'),
    ],
    [t('connection.connectTimeout'), hello ? duration(hello.connectTimeoutMs) : t('connection.server.na')],
    [
      t('connection.reconnectDelay'),
      `${duration(SOCKET_CLIENT_CONFIG.reconnectionDelayMs)} – ${duration(SOCKET_CLIENT_CONFIG.reconnectionDelayMaxMs)}`,
    ],
    [t('connection.staleAfter'), duration(WS_STALE_AFTER_MS)],
    [t('connection.rooms'), hello ? qty(hello.rooms) : t('connection.server.na')],
    [t('connection.serverTime'), hello ? utcDateTime(hello.serverTime) : t('connection.server.na')],
    [t('connection.lastEvent'), lastEventAt ? utcTime(lastEventAt) : na],
  ];

  return (
    <section aria-label={t('connection.title')} className="rounded-xl border border-line bg-card p-4">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{t('connection.title')}</h2>
      <dl className="mt-2 space-y-1.5 text-xs">
        {rows.map(([k, v, live]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-muted">{k}</dt>
            <dd className={`text-right font-mono tabular-nums ${live ? 'text-pos' : 'text-fg'}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
