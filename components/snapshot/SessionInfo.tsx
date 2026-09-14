import { money, price, qty, utcDateTime, utcTime } from '@/lib/format';
import type { FillEvent, SnapshotDto } from '@/types/api';

export function SessionInfo({ data, lastEvent }: { data: SnapshotDto; lastEvent: FillEvent | null }) {
  const rows: Array<[string, string]> = [
    ['Session open', utcDateTime(data.session.open)],
    ['Session close', utcDateTime(data.session.close)],
    ['As of', utcDateTime(data.asOf)],
    ['Fills today', qty(data.fillsToday)],
    ['Last fill id', data.lastFillId ?? '—'],
    ['Balance', money(data.account.balance)],
  ];
  return (
    <section aria-label="Session" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">Session</h2>
      <dl className="mt-2 space-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-zinc-500">{k}</dt>
            <dd className="font-mono tabular-nums text-zinc-200">{v}</dd>
          </div>
        ))}
      </dl>
      {lastEvent ? (
        <div className="mt-3 border-t border-zinc-800 pt-3 text-xs">
          <div className="text-zinc-500">Last live fill</div>
          <div className="mt-0.5 font-mono text-zinc-200">
            {lastEvent.symbol} {lastEvent.side} {qty(lastEvent.quantity)} @ {price(lastEvent.price)}
            <span className="text-zinc-500"> · {lastEvent.accountId} · {utcTime(lastEvent.filledAt)}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
