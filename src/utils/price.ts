export function extractNumericPrice(input?: string | null): number {
  if (!input) return NaN;
  // Captura números considerando separadores de milhar (ponto ou espaço) e decimais (vírgula ou ponto)
  // Exemplos suportados: "150", "150,00", "1.500,00", "1 500,00", "1,500.00", "50 a 200"
  const matches = input.match(/\d{1,3}(?:[\.\s]\d{3})*(?:[\.,]\d+)?|\d+(?:[\.,]\d+)?/g);
  if (!matches || matches.length === 0) return NaN;

  const nums = matches
    .map((raw) => {
      const hasComma = raw.includes(',');
      const hasDot = raw.includes('.');
      let normalized = raw;

      if (hasComma && hasDot) {
        // Formato pt-BR típico: milhar com ponto e decimal com vírgula (ex: 1.500,00)
        normalized = raw.replace(/\./g, '').replace(',', '.');
      } else if (hasComma && !hasDot) {
        // Apenas vírgula presente: tratar como decimal
        normalized = raw.replace(',', '.');
      } else if (!hasComma && hasDot) {
        // Apenas ponto presente: pode ser decimal ou milhar
        // Se houver mais de um ponto, remover todos exceto o último (milhar) e tratar o último como decimal
        const parts = raw.split('.');
        if (parts.length > 2) {
          const last = parts.pop() as string;
          normalized = parts.join('') + '.' + last;
        } else {
          normalized = raw; // único ponto: tratar como decimal em en-US
        }
      }

      const n = parseFloat(normalized);
      return Number.isNaN(n) ? NaN : n;
    })
    .filter((n) => !Number.isNaN(n));

  if (nums.length === 0) return NaN;
  // Usar o maior número encontrado (topo do range)
  return Math.max(...nums);
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}