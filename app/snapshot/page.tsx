'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AccountSelector } from '@/components/snapshot/AccountSelector';
import { SnapshotWidget } from '@/components/snapshot/SnapshotWidget';
import { EmptyState, ErrorState, SnapshotSkeleton } from '@/components/snapshot/States';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAccounts } from '@/hooks/useAccounts';
import { useHydrated } from '@/hooks/useHydrated';
import { useSession } from '@/hooks/useSession';
import { ApiError, apiFetch } from '@/lib/api';
import { clearSession } from '@/lib/auth';

export default function SnapshotPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const session = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const accounts = useAccounts(session !== null);

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/api/key', { method: 'DELETE' });
    } catch {
      // Best effort: the key expires server-side anyway.
    }
    clearSession();
    router.replace('/login');
  }, [router]);

  useEffect(() => {
    if (hydrated && !session) router.replace('/login');
  }, [hydrated, session, router]);

  const accountsUnauthorized = accounts.error instanceof ApiError && accounts.error.status === 401;
  useEffect(() => {
    if (accountsUnauthorized) void signOut();
  }, [accountsUnauthorized, signOut]);

  if (!hydrated || !session) {
    return <main className="flex flex-1 items-center justify-center text-sm text-muted">Loading…</main>;
  }

  const list = accounts.data?.accounts ?? [];
  const current =
    selected && list.some((a) => a.id === selected)
      ? selected
      : (list.find((a) => a.status === 'active') ?? list[0])?.id ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-fg">AF</span>
            <div>
              <div className="text-sm font-semibold text-fg">{session.portalName}</div>
              <div className="font-mono text-[11px] text-muted">
                {session.principal.traderId} · {session.principal.brokerId}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {list.length > 0 ? <AccountSelector accounts={list} value={current} onChange={setSelected} /> : null}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md border border-line px-2.5 py-1.5 text-xs text-muted transition hover:bg-card-2 hover:text-fg"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 md:px-6 md:py-6">
        {accounts.isPending ? (
          <SnapshotSkeleton />
        ) : accounts.isError ? (
          <ErrorState
            message={accounts.error instanceof Error ? accounts.error.message : 'Unknown error'}
            onRetry={() => void accounts.refetch()}
          />
        ) : current === null ? (
          <EmptyState title="No accounts" hint="This trader has no accounts to display." />
        ) : (
          <SnapshotWidget accountId={current} apiKey={session.apiKey} onUnauthorized={signOut} />
        )}
      </main>
    </div>
  );
}
