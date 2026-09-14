import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { AccountSummary } from '@/types/api';

export function useAccounts(enabled = true) {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiFetch<{ accounts: AccountSummary[] }>('/me/accounts'),
    enabled,
  });
}
