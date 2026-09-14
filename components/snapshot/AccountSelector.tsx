import type { AccountSummary } from '@/types/api';

export function AccountSelector({
  accounts,
  value,
  onChange,
}: {
  accounts: AccountSummary[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      Account
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-card px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-accent"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.accountNumber} · {a.accountType} · {a.status}
          </option>
        ))}
      </select>
    </label>
  );
}
