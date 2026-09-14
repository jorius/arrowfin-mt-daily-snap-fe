'use client';

import { useFormat, useT } from '@/lib/i18n';
import type { SnapshotDto } from '@/types/api';

function tone(n: number) {
  return n > 0 ? 'text-pos' : n < 0 ? 'text-neg' : 'text-fg';
}

export function PnlCards({ pnl }: { pnl: SnapshotDto['pnl'] }) {
  const t = useT();
  const { money, signedMoney } = useFormat();
  const tiles = [
    { label: t('pnl.realized'), value: signedMoney(pnl.realizedToday), cls: tone(pnl.realizedToday), hint: t('pnl.realized.hint') },
    { label: t('pnl.unrealized'), value: signedMoney(pnl.unrealized), cls: tone(pnl.unrealized), hint: t('pnl.unrealized.hint') },
    { label: t('pnl.commissions'), value: money(pnl.commissionsToday), cls: 'text-fg', hint: t('pnl.commissions.hint') },
    { label: t('pnl.dayTotal'), value: signedMoney(pnl.dayTotal), cls: tone(pnl.dayTotal), hint: t('pnl.dayTotal.hint') },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl border border-line bg-card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{tile.label}</div>
          <div className={`mt-1 font-mono text-lg font-semibold tabular-nums ${tile.cls}`}>{tile.value}</div>
          <div className="text-[10px] text-faint">{tile.hint}</div>
        </div>
      ))}
    </div>
  );
}
