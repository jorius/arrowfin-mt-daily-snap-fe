'use client';

import { useFormat, useT } from '@/lib/i18n';

export function HighRiskBanner({ score }: { score: number }) {
  const t = useT();
  const { pct } = useFormat();
  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-lg bg-danger px-4 py-3 text-sm font-semibold text-danger-fg shadow-lg shadow-danger/30"
    >
      <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-fg opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-danger-fg" />
      </span>
      {t('risk.banner', { pct: pct(score) })}
    </div>
  );
}
