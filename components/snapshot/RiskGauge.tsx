import { money, pct } from '@/lib/format';
import type { RiskLevel, SnapshotDto } from '@/types/api';

const TONE: Record<RiskLevel, { bar: string; text: string; pill: string }> = {
  LOW: { bar: 'bg-emerald-400', text: 'text-emerald-300', pill: 'border-emerald-800 bg-emerald-950 text-emerald-300' },
  ELEVATED: { bar: 'bg-amber-400', text: 'text-amber-300', pill: 'border-amber-800 bg-amber-950 text-amber-300' },
  HIGH: { bar: 'bg-rose-500', text: 'text-rose-300', pill: 'border-rose-700 bg-rose-950 text-rose-200' },
};

export function RiskGauge({ risk }: { risk: SnapshotDto['risk'] }) {
  const tone = TONE[risk.level];
  const high = risk.level === 'HIGH';
  return (
    <section
      aria-label="Risk indicator"
      className={`rounded-xl border bg-zinc-900 p-4 ${high ? 'animate-pulse border-rose-600 ring-2 ring-rose-500/60' : 'border-zinc-800'}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">Risk score</h2>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.pill}`}>{risk.level}</span>
      </div>
      <div className={`mt-2 font-mono text-4xl font-semibold tabular-nums ${tone.text}`}>{pct(risk.score)}</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={risk.score} aria-label="Risk score">
        <div className={`h-full ${tone.bar}`} style={{ width: `${Math.min(100, Math.max(0, risk.score))}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
        <span>0</span><span>50</span><span>75</span><span>100</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div><dt className="text-zinc-500">Notional</dt><dd className="font-mono tabular-nums text-zinc-200">{money(risk.notional)}</dd></div>
        <div><dt className="text-zinc-500">Balance</dt><dd className="font-mono tabular-nums text-zinc-200">{money(risk.balance)}</dd></div>
      </dl>
      {high ? (
        <p aria-live="assertive" className="mt-3 text-xs font-semibold text-rose-300">
          High risk: {pct(risk.score)} of the account balance is exposed.
        </p>
      ) : null}
    </section>
  );
}
