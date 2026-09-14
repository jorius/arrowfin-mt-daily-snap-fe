import type { StreamStatus } from '@/hooks/useFillStream';
import { utcTime } from '@/lib/format';

const STYLE: Record<StreamStatus, { text: string; dot: string; cls: string }> = {
  connecting: { text: 'Connecting', dot: 'bg-muted', cls: 'border-line text-muted' },
  live: { text: 'Live', dot: 'bg-pos animate-pulse', cls: 'border-pos/40 bg-pos-soft text-pos' },
  reconnecting: { text: 'Reconnecting', dot: 'bg-warn animate-pulse', cls: 'border-warn/40 bg-warn-soft text-warn' },
  stale: { text: 'Disconnected — figures may be stale', dot: 'bg-danger', cls: 'border-danger/40 bg-danger-soft text-danger' },
  unauthorized: { text: 'Session expired', dot: 'bg-danger', cls: 'border-danger/40 bg-danger-soft text-danger' },
};

export function ConnectionBadge({ status, lastEventAt }: { status: StreamStatus; lastEventAt: string | null }) {
  const s = STYLE[status];
  return (
    <div className="flex items-center gap-3 text-xs">
      {lastEventAt && status === 'live' ? (
        <span className="hidden text-muted sm:inline">last fill {utcTime(lastEventAt)}</span>
      ) : null}
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-medium ${s.cls}`}
      >
        <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
        {s.text}
      </span>
    </div>
  );
}
