'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getSession } from '@/lib/auth';
import { useT } from '@/lib/i18n';

export default function Home() {
  const router = useRouter();
  const t = useT();
  useEffect(() => {
    router.replace(getSession() ? '/snapshot' : '/login');
  }, [router]);
  return <main className="flex flex-1 items-center justify-center text-sm text-muted">{t('app.loading')}</main>;
}
