'use client';

import { useEffect } from 'react';
import { useFillStream } from '@/hooks/useFillStream';
import { useSnapshot } from '@/hooks/useSnapshot';
import { ApiError } from '@/lib/api';
import { useFormat, useT } from '@/lib/i18n';
import type { MessageKey } from '@/lib/i18n/en';
import { ConnectionBadge } from './ConnectionBadge';
import { ConnectionPanel } from './ConnectionPanel';
import { HighRiskBanner } from './HighRiskBanner';
import { PnlCards } from './PnlCards';
import { PositionsTable } from './PositionsTable';
import { RiskGauge } from './RiskGauge';
import { SessionInfo } from './SessionInfo';
import { EmptyState, ErrorState, SnapshotSkeleton } from './States';

const STATUS_KEYS: Record<string, MessageKey> = {
  active: 'account.status.active',
  restricted: 'account.status.restricted',
  closed: 'account.status.closed',
};

export function SnapshotWidget({
  accountId,
  apiKey,
  onUnauthorized,
}: {
  accountId: string;
  apiKey: string;
  onUnauthorized: () => void;
}) {
  const t = useT();
  const { utcTime } = useFormat();
  const snapshot = useSnapshot(accountId);
  const stream = useFillStream(apiKey, accountId);

  const unauthorized =
    stream.status === 'unauthorized' ||
    (snapshot.error instanceof ApiError && snapshot.error.status === 401);
  useEffect(() => {
    if (unauthorized) onUnauthorized();
  }, [unauthorized, onUnauthorized]);

  if (snapshot.isPending) return <SnapshotSkeleton />;
  if (snapshot.isError) {
    return (
      <ErrorState
        message={snapshot.error instanceof Error ? snapshot.error.message : t('state.unknownError')}
        onRetry={() => void snapshot.refetch()}
      />
    );
  }

  const data = snapshot.data;
  const high = data.risk.score > 75;
  const stale = stream.status === 'stale' || stream.status === 'unauthorized';
  const statusKey = STATUS_KEYS[data.account.status];

  return (
    // One padded card. In the high-risk state the same card carries the ring, so
    // the banner and every inner card keep their distance from the edge.
    <section
      aria-label={t('snapshot.label')}
      className={`rounded-2xl border bg-section p-4 md:p-6 ${high ? 'border-danger ring-2 ring-danger' : 'border-line'}`}
    >
      {high ? <HighRiskBanner score={data.risk.score} /> : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-mono text-sm font-semibold text-fg">
            {data.account.accountNumber}
            <span className="ml-2 text-xs font-normal text-muted">
              {data.account.accountType} · {statusKey ? t(statusKey) : data.account.status}
            </span>
          </h1>
          <div className="text-[11px] text-muted">
            {t('snapshot.asOf', { time: utcTime(data.asOf) })}
            {snapshot.isFetching ? <span className="ml-2 text-accent-2">↻ {t('snapshot.updating')}</span> : null}
          </div>
        </div>
        <ConnectionBadge status={stream.status} lastEventAt={stream.lastEventAt} />
      </div>

      {/* min-w-0 on the columns: a grid item defaults to min-width:auto, and the table's
          own minimum width would otherwise widen the column past the viewport on phones. */}
      <div className={`grid min-w-0 gap-4 lg:grid-cols-[2fr_1fr] ${stale ? 'opacity-60' : ''}`}>
        <div className="min-w-0 space-y-4">
          <PnlCards pnl={data.pnl} />
          {data.positions.length === 0 ? (
            <EmptyState title={t('positions.empty.title')} hint={t('positions.empty.hint')} />
          ) : (
            <PositionsTable positions={data.positions} />
          )}
        </div>
        <div className="min-w-0 space-y-4">
          <RiskGauge risk={data.risk} />
          <SessionInfo data={data} lastEvent={stream.lastEvent} />
          <ConnectionPanel
            status={stream.status}
            transport={stream.transport}
            hello={stream.hello}
            lastEventAt={stream.lastEventAt}
          />
        </div>
      </div>
    </section>
  );
}
