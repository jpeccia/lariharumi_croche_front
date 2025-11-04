import { Gift, Sparkles, Clock, ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePromotionStore } from '../../store/promotionStore';
import { buildMessageFromTemplate, formatCurrencyBRL, getApplicableDiscount, isPromotionActive } from '../../types/promotion';

export function PromotionBanner() {
  const promotion = usePromotionStore((s) => s.promotion);

  if (!promotion || !isPromotionActive(promotion)) return null;

  const messageHtml = buildMessageFromTemplate(promotion);

  const discountPct = getApplicableDiscount(promotion, 200);
  const highlightColor = promotion.highlightColor || '#f472b6';
  const hasGlobal = !!promotion.globalPercentage && promotion.globalPercentage > 0;
  const rules = promotion.progressiveRules || [];

  return (
    <div className="rounded-xl p-4 mb-6 border shadow-sm" style={{ borderColor: highlightColor + '33', background: `${highlightColor}22` }}>
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" style={{ color: highlightColor }} />
          <h2 className="font-handwritten text-xl font-semibold" style={{ color: highlightColor }}>
            ✨ PROMOÇÃO ESPECIAL ✨
          </h2>
        </div>

        <div className="prose prose-sm max-w-none mb-3">
          <div dangerouslySetInnerHTML={{ __html: messageHtml }} />
        </div>

        {discountPct > 0 && (
          <div className="flex justify-center items-center gap-2 mb-3">
            <Gift className="w-5 h-5" style={{ color: highlightColor }} />
            <span className="font-bold text-2xl text-white px-4 py-2 rounded-lg shadow-md" style={{ backgroundColor: highlightColor }}>
              {discountPct}% OFF
            </span>
            <Gift className="w-5 h-5" style={{ color: highlightColor }} />
          </div>
        )}

        {promotion.endAt && (
          <div className="flex justify-center items-center gap-2 bg-orange-100 rounded-lg p-2 border border-orange-200">
            <Clock className="w-4 h-4 text-orange-600" />
            <Countdown endAt={promotion.endAt} />
          </div>
        )}

        {(hasGlobal || rules.length > 0) && (
          <div className="mt-3 text-left max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <ListOrdered className="w-4 h-4" style={{ color: highlightColor }} />
              <span className="text-sm font-medium" style={{ color: highlightColor }}>Condições da promoção</span>
            </div>
            {hasGlobal && (
              <p className="text-sm text-gray-800">• Desconto global: {promotion.globalPercentage}% OFF em todo o site.</p>
            )}
            {rules.length > 0 && (
              <ul className="text-sm text-gray-800 list-disc list-inside">
                {rules.map((r, idx) => (
                  <li key={idx}>Acima de {formatCurrencyBRL(r.threshold)} → {r.percentage}% OFF</li>
                ))}
              </ul>
            )}
            {hasGlobal && rules.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">Observação: o desconto global sobrescreve as regras progressivas no preço aplicado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Countdown({ endAt }: { endAt: string }) {
  const [remaining, setRemaining] = useState(getRemaining(endAt));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt]);

  if (remaining.totalMs <= 0) return <p className="text-orange-800 text-sm font-medium">Promoção encerrada.</p>;

  return (
    <p className="text-orange-800 text-sm font-medium">
      Termina em {remaining.days}d {remaining.hours}h {remaining.minutes}m {remaining.seconds}s
    </p>
  );
}

function getRemaining(endAt: string) {
  const now = new Date();
  const end = new Date(endAt);
  const diff = end.getTime() - now.getTime();
  const totalMs = diff;
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  return { days, hours, minutes, seconds, totalMs };
}
