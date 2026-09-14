'use client';

import { useT } from '@/lib/i18n';
import type { MessageKey } from '@/lib/i18n/en';
import type { AccountSummary } from '@/types/api';

const STATUS_KEYS: Record<string, MessageKey> = {
  active: 'account.status.active',
  restricted: 'account.status.restricted',
  closed: 'account.status.closed',
};

export function AccountSelector({
  accounts,
  value,
  onChange,
}: {
  accounts: AccountSummary[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const t = useT();
  return (
    <label className="flex w-full items-center gap-2 text-xs text-muted sm:w-auto">
      <span className="shrink-0">{t('header.account')}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full min-w-0 rounded-md border border-line bg-card px-2 font-mono text-xs text-fg outline-none focus:border-accent sm:w-auto"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.accountNumber} · {a.accountType} · {STATUS_KEYS[a.status] ? t(STATUS_KEYS[a.status]) : a.status}
          </option>
        ))}
      </select>
    </label>
  );
}
