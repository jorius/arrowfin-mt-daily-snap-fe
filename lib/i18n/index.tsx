'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { makeFormatters, type Formatters } from '@/lib/format';
import { en, type MessageKey } from './en';
import { es } from './es';

export type Locale = 'en' | 'es';
export const LOCALE_KEY = 'arrowfin.locale';
export const LOCALES: Locale[] = ['en', 'es'];

const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, es };
const listeners = new Set<() => void>();

function readLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    // fall through to the browser language
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
  fmt: Formatters;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Server and hydration render in English; the browser preference applies right after.
  const locale = useSyncExternalStore(subscribe, readLocale, () => 'en' as Locale);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      // Storage unavailable: the choice lives for this page only.
    }
    for (const listener of listeners) listener();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = MESSAGES[locale];
    const t: Translate = (key, params) => {
      let text: string = dict[key] ?? en[key] ?? key;
      if (params) {
        for (const [name, v] of Object.entries(params)) text = text.split(`{${name}}`).join(String(v));
      }
      return text;
    };
    return { locale, setLocale, t, fmt: makeFormatters(locale) };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('i18n hooks must be used inside I18nProvider');
  return ctx;
}

export function useT(): Translate {
  return useI18n().t;
}

export function useLocale(): { locale: Locale; setLocale: (locale: Locale) => void } {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}

export function useFormat(): Formatters {
  return useI18n().fmt;
}
