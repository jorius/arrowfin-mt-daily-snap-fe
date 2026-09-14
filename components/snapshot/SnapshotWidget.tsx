'use client';

import { useEffect } from 'react';
import { useFillStream } from '@/hooks/useFillStream';
import { useSnapshot } from '@/hooks/useSnapshot';
import { ApiError } from '@/lib/api';
import { utcTime } from '@/lib/format';
import { ConnectionBadge } from './ConnectionBadge';
import { HighRiskBanner } from './HighRiskBanner';
import { PnlCards } from './PnlCards';
import { PositionsTable } from './PositionsTable';
import { RiskGauge } from './RiskGauge';
import { SessionInfo } from './SessionInfo';
import { EmptyState, ErrorState, SnapshotSkeleton } from './States';

export function SnapshotWidget({
  accountId,
  apiKey,
  onUnauthorized,
}: {
  accountId: string;
  apiKey: string;
  onUnauthorized: () => void;
}) {
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
        message={snapshot.error instanceof Error ? snapshot.error.message : 'Unknown error'}
        onRetry={() => void snapshot.refetch()}
      />
    );
  }

  const data = snapshot.data;
  const high = data.risk.score > 75;
  const stale = stream.status === 'stale' || stream.status === 'unauthorized';

  return (
    <section aria-label="Daily snapshot" className={high ? 'rounded-2xl ring-1 ring-danger/60' : ''}>
      {high ? <HighRiskBanner score={data.risk.score} /> : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-mono text-sm font-semibold text-fg">
            {data.account.accountNumber}
            <span className="ml-2 text-xs font-normal text-muted">
              {data.account.accountType} · {data.account.status}
            </span>
          </h1>
          <div className="text-[11px] text-muted">
            Snapshot as of {utcTime(data.asOf)}
            {snapshot.isFetching ? <span className="ml-2 text-accent-2">↻ updating</span> : null}
          </div>
        </div>
        <ConnectionBadge status={stream.status} lastEventAt={stream.lastEventAt} />
      </div>

      <div className={`grid gap-4 lg:grid-cols-[2fr_1fr] ${stale ? 'opacity-60' : ''}`}>
        <div className="space-y-4">
          <PnlCards pnl={data.pnl} />
          {data.positions.length === 0 ? (
            <EmptyState title="No open positions" hint="Nothing is open in this session. Fills will appear here as they arrive." />
          ) : (
            <PositionsTable positions={data.positions} />
          )}
        </div>
        <div className="space-y-4">
          <RiskGauge risk={data.risk} />
          <SessionInfo data={data} lastEvent={stream.lastEvent} />
        </div>
      </div>
    </section>
  );
}
