import { pct } from '@/lib/format';

export function HighRiskBanner({ score }: { score: number }) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/40"
    >
      <span className="relative flex h-3 w-3" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      HIGH RISK — exposure is {pct(score)} of account balance
    </div>
  );
}
