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
  const titleColor = promotion.bannerTitleColor || highlightColor;
  const conditionsColor = promotion.bannerConditionsColor || highlightColor;
  const globalColor = promotion.bannerGlobalColor || highlightColor;
  const progressiveColor = promotion.bannerProgressiveColor || highlightColor;
  const hasGlobal = !!promotion.globalPercentage && promotion.globalPercentage > 0;
  const rules = promotion.progressiveRules || [];
  const alignClass = promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center';
  const showConditions = promotion.bannerShowConditions !== false && (hasGlobal || rules.length > 0);
  const showCountdown = promotion.bannerShowCountdown !== false && !!promotion.endAt;
  const conditionsAbove = (promotion.bannerConditionsPosition || 'below') === 'above';
  const countdownAbove = (promotion.bannerCountdownPosition || 'below') === 'above';

  const showTitle = promotion.bannerShowTitle !== false;
  const titleText = (promotion.bannerTitle && promotion.bannerTitle.trim()) || '✨ PROMOÇÃO ESPECIAL ✨';
  const titleAbove = (promotion.bannerTitlePosition || 'above') === 'above';
  const density = promotion.bannerDensity || 'spacious';
  const borderStyle = promotion.bannerBorderStyle || 'subtle';
  const containerPadding = density === 'compact' ? 'p-3' : 'p-4';
  const borderClass = borderStyle === 'none' ? 'border-0' : 'border';
  const borderColor = borderStyle === 'solid' ? `${highlightColor}` : `${highlightColor}33`;
  const bgColor = `${highlightColor}22`;
  const titleFontClass = getFontClass(promotion.bannerTitleFont || 'handwritten');
  const messageFontClass = getFontClass(promotion.bannerMessageFont || 'kawaii');
  const countdownTextColor = promotion.bannerCountdownTextColor || highlightColor;
  const countdownBgColor = promotion.bannerCountdownBgColor || `${highlightColor}22`;
  const countdownBorderColor = `${countdownTextColor}33`;
  const countdownSize = promotion.bannerCountdownSize || 'md';
  const countdownSizeClass = countdownSize === 'sm' ? 'text-xs' : countdownSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={`rounded-xl ${containerPadding} mb-6 ${borderClass} shadow-sm`} style={{ borderColor, background: bgColor }}>
      <div className={alignClass}>
        {showTitle && titleAbove && (
          <div className={`flex items-center gap-2 mb-3 ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Sparkles className="w-5 h-5" style={{ color: titleColor }} />
            <h2 className={`${titleFontClass} text-xl font-semibold`} style={{ color: titleColor }}>
              {titleText}
            </h2>
          </div>
        )}

        {showCountdown && countdownAbove && (
          <div
            className={`flex items-center gap-2 rounded-lg p-2 border ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}
            style={{ background: countdownBgColor, borderColor: countdownBorderColor }}
          >
            <Clock className="w-4 h-4" style={{ color: countdownTextColor }} />
            {promotion.endAt && (
              <Countdown endAt={promotion.endAt} textColor={countdownTextColor} size={countdownSize} />
            )}
          </div>
        )}

        {showConditions && conditionsAbove && (
          <div className={`mt-3 ${promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center'} max-w-xl mx-auto`}>
            <div className={`flex items-center gap-2 mb-1 ${promotion.bannerAlignment === 'left' ? '' : 'justify-center'}`}>
              <ListOrdered className="w-4 h-4" style={{ color: conditionsColor }} />
              <span className="text-sm font-medium" style={{ color: conditionsColor }}>Condições da promoção</span>
            </div>
            <ConditionsList
              hasGlobal={hasGlobal}
              rules={rules}
              align={promotion.bannerAlignment || 'center'}
              styleVariant={promotion.bannerConditionsStyle || 'bullets'}
              globalColor={globalColor}
              progressiveColor={progressiveColor}
              globalPct={promotion.globalPercentage}
            />
            <p className="mt-2 text-xs text-gray-600">Aplicamos o maior desconto entre o global e as regras progressivas.</p>
          </div>
        )}

        <div className={`prose prose-sm max-w-none mb-3 ${messageFontClass}`}>
          <div dangerouslySetInnerHTML={{ __html: messageHtml }} />
        </div>

        {showTitle && !titleAbove && (
          <div className={`flex items-center gap-2 mb-3 ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}>
            <Sparkles className="w-5 h-5" style={{ color: titleColor }} />
            <h2 className={`${titleFontClass} text-xl font-semibold`} style={{ color: titleColor }}>
              {titleText}
            </h2>
          </div>
        )}

        {showCountdown && !countdownAbove && (
          <div
            className={`flex items-center gap-2 rounded-lg p-2 border ${promotion.bannerAlignment === 'left' ? 'justify-start' : 'justify-center'}`}
            style={{ background: countdownBgColor, borderColor: countdownBorderColor }}
          >
            <Clock className="w-4 h-4" style={{ color: countdownTextColor }} />
            {promotion.endAt && (
              <Countdown endAt={promotion.endAt} textColor={countdownTextColor} size={countdownSize} />
            )}
          </div>
        )}

        {showConditions && !conditionsAbove && (
          <div className={`mt-3 ${promotion.bannerAlignment === 'left' ? 'text-left' : 'text-center'} max-w-xl mx-auto`}>
            <div className={`flex items-center gap-2 mb-1 ${promotion.bannerAlignment === 'left' ? '' : 'justify-center'}`}>
              <ListOrdered className="w-4 h-4" style={{ color: conditionsColor }} />
              <span className="text-sm font-medium" style={{ color: conditionsColor }}>Condições da promoção</span>
            </div>
            <ConditionsList
              hasGlobal={hasGlobal}
              rules={rules}
              align={promotion.bannerAlignment || 'center'}
              styleVariant={promotion.bannerConditionsStyle || 'bullets'}
              globalColor={globalColor}
              progressiveColor={progressiveColor}
              globalPct={promotion.globalPercentage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ConditionsList({ hasGlobal, rules, align, styleVariant, globalColor, progressiveColor, globalPct }: { hasGlobal: boolean; rules: Promotion['progressiveRules']; align: 'center' | 'left'; styleVariant: 'bullets' | 'lines'; globalColor: string; progressiveColor: string; globalPct?: number }) {
  if (styleVariant === 'lines') {
    return (
      <div className={`text-sm text-gray-800 ${align === 'left' ? '' : 'inline-block text-left'} space-y-1`}>
        {hasGlobal && (
          <p>Desconto global: <span className="font-semibold" style={{ color: globalColor }}>{globalPct}% OFF</span> em todo o site.</p>
        )}
        {(rules || []).map((r, idx) => (
          <p key={idx}>Acima de <span className="font-semibold" style={{ color: progressiveColor }}>{formatCurrencyBRL(r.threshold)}</span> → <span className="font-semibold" style={{ color: progressiveColor }}>{r.percentage}%</span> OFF</p>
        ))}
      </div>
    );
  }
  return (
    <ul className={`text-sm text-gray-800 list-disc ${align === 'left' ? 'list-inside' : 'list-inside inline-block text-left'}`}>
      {hasGlobal && (
        <li>Desconto global: <span className="font-semibold" style={{ color: globalColor }}>{globalPct}% OFF</span> em todo o site.</li>
      )}
      {(rules || []).map((r, idx) => (
        <li key={idx}>Acima de <span className="font-semibold" style={{ color: progressiveColor }}>{formatCurrencyBRL(r.threshold)}</span> → <span className="font-semibold" style={{ color: progressiveColor }}>{r.percentage}% OFF</span>.</li>
      ))}
    </ul>
  );
}

function getFontClass(choice: 'handwritten' | 'kawaii' | 'sans' | 'serif') {
  switch (choice) {
    case 'handwritten':
      return 'font-handwritten';
    case 'kawaii':
      return 'font-kawaii';
    case 'serif':
      return 'font-serif';
    case 'sans':
    default:
      return 'font-sans';
  }
}

function Countdown({ endAt, textColor, size }: { endAt: string; textColor?: string; size?: 'sm' | 'md' | 'lg' }) {
  const [remaining, setRemaining] = useState(getRemaining(endAt));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt]);

  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';
  if (remaining.totalMs <= 0)
    return (
      <p className={`${sizeClass} font-medium`} style={{ color: textColor || '#9a3412' }}>
        Promoção encerrada.
      </p>
    );

  return (
    <p className={`${sizeClass} font-medium`} style={{ color: textColor || '#9a3412' }}>
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
