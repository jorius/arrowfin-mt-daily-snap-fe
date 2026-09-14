import { money, signedMoney } from '@/lib/format';
import type { SnapshotDto } from '@/types/api';

function tone(n: number) {
  return n > 0 ? 'text-pos' : n < 0 ? 'text-neg' : 'text-fg';
}

export function PnlCards({ pnl }: { pnl: SnapshotDto['pnl'] }) {
  const tiles = [
    { label: 'Realized today', value: signedMoney(pnl.realizedToday), cls: tone(pnl.realizedToday), hint: 'net of commissions' },
    { label: 'Unrealized', value: signedMoney(pnl.unrealized), cls: tone(pnl.unrealized), hint: 'open positions at mark' },
    { label: 'Commissions today', value: money(pnl.commissionsToday), cls: 'text-fg', hint: 'per contract, per side' },
    { label: 'Day total', value: signedMoney(pnl.dayTotal), cls: tone(pnl.dayTotal), hint: 'realized + unrealized' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-line bg-card p-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{t.label}</div>
          <div className={`mt-1 font-mono text-lg font-semibold tabular-nums ${t.cls}`}>{t.value}</div>
          <div className="text-[10px] text-faint">{t.hint}</div>
        </div>
      ))}
    </div>
  );
}
