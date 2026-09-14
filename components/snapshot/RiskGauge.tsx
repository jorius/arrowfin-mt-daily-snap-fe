'use client';

import { useFormat, useT } from '@/lib/i18n';
import type { RiskLevel, SnapshotDto } from '@/types/api';

const TONE: Record<RiskLevel, { bar: string; text: string; pill: string }> = {
  LOW: { bar: 'bg-pos', text: 'text-pos', pill: 'border-pos/40 bg-pos-soft text-pos' },
  ELEVATED: { bar: 'bg-warn', text: 'text-warn', pill: 'border-warn/40 bg-warn-soft text-warn' },
  HIGH: { bar: 'bg-danger', text: 'text-danger', pill: 'border-danger/40 bg-danger-soft text-danger' },
};

export function RiskGauge({ risk }: { risk: SnapshotDto['risk'] }) {
  const t = useT();
  const { money, pct } = useFormat();
  const tone = TONE[risk.level];
  const high = risk.level === 'HIGH';
  return (
    <section
      aria-label={t('risk.label')}
      className={`rounded-xl border bg-card p-4 ${high ? 'animate-pulse border-danger ring-2 ring-danger/60' : 'border-line'}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{t('risk.title')}</h2>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.pill}`}>{t(`risk.level.${risk.level}`)}</span>
      </div>
      <div className={`mt-2 font-mono text-4xl font-semibold tabular-nums ${tone.text}`}>{pct(risk.score)}</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-card-2" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={risk.score} aria-label={t('risk.title')}>
        <div className={`h-full ${tone.bar}`} style={{ width: `${Math.min(100, Math.max(0, risk.score))}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-faint">
        <span>0</span><span>50</span><span>75</span><span>100</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div><dt className="text-muted">{t('risk.notional')}</dt><dd className="font-mono tabular-nums text-fg">{money(risk.notional)}</dd></div>
        <div><dt className="text-muted">{t('risk.balance')}</dt><dd className="font-mono tabular-nums text-fg">{money(risk.balance)}</dd></div>
      </dl>
      {high ? (
        <p aria-live="assertive" className="mt-3 text-xs font-semibold text-danger">
          {t('risk.highNote', { pct: pct(risk.score) })}
        </p>
      ) : null}
    </section>
  );
}
