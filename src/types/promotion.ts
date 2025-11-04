export interface ProgressiveDiscountRule {
  threshold: number; // valor do pedido para aplicar a regra (R$)
  percentage: number; // porcentagem de desconto (0-100)
}

export interface Promotion {
  enabled: boolean;
  globalPercentage?: number; // desconto global, se definido
  progressiveRules?: ProgressiveDiscountRule[]; // regras progressivas por valor
  startAt?: string; // ISO datetime
  endAt?: string; // ISO datetime
  messageTemplate?: string; // mensagem com variáveis dinâmicas
  highlightColor?: string; // cor para destaque visual
  // Layout do banner (opcional e apenas front-end)
  bannerShowConditions?: boolean;
  bannerConditionsPosition?: 'above' | 'below';
  bannerShowCountdown?: boolean;
  bannerCountdownPosition?: 'above' | 'below';
  bannerAlignment?: 'center' | 'left';
  // Novas customizações
  bannerShowTitle?: boolean;
  bannerTitle?: string;
  bannerTitlePosition?: 'above' | 'below';
  bannerConditionsStyle?: 'bullets' | 'lines';
  bannerDensity?: 'compact' | 'spacious';
  bannerBorderStyle?: 'subtle' | 'solid' | 'none';
  bannerTitleFont?: 'handwritten' | 'kawaii' | 'sans' | 'serif';
  bannerMessageFont?: 'handwritten' | 'kawaii' | 'sans' | 'serif';
  bannerTitleColor?: string; // cor do título do banner
  bannerConditionsColor?: string; // cor do cabeçalho "Condições da promoção"
  bannerGlobalColor?: string; // cor para o texto do desconto global
  bannerProgressiveColor?: string; // cor para o texto das regras progressivas
  bannerCountdownBgColor?: string; // cor de fundo do contador
  bannerCountdownTextColor?: string; // cor do texto do contador
  bannerCountdownSize?: 'sm' | 'md' | 'lg'; // tamanho do texto do contador
}

export interface PromotionState extends Promotion {
  updatedAt?: string; // última atualização
}

export type DynamicMessageVariable =
  | '%OFF'
  | '%START_DATE%'
  | '%END_DATE%'
  | '%DAYS_LEFT%';

export function isPromotionActive(promo?: Promotion | null, now: Date = new Date()): boolean {
  if (!promo || !promo.enabled) return false;
  if (promo.startAt && new Date(promo.startAt) > now) return false;
  if (promo.endAt && new Date(promo.endAt) < now) return false;
  return true;
}

export function getApplicableDiscount(
  promo: Promotion | null | undefined,
  orderTotal: number
): number {
  if (!promo || !isPromotionActive(promo)) return 0;
  const global = promo.globalPercentage && promo.globalPercentage > 0
    ? clampPercentage(promo.globalPercentage)
    : 0;

  // Progressive rules
  const rules = promo.progressiveRules || [];
  let progressive = 0;
  if (rules.length > 0) {
    // Escolhe a maior regra aplicável pelo threshold
    const applicable = rules
      .filter((r) => orderTotal >= r.threshold)
      .sort((a, b) => b.threshold - a.threshold)[0];
    progressive = applicable ? clampPercentage(applicable.percentage) : 0;
  }

  // Aplicar o MAIOR desconto entre global e progressivo
  return Math.max(global, progressive);
}

export function applyDiscount(price: number, percentage: number): number {
  const pct = clampPercentage(percentage);
  return roundCurrency(price * (1 - pct / 100));
}

export function clampPercentage(p: number): number {
  if (Number.isNaN(p)) return 0;
  if (p < 0) return 0;
  if (p > 100) return 100;
  return Math.round(p * 100) / 100; // 2 casas
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function buildMessageFromTemplate(promo: Promotion, orderTotalForPreview?: number): string {
  const percentage = getApplicableDiscount(promo, orderTotalForPreview ?? 0);

  const daysLeft = (() => {
    if (!promo.endAt) return '';
    const now = new Date();
    const end = new Date(promo.endAt);
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return '0';
    return String(Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  })();

  let msg = promo.messageTemplate || '';
  msg = msg.replace(/%OFF%/g, `${clampPercentage(percentage)}%`);
  if (promo.startAt) msg = msg.replace(/%START_DATE%/g, new Date(promo.startAt).toLocaleDateString('pt-BR'));
  if (promo.endAt) msg = msg.replace(/%END_DATE%/g, new Date(promo.endAt).toLocaleDateString('pt-BR'));
  msg = msg.replace(/%DAYS_LEFT%/g, daysLeft);
  return msg;
}