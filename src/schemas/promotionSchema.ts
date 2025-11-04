import { z } from 'zod';

export const progressiveRuleSchema = z.object({
  threshold: z.number().min(0, 'Valor mínimo deve ser 0'),
  percentage: z.number().min(0, 'Desconto mínimo 0%').max(100, 'Desconto máximo 100%'),
});

export const promotionSchema = z.object({
  enabled: z.boolean().default(false),
  globalPercentage: z.number().min(0).max(100).optional(),
  progressiveRules: z.array(progressiveRuleSchema).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  messageTemplate: z.string().max(5000).optional(),
  highlightColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).optional(),
  bannerTitle: z.string().max(200).optional(),
  bannerTitlePosition: z.enum(['above', 'below']).optional(),
  bannerBody: z.string().max(2000).optional(),
  bannerShowConditions: z.boolean().optional(),
  bannerConditionsPosition: z.enum(['above', 'below']).optional(),
  bannerConditionsStyle: z.enum(['bullets', 'lines']).optional(),
  bannerShowCountdown: z.boolean().optional(),
  bannerCountdownPosition: z.enum(['above', 'below']).optional(),
  bannerAlignment: z.enum(['center', 'left']).optional(),
  bannerDensity: z.enum(['compact', 'spaced']).optional(),
}).refine((data) => {
  if (data.globalPercentage && data.progressiveRules && data.progressiveRules.length > 0) {
    // Permitir, mas sinalizar que global sobrescreve progressivo
    return true;
  }
  return true;
}, {
  message: 'Desconto global definido sobrescreve regras progressivas',
  path: ['globalPercentage'],
}).refine((data) => {
  if (data.startAt && data.endAt) {
    return new Date(data.startAt) <= new Date(data.endAt);
  }
  return true;
}, {
  message: 'Data de início deve ser anterior ou igual à data de término',
  path: ['endAt'],
});

export type PromotionFormData = z.infer<typeof promotionSchema>;