import { money, signedMoney } from '@/lib/format';
import type { SnapshotDto } from '@/types/api';

function tone(n: number) {
  return n > 0 ? 'text-emerald-300' : n < 0 ? 'text-rose-300' : 'text-zinc-200';
}

export function PnlCards({ pnl }: { pnl: SnapshotDto['pnl'] }) {
  const tiles = [
    { label: 'Realized today', value: signedMoney(pnl.realizedToday), cls: tone(pnl.realizedToday), hint: 'net of commissions' },
    { label: 'Unrealized', value: signedMoney(pnl.unrealized), cls: tone(pnl.unrealized), hint: 'open positions at mark' },
    { label: 'Commissions today', value: money(pnl.commissionsToday), cls: 'text-zinc-200', hint: 'per contract, per side' },
    { label: 'Day total', value: signedMoney(pnl.dayTotal), cls: tone(pnl.dayTotal), hint: 'realized + unrealized' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{t.label}</div>
          <div className={`mt-1 font-mono text-lg font-semibold tabular-nums ${t.cls}`}>{t.value}</div>
          <div className="text-[10px] text-zinc-600">{t.hint}</div>
        </div>
      ))}
    </div>
  );
}
