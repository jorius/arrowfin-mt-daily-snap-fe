import { money, price, qty, signedMoney } from '@/lib/format';
import type { PositionDto } from '@/types/api';

export function PositionsTable({ positions }: { positions: PositionDto[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-zinc-900 text-[11px] uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-3 py-2 font-medium">Symbol</th>
            <th className="px-3 py-2 font-medium">Side</th>
            <th className="px-3 py-2 text-right font-medium">Qty</th>
            <th className="px-3 py-2 text-right font-medium">Avg price</th>
            <th className="px-3 py-2 text-right font-medium">Mark</th>
            <th className="px-3 py-2 text-right font-medium">Notional</th>
            <th className="px-3 py-2 text-right font-medium">Unrealized</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {positions.map((p) => {
            const short = p.side === 'SHORT';
            return (
              <tr key={p.symbol} className={short ? 'bg-rose-950/20' : ''}>
                <td className="px-3 py-2">
                  <div className="font-mono font-semibold text-zinc-100">{p.symbol}</div>
                  <div className="text-[10px] text-zinc-500">{p.description} · ${p.pointValue}/pt</div>
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${short ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>{p.side}</span>
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-zinc-100">{qty(Math.abs(p.netQty))}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-zinc-300">{price(p.avgPrice)}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-zinc-300">{price(p.markPrice)}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-zinc-300">{money(p.notional)}</td>
                <td className={`px-3 py-2 text-right font-mono font-semibold tabular-nums ${p.unrealizedPnl > 0 ? 'text-emerald-300' : p.unrealizedPnl < 0 ? 'text-rose-300' : 'text-zinc-200'}`}>{signedMoney(p.unrealizedPnl)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
