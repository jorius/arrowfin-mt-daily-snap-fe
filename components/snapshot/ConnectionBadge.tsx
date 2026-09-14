import type { StreamStatus } from '@/hooks/useFillStream';
import { utcTime } from '@/lib/format';

const STYLE: Record<StreamStatus, { text: string; dot: string; cls: string }> = {
  connecting: { text: 'Connecting', dot: 'bg-zinc-400', cls: 'border-zinc-700 text-zinc-400' },
  live: { text: 'Live', dot: 'bg-emerald-400 animate-pulse', cls: 'border-emerald-800 text-emerald-300' },
  reconnecting: { text: 'Reconnecting', dot: 'bg-amber-400 animate-pulse', cls: 'border-amber-800 text-amber-300' },
  stale: { text: 'Disconnected — figures may be stale', dot: 'bg-rose-500', cls: 'border-rose-800 text-rose-300' },
  unauthorized: { text: 'Session expired', dot: 'bg-rose-500', cls: 'border-rose-800 text-rose-300' },
};

export function ConnectionBadge({ status, lastEventAt }: { status: StreamStatus; lastEventAt: string | null }) {
  const s = STYLE[status];
  return (
    <div className="flex items-center gap-3 text-xs">
      {lastEventAt && status === 'live' ? (
        <span className="hidden text-zinc-500 sm:inline">last fill {utcTime(lastEventAt)}</span>
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
