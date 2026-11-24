export function formatPKR(amount: number): string {
  return "Rs. " + new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(amount);
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
