'use client';

import { useFormat, useT } from '@/lib/i18n';
import type { PositionDto } from '@/types/api';

export function PositionsTable({ positions }: { positions: PositionDto[] }) {
  const t = useT();
  const { money, price, qty, signedMoney } = useFormat();
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-card">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-card-2 text-[11px] uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">{t('table.symbol')}</th>
            <th className="px-3 py-2 font-medium">{t('table.side')}</th>
            <th className="px-3 py-2 text-right font-medium">{t('table.qty')}</th>
            <th className="px-3 py-2 text-right font-medium">{t('table.avgPrice')}</th>
            <th className="px-3 py-2 text-right font-medium">{t('table.mark')}</th>
            <th className="px-3 py-2 text-right font-medium">{t('table.notional')}</th>
            <th className="px-3 py-2 text-right font-medium">{t('table.unrealized')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {positions.map((p) => {
            const short = p.side === 'SHORT';
            return (
              <tr key={p.symbol} className={short ? 'bg-danger-soft' : ''}>
                <td className="px-3 py-2">
                  <div className="font-mono font-semibold text-fg">{p.symbol}</div>
                  <div className="text-[10px] text-muted">
                    {p.description} · {t('table.perPoint', { value: money(p.pointValue) })}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${short ? 'bg-danger-soft text-danger' : 'bg-pos-soft text-pos'}`}>{p.side}</span>
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-fg">{qty(Math.abs(p.netQty))}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-fg/80">{price(p.avgPrice)}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-fg/80">{price(p.markPrice)}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-fg/80">{money(p.notional)}</td>
                <td className={`px-3 py-2 text-right font-mono font-semibold tabular-nums ${p.unrealizedPnl > 0 ? 'text-pos' : p.unrealizedPnl < 0 ? 'text-neg' : 'text-fg'}`}>{signedMoney(p.unrealizedPnl)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
