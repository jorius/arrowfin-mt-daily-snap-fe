'use client';

import { LOCALES, useLocale, useT } from '@/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <div role="group" aria-label={t('lang.label')} className="inline-flex h-8 overflow-hidden rounded-md border border-line text-xs font-semibold">
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={`px-2.5 uppercase transition ${active ? 'bg-accent text-accent-fg' : 'text-muted hover:bg-card-2 hover:text-fg'}`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
