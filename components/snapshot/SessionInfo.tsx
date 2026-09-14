'use client';

import { useFormat, useT } from '@/lib/i18n';
import type { FillEvent, SnapshotDto } from '@/types/api';

export function SessionInfo({ data, lastEvent }: { data: SnapshotDto; lastEvent: FillEvent | null }) {
  const t = useT();
  const { money, price, qty, utcDateTime, utcTime } = useFormat();
  const rows: Array<[string, string]> = [
    [t('session.open'), utcDateTime(data.session.open)],
    [t('session.close'), utcDateTime(data.session.close)],
    [t('session.asOf'), utcDateTime(data.asOf)],
    [t('session.fillsToday'), qty(data.fillsToday)],
    [t('session.lastFillId'), data.lastFillId ?? '—'],
    [t('session.balance'), money(data.account.balance)],
  ];
  return (
    <section aria-label={t('session.title')} className="rounded-xl border border-line bg-card p-4">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{t('session.title')}</h2>
      <dl className="mt-2 space-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-muted">{k}</dt>
            <dd className="font-mono tabular-nums text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      {lastEvent ? (
        <div className="mt-3 border-t border-line pt-3 text-xs">
          <div className="text-muted">{t('session.lastLiveFill')}</div>
          <div className="mt-0.5 font-mono text-fg">
            {lastEvent.symbol} {lastEvent.side} {qty(lastEvent.quantity)} @ {price(lastEvent.price)}
            <span className="text-muted"> · {lastEvent.accountId} · {utcTime(lastEvent.filledAt)}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
