export function formatCurrency(value: number): string {
  return `LKR ${value.toLocaleString("en-LK")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-LK");
}
