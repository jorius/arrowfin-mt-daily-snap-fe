'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getSession } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getSession() ? '/snapshot' : '/login');
  }, [router]);
  return (
    <main className="flex flex-1 items-center justify-center text-sm text-muted">
      Loading…
    </main>
  );
}
