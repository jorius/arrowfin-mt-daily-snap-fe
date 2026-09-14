'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AccountSelector } from '@/components/snapshot/AccountSelector';
import { SnapshotWidget } from '@/components/snapshot/SnapshotWidget';
import { EmptyState, ErrorState, SnapshotSkeleton } from '@/components/snapshot/States';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAccounts } from '@/hooks/useAccounts';
import { useHydrated } from '@/hooks/useHydrated';
import { useSession } from '@/hooks/useSession';
import { ApiError, apiFetch } from '@/lib/api';
import { clearSession } from '@/lib/auth';
import { useT } from '@/lib/i18n';

export default function SnapshotPage() {
  const router = useRouter();
  const t = useT();
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
    return <main className="flex flex-1 items-center justify-center text-sm text-muted">{t('app.loading')}</main>;
  }

  const list = accounts.data?.accounts ?? [];
  const current =
    selected && list.some((a) => a.id === selected)
      ? selected
      : (list.find((a) => a.status === 'active') ?? list[0])?.id ?? null;

  const controls = (
    <>
      <LanguageSelector />
      <ThemeToggle />
      <button
        type="button"
        onClick={() => void signOut()}
        className="h-8 rounded-md border border-line px-2.5 text-xs text-muted transition hover:bg-card-2 hover:text-fg"
      >
        {t('header.signOut')}
      </button>
    </>
  );

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-line bg-bg/80 backdrop-blur">
        {/* Two rows on phones (brand + controls, then the account selector); one row from sm up. */}
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-fg">AF</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-fg">{session.portalName}</div>
                <div className="truncate font-mono text-[11px] text-muted">
                  {session.principal.traderId} · {session.principal.brokerId}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:hidden">{controls}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {list.length > 0 ? <AccountSelector accounts={list} value={current} onChange={setSelected} /> : null}
            <div className="hidden items-center gap-2 sm:flex">{controls}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 md:px-6 md:py-6">
        {accounts.isPending ? (
          <SnapshotSkeleton />
        ) : accounts.isError ? (
          <ErrorState
            message={accounts.error instanceof Error ? accounts.error.message : t('state.unknownError')}
            onRetry={() => void accounts.refetch()}
          />
        ) : current === null ? (
          <EmptyState title={t('accounts.empty.title')} hint={t('accounts.empty.hint')} />
        ) : (
          <SnapshotWidget accountId={current} apiKey={session.apiKey} onUnauthorized={signOut} />
        )}
      </main>
    </div>
  );
}
