'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiError, apiFetch } from '@/lib/api';
import { setSession } from '@/lib/auth';
import type { Session } from '@/types/api';

function messageFor(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Invalid trader id or secret.';
    if (err.status === 403) return 'This trader is suspended.';
    if (err.status === 0) return 'Backend unreachable. Is the API running?';
    return err.message;
  }
  return 'Something went wrong.';
}

export default function LoginPage() {
  const router = useRouter();
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
      setError(messageFor(err));
      setPending(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            ArrowFin
          </div>
          <h1 className="mt-1 text-lg font-semibold text-zinc-100">Trader Portal</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Sign in to view your daily snapshot.
          </p>
        </div>

        <label className="block text-xs font-medium text-zinc-400" htmlFor="traderId">
          Trader id
        </label>
        <input
          id="traderId"
          name="traderId"
          autoComplete="username"
          required
          value={traderId}
          onChange={(e) => setTraderId(e.target.value)}
          placeholder="T-005"
          className="mt-1 mb-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500"
        />

        <label className="block text-xs font-medium text-zinc-400" htmlFor="secret">
          Secret
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          autoComplete="current-password"
          required
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 mb-6 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />

        {error ? (
          <p role="alert" className="mb-4 rounded-md border border-rose-900 bg-rose-950/60 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
