const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const priceFmt = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
});
const qtyFmt = new Intl.NumberFormat('en-US');

export const money = (n: number): string => usd.format(n);
export const signedMoney = (n: number): string => (n > 0 ? '+' : '') + usd.format(n);
export const price = (n: number): string => priceFmt.format(n);
export const qty = (n: number): string => qtyFmt.format(n);
export const pct = (n: number): string => `${n.toFixed(1)}%`;
export const utcTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(11, 19) + 'Z';
};
export const utcDateTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 16).replace('T', ' ') + 'Z';
};
