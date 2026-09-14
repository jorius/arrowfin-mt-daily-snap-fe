/**
 * Locale-aware number formatting. Money is always USD (the exchange's
 * currency); only the digit grouping, decimal separator and symbol placement
 * follow the locale. Timestamps stay UTC in ISO order, the trading convention.
 */
export interface Formatters {
  money: (n: number) => string;
  signedMoney: (n: number) => string;
  price: (n: number) => string;
  qty: (n: number) => string;
  pct: (n: number) => string;
  utcTime: (iso: string) => string;
  utcDateTime: (iso: string) => string;
}

const TAGS: Record<string, string> = { en: 'en-US', es: 'es-ES' };

export function makeFormatters(locale: string): Formatters {
  const tag = TAGS[locale] ?? 'en-US';
  const usd = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const priceFmt = new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 5 });
  const qtyFmt = new Intl.NumberFormat(tag);
  const pctFmt = new Intl.NumberFormat(tag, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return {
    money: (n) => usd.format(n),
    signedMoney: (n) => (n > 0 ? '+' : '') + usd.format(n),
    price: (n) => priceFmt.format(n),
    qty: (n) => qtyFmt.format(n),
    pct: (n) => pctFmt.format(n / 100),
    utcTime: (iso) => {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(11, 19) + 'Z';
    },
    utcDateTime: (iso) => {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 16).replace('T', ' ') + 'Z';
    },
  };
}

/** English defaults for code that runs outside the i18n provider. */
const DEFAULT = makeFormatters('en');
export const money = DEFAULT.money;
export const signedMoney = DEFAULT.signedMoney;
export const price = DEFAULT.price;
export const qty = DEFAULT.qty;
export const pct = DEFAULT.pct;
export const utcTime = DEFAULT.utcTime;
export const utcDateTime = DEFAULT.utcDateTime;
