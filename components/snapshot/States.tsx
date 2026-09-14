export function SnapshotSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading snapshot" className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl border border-line bg-card" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="h-48 rounded-xl border border-line bg-card" />
        <div className="h-48 rounded-xl border border-line bg-card" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-danger/40 bg-danger-soft p-6 text-center">
      <div className="text-sm font-semibold text-danger">Couldn&apos;t load the snapshot</div>
      <p className="mt-1 text-xs text-danger/80">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-danger/60 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger hover:text-danger-fg"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-card/60 p-8 text-center">
      <div className="text-sm font-medium text-fg">{title}</div>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
