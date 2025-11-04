import { Gift, Sparkles } from 'lucide-react';
import { usePromotionStore } from '../../store/promotionStore';
import { isPromotionActive, formatCurrencyBRL } from '../../types/promotion';

export function HomePromotionCard() {
  const promotion = usePromotionStore((s) => s.promotion);
  const active = isPromotionActive(promotion || undefined);

  if (!active) return null;

  const highlight = promotion?.highlightColor || '#ec4899'; // pink-500
  const rules = promotion?.progressiveRules || [];
  const rule150 = rules.find((r) => r.threshold >= 150 && Math.round(r.percentage) === 15);

  const hasGlobal = !!promotion?.globalPercentage;
  const discountText = (() => {
    if (rule150) return `${Math.round(rule150.percentage)}% OFF`;
    if (hasGlobal) return `${Math.round(promotion!.globalPercentage!)}% OFF`;
    const topRule = [...rules].sort((a, b) => b.threshold - a.threshold)[0];
    return topRule ? `${Math.round(topRule.percentage)}% OFF` : '';
  })();

  const conditionText = (() => {
    if (rule150) return `Produtos acima de ${formatCurrencyBRL(150)}`;
    if (hasGlobal) return `Promoção válida para todos os produtos`;
    const next = [...rules].sort((a, b) => a.threshold - b.threshold)[0];
    return next ? `A partir de ${formatCurrencyBRL(next.threshold)}` : 'Promoção ativa';
  })();

  return (
    <div className="mb-10">
      <div
        className="relative overflow-hidden rounded-3xl shadow-lg border"
        style={{ borderColor: `${highlight}40` }}
      >
        <div
          className="p-6 sm:p-8 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                 style={{ backgroundColor: `${highlight}20` }}>
              <Gift className="w-6 h-6" style={{ color: highlight }} />
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Promoção Especial</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h3 className="font-handwritten text-3xl sm:text-4xl text-purple-800">
                {conditionText}
              </h3>
              {discountText && (
                <p className="mt-2 text-gray-700 font-kawaii">
                  Desconto aplicado automaticamente no catálogo.
                </p>
              )}
            </div>
            {discountText && (
              <div className="text-right">
                <span className="inline-block px-4 py-2 rounded-2xl text-white font-semibold text-lg sm:text-xl"
                      style={{ background: highlight }}>
                  {discountText}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}