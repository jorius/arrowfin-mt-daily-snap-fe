'use client';

import { useTheme } from '@/lib/theme';

export function ThemeToggle({ label }: { label?: { toLight: string; toDark: string } }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const text = dark ? (label?.toLight ?? 'Switch to light theme') : (label?.toDark ?? 'Switch to dark theme');
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={text}
      title={text}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition hover:bg-card-2 hover:text-fg"
    >
      {dark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
