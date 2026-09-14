'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AccountSelector } from '@/components/snapshot/AccountSelector';
import { SnapshotWidget } from '@/components/snapshot/SnapshotWidget';
import { EmptyState, ErrorState, SnapshotSkeleton } from '@/components/snapshot/States';
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
    return <main className="flex flex-1 items-center justify-center text-sm text-zinc-500">Loading…</main>;
  }

  const list = accounts.data?.accounts ?? [];
  const current =
    selected && list.some((a) => a.id === selected)
      ? selected
      : (list.find((a) => a.status === 'active') ?? list[0])?.id ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-zinc-950">AF</span>
            <div>
              <div className="text-sm font-semibold text-zinc-100">{session.portalName}</div>
              <div className="font-mono text-[11px] text-zinc-500">
                {session.principal.traderId} · {session.principal.brokerId}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {list.length > 0 ? <AccountSelector accounts={list} value={current} onChange={setSelected} /> : null}
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
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
