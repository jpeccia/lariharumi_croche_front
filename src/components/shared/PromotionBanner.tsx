import { Sparkles, Clock, ListOrdered } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePromotionStore } from '../../store/promotionStore';
import { Promotion, buildMessageFromTemplate, formatCurrencyBRL, isPromotionActive } from '../../types/promotion';

export function PromotionBanner() {
  const promotion = usePromotionStore((s) => s.promotion);

  if (!promotion || !isPromotionActive(promotion)) return null;

  return <PromotionBannerContent promotion={promotion} />;
}

export function PromotionBannerContent({ promotion }: { promotion: Promotion }) {
  const messageHtml = buildMessageFromTemplate(promotion);
  const highlightColor = promotion.highlightColor || '#f472b6';
  const hasGlobal = !!promotion.globalPercentage && promotion.globalPercentage > 0;
  const rules = promotion.progressiveRules || [];
  const alignClass = promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center';
  const showConditions = promotion.bannerShowConditions !== false && (hasGlobal || rules.length > 0);
  const showCountdown = promotion.bannerShowCountdown !== false && !!promotion.endAt;
  const conditionsAbove = (promotion.bannerConditionsPosition || 'below') === 'above';
  const countdownAbove = (promotion.bannerCountdownPosition || 'below') === 'above';
  const titleText = (promotion.bannerTitle && promotion.bannerTitle.trim()) || 'Promoção Especial';
  const titleAbove = (promotion.bannerTitlePosition || 'above') === 'above';
  const density = promotion.bannerDensity || 'spaced';
  const isCompact = density === 'compact';
  const conditionsStyle = promotion.bannerConditionsStyle || 'bullets';

  return (
    <div className={`rounded-xl ${isCompact ? 'p-2 mb-4 border' : 'p-4 mb-6 border-2'} shadow-sm`} style={{ borderColor: highlightColor + '33', background: `${highlightColor}22` }}>
      <div className={alignClass}>
        {/* Título do banner (acima ou abaixo da mensagem) */}
        {titleAbove && (
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-3'} ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Sparkles className="w-5 h-5" style={{ color: highlightColor }} />
            <h2 className="font-handwritten text-xl font-semibold" style={{ color: highlightColor }}>
              {titleText}
            </h2>
          </div>
        )}

        {showCountdown && countdownAbove && (
          <div className={`flex items-center gap-2 bg-orange-100 rounded-lg ${isCompact ? 'p-1' : 'p-2'} border border-orange-200 ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Clock className="w-4 h-4 text-orange-600" />
            {promotion.endAt && <Countdown endAt={promotion.endAt} />}
          </div>
        )}

        {showConditions && conditionsAbove && (
          <div className={`${isCompact ? 'mt-2' : 'mt-3'} ${promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center'} max-w-xl mx-auto`}>
            <div className={`flex items-center gap-2 mb-1 ${promotion.bannerAlignment === 'left' ? '' : 'justify-center'}`}>
              <ListOrdered className="w-4 h-4" style={{ color: highlightColor }} />
              <span className="text-sm font-medium" style={{ color: highlightColor }}>Condições da promoção</span>
            </div>
            <ConditionsList hasGlobal={hasGlobal} rules={rules} styleMode={conditionsStyle} align={promotion.bannerAlignment} />
            <p className="mt-2 text-xs text-gray-600">Aplicamos o maior desconto entre o global e as regras progressivas.</p>
          </div>
        )}

        <div className={`prose prose-sm max-w-none ${isCompact ? 'mb-2' : 'mb-3'}`}>
          <div dangerouslySetInnerHTML={{ __html: messageHtml }} />
        </div>

        {/* Corpo descritivo opcional */}
        {promotion.bannerBody && (
          <div className={`text-sm text-gray-800 ${isCompact ? 'mb-2' : 'mb-3'} ${promotion.bannerAlignment === 'left' ? '' : 'max-w-xl mx-auto'}`}>
            {promotion.bannerBody}
          </div>
        )}

        {/* Título abaixo da mensagem, quando configurado */}
        {!titleAbove && (
          <div className={`flex items-center gap-2 ${isCompact ? 'mb-2' : 'mb-3'} ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Sparkles className="w-5 h-5" style={{ color: highlightColor }} />
            <h2 className="font-handwritten text-xl font-semibold" style={{ color: highlightColor }}>
              {titleText}
            </h2>
          </div>
        )}

        {showCountdown && !countdownAbove && (
          <div className={`flex items-center gap-2 bg-orange-100 rounded-lg ${isCompact ? 'p-1' : 'p-2'} border border-orange-200 ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Clock className="w-4 h-4 text-orange-600" />
            {promotion.endAt && <Countdown endAt={promotion.endAt} />}
          </div>
        )}

        {showConditions && !conditionsAbove && (
          <div className={`${isCompact ? 'mt-2' : 'mt-3'} ${promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center'} max-w-xl mx-auto`}>
            <div className={`flex items-center gap-2 mb-1 ${promotion.bannerAlignment === 'left' ? '' : 'justify-center'}`}>
              <ListOrdered className="w-4 h-4" style={{ color: highlightColor }} />
              <span className="text-sm font-medium" style={{ color: highlightColor }}>Condições da promoção</span>
            </div>
            <ConditionsList hasGlobal={hasGlobal} rules={rules} styleMode={conditionsStyle} align={promotion.bannerAlignment} />
            <p className="mt-2 text-xs text-gray-600">Aplicamos o maior desconto entre o global e as regras progressivas.</p>
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
function ConditionsList({ hasGlobal, rules, styleMode, align }: { hasGlobal: boolean; rules: NonNullable<Promotion['progressiveRules']>; styleMode: 'bullets' | 'lines'; align: 'center' | 'left'; }) {
  if (!hasGlobal && (!rules || rules.length === 0)) return null;
  const isBullets = styleMode === 'bullets';
  const containerClass = isBullets
    ? `text-sm text-gray-800 ${align === 'left' ? 'list-inside' : 'list-inside inline-block text-left'}`
    : 'text-sm text-gray-800 divide-y divide-gray-200';
  return (
    <div>
      {hasGlobal && (
        isBullets ? (
          <p className="text-sm text-gray-800">• Desconto global: {/**/}{/* keep text */}{}</p>
        ) : (
          <div className="py-1">Desconto global: {/**/}{/* keep text */}{}</div>
        )
      )}
      {rules && rules.length > 0 && (
        isBullets ? (
          <ul className={`list-disc ${containerClass}`}>
            {rules.map((r, idx) => (
              <li key={idx}>Acima de {formatCurrencyBRL(r.threshold)} → {r.percentage}% OFF</li>
            ))}
          </ul>
        ) : (
          <ul className={containerClass + ' list-none'}>
            {rules.map((r, idx) => (
              <li key={idx} className="py-1">Acima de {formatCurrencyBRL(r.threshold)} → {r.percentage}% OFF</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
