'use client';

import type { StreamStatus } from '@/hooks/useFillStream';
import { useFormat, useT } from '@/lib/i18n';
import type { MessageKey } from '@/lib/i18n/en';

const STYLE: Record<StreamStatus, { key: MessageKey; dot: string; cls: string }> = {
  connecting: { key: 'conn.connecting', dot: 'bg-muted', cls: 'border-line text-muted' },
  live: { key: 'conn.live', dot: 'bg-pos animate-pulse', cls: 'border-pos/40 bg-pos-soft text-pos' },
  reconnecting: { key: 'conn.reconnecting', dot: 'bg-warn animate-pulse', cls: 'border-warn/40 bg-warn-soft text-warn' },
  stale: { key: 'conn.stale', dot: 'bg-danger', cls: 'border-danger/40 bg-danger-soft text-danger' },
  unauthorized: { key: 'conn.unauthorized', dot: 'bg-danger', cls: 'border-danger/40 bg-danger-soft text-danger' },
};

export function ConnectionBadge({ status, lastEventAt }: { status: StreamStatus; lastEventAt: string | null }) {
  const t = useT();
  const { utcTime } = useFormat();
  const s = STYLE[status];
  return (
    <div className="flex items-center gap-3 text-xs">
      {lastEventAt && status === 'live' ? (
        <span className="hidden text-muted sm:inline">{t('conn.lastFill', { time: utcTime(lastEventAt) })}</span>
      ) : null}
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1 font-medium ${s.cls}`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
        {t(s.key)}
      </span>
    </div>
  );
}
