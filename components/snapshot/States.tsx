export function SnapshotSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading snapshot" className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl border border-zinc-800 bg-zinc-900" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900" />
        <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-900 bg-rose-950/40 p-6 text-center">
      <div className="text-sm font-semibold text-rose-200">Couldn&apos;t load the snapshot</div>
      <p className="mt-1 text-xs text-rose-300/80">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-rose-700 px-3 py-1.5 text-xs font-medium text-rose-100 hover:bg-rose-900/60"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
      <div className="text-sm font-medium text-zinc-300">{title}</div>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}
