import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { SnapshotDto } from '@/types/api';

export function useSnapshot(accountId: string | null) {
  return useQuery({
    queryKey: ['snapshot', accountId],
    queryFn: () => apiFetch<SnapshotDto>(`/accounts/${accountId}/snapshot`),
    enabled: accountId !== null,
  });
}
