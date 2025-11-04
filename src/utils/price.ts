export function extractNumericPrice(input?: string | null): number {
  if (!input) return NaN;
  // Match numbers with optional decimal part, supporting comma or dot
  const matches = input.match(/\d+(?:[\.,]\d+)?/g);
  if (!matches || matches.length === 0) return NaN;
  const nums = matches
    .map((m) => parseFloat(m.replace(',', '.')))
    .filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return NaN;
  // Use the highest number in the string (top of range)
  return Math.max(...nums);
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}