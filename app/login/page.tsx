'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, apiFetch } from '@/lib/api';
import { setSession } from '@/lib/auth';
import { useT, type Translate } from '@/lib/i18n';
import type { Session } from '@/types/api';

function messageFor(err: unknown, t: Translate): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t('login.error.invalid');
    if (err.status === 403) return t('login.error.suspended');
    if (err.status === 0) return t('login.error.unreachable');
    return err.message;
  }
  return t('login.error.generic');
}

export default function LoginPage() {
  const router = useRouter();
  const t = useT();
  const [traderId, setTraderId] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const session = await apiFetch<Session>('/auth/api/key', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ traderId: traderId.trim(), secret }),
      });
      setSession(session);
      router.replace('/snapshot');
    } catch (err) {
      setError(messageFor(err, t));
      setPending(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-6 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-line bg-card p-6 shadow-xl shadow-black/10 dark:shadow-black/40"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('login.brand')}</div>
            <h1 className="mt-1 text-lg font-semibold text-fg">{t('login.title')}</h1>
            <p className="mt-1 text-xs text-muted">{t('login.subtitle')}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        <label className="block text-xs font-medium text-muted" htmlFor="traderId">
          {t('login.traderId')}
        </label>
        <input
          id="traderId"
          name="traderId"
          autoComplete="username"
          required
          value={traderId}
          onChange={(e) => setTraderId(e.target.value)}
          placeholder={t('login.traderId.placeholder')}
          className="mt-1 mb-4 w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm text-fg outline-none placeholder:text-faint focus:border-accent"
        />

        <label className="block text-xs font-medium text-muted" htmlFor="secret">
          {t('login.secret')}
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          autoComplete="current-password"
          required
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 mb-6 w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        />

        {error ? (
          <p role="alert" className="mb-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-xs text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t('login.submitting') : t('login.submit')}
        </button>
      </form>
    </main>
  );
}
