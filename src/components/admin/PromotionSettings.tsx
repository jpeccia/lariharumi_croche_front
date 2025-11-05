import { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePromotionStore } from '../../store/promotionStore';
import { Promotion, ProgressiveDiscountRule, buildMessageFromTemplate, clampPercentage, isPromotionActive } from '../../types/promotion';
import { PromotionBannerContent } from '../shared/PromotionBanner';
import { promotionSchema, PromotionFormData } from '../../schemas/promotionSchema';
import { adminApi } from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { z } from 'zod';
import { Clock, Percent, AlertCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

const defaultTemplate = `✨ Promoção ativa! Aproveite %OFF% de desconto em todo o site! ✨\nVálida de %START_DATE% até %END_DATE%. Faltam %DAYS_LEFT% dias!`;

export function PromotionSettings() {
  const promotion = usePromotionStore((s) => s.promotion);
  const setPromotion = usePromotionStore((s) => s.setPromotion);
  const clearPromotion = usePromotionStore((s) => s.clearPromotion);
  const isActive = usePromotionStore((s) => s.isActive);

  const [form, setForm] = useState<PromotionFormData>({
    enabled: false,
    globalPercentage: undefined,
    progressiveRules: [],
    startAt: undefined,
    endAt: undefined,
    messageTemplate: defaultTemplate,
    highlightColor: '#f472b6',
    bannerShowConditions: true,
    bannerConditionsPosition: 'below',
    bannerShowCountdown: true,
    bannerCountdownPosition: 'below',
    bannerAlignment: 'center',
    bannerShowTitle: true,
    bannerTitle: '✨ PROMOÇÃO ESPECIAL ✨',
    bannerTitlePosition: 'above',
    bannerConditionsStyle: 'bullets',
    bannerDensity: 'spacious',
    bannerBorderStyle: 'subtle',
    bannerTitleFont: 'handwritten',
    bannerMessageFont: 'kawaii',
    bannerTitleColor: '#f472b6',
    bannerConditionsColor: '#f472b6',
    bannerGlobalColor: '#f472b6',
    bannerProgressiveColor: '#f472b6',
    bannerCountdownBgColor: '#fff3cd',
    bannerCountdownTextColor: '#b45309',
    bannerCountdownSize: 'md',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promotion) {
      setForm({
        enabled: promotion.enabled,
        globalPercentage: promotion.globalPercentage,
        progressiveRules: promotion.progressiveRules || [],
        startAt: promotion.startAt,
        endAt: promotion.endAt,
        messageTemplate: promotion.messageTemplate || defaultTemplate,
        highlightColor: promotion.highlightColor || '#f472b6',
        bannerShowConditions: promotion.bannerShowConditions ?? true,
        bannerConditionsPosition: promotion.bannerConditionsPosition ?? 'below',
        bannerShowCountdown: promotion.bannerShowCountdown ?? true,
        bannerCountdownPosition: promotion.bannerCountdownPosition ?? 'below',
        bannerAlignment: promotion.bannerAlignment ?? 'center',
        bannerShowTitle: promotion.bannerShowTitle ?? true,
        bannerTitle: promotion.bannerTitle ?? '✨ PROMOÇÃO ESPECIAL ✨',
        bannerTitlePosition: promotion.bannerTitlePosition ?? 'above',
        bannerConditionsStyle: promotion.bannerConditionsStyle ?? 'bullets',
      bannerDensity: promotion.bannerDensity ?? 'spacious',
      bannerBorderStyle: promotion.bannerBorderStyle ?? 'subtle',
      bannerTitleFont: promotion.bannerTitleFont ?? 'handwritten',
      bannerMessageFont: promotion.bannerMessageFont ?? 'kawaii',
      bannerTitleColor: promotion.bannerTitleColor ?? (promotion.highlightColor || '#f472b6'),
      bannerConditionsColor: promotion.bannerConditionsColor ?? (promotion.highlightColor || '#f472b6'),
      bannerGlobalColor: promotion.bannerGlobalColor ?? (promotion.highlightColor || '#f472b6'),
      bannerProgressiveColor: promotion.bannerProgressiveColor ?? (promotion.highlightColor || '#f472b6'),
      bannerCountdownBgColor: promotion.bannerCountdownBgColor ?? '#fff3cd',
      bannerCountdownTextColor: promotion.bannerCountdownTextColor ?? '#b45309',
      bannerCountdownSize: promotion.bannerCountdownSize ?? 'md',
    });
    }
  }, [promotion]);

  const previewMessage = useMemo(() => {
    const promoLike: Promotion = {
      enabled: form.enabled,
      globalPercentage: form.globalPercentage,
      progressiveRules: form.progressiveRules,
      startAt: form.startAt,
      endAt: form.endAt,
      messageTemplate: form.messageTemplate,
      highlightColor: form.highlightColor,
    };
    return buildMessageFromTemplate(promoLike, 200);
  }, [form]);

  function updateField<K extends keyof PromotionFormData>(key: K, value: PromotionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addRule() {
    const newRule: ProgressiveDiscountRule = { threshold: 0, percentage: 0 };
    updateField('progressiveRules', [...(form.progressiveRules || []), newRule]);
  }

  function removeRule(index: number) {
    const rules = [...(form.progressiveRules || [])];
    rules.splice(index, 1);
    updateField('progressiveRules', rules);
  }

  function handleRuleChange(index: number, field: keyof ProgressiveDiscountRule, value: number) {
    const rules = [...(form.progressiveRules || [])];
    const updated = { ...rules[index], [field]: value };
    rules[index] = updated;
    updateField('progressiveRules', rules);
  }

  async function validateAndSave() {
    setErrors({});
    const parsed = promotionSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path.join('.') || 'form';
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const hasDiscount = (
      !!parsed.data.globalPercentage && parsed.data.globalPercentage > 0
    ) || ((parsed.data.progressiveRules || []).length > 0);
    const enabled = parsed.data.enabled || hasDiscount;

    const cleaned: Promotion = {
      enabled,
      globalPercentage: parsed.data.globalPercentage ? clampPercentage(parsed.data.globalPercentage) : undefined,
      // Sempre persistir regras progressivas; a precedência do desconto global é aplicada no cálculo
      progressiveRules: parsed.data.progressiveRules,
      startAt: parsed.data.startAt,
      endAt: parsed.data.endAt,
      messageTemplate: parsed.data.messageTemplate,
      highlightColor: parsed.data.highlightColor,
      bannerShowConditions: parsed.data.bannerShowConditions,
      bannerConditionsPosition: parsed.data.bannerConditionsPosition,
      bannerShowCountdown: parsed.data.bannerShowCountdown,
      bannerCountdownPosition: parsed.data.bannerCountdownPosition,
      bannerAlignment: parsed.data.bannerAlignment,
      bannerShowTitle: parsed.data.bannerShowTitle,
      bannerTitle: parsed.data.bannerTitle,
      bannerTitlePosition: parsed.data.bannerTitlePosition,
      bannerConditionsStyle: parsed.data.bannerConditionsStyle,
      bannerDensity: parsed.data.bannerDensity,
      bannerBorderStyle: parsed.data.bannerBorderStyle,
      bannerTitleFont: parsed.data.bannerTitleFont,
      bannerMessageFont: parsed.data.bannerMessageFont,
      bannerTitleColor: parsed.data.bannerTitleColor,
      bannerConditionsColor: parsed.data.bannerConditionsColor,
      bannerGlobalColor: parsed.data.bannerGlobalColor,
      bannerProgressiveColor: parsed.data.bannerProgressiveColor,
      bannerCountdownBgColor: parsed.data.bannerCountdownBgColor,
      bannerCountdownTextColor: parsed.data.bannerCountdownTextColor,
      bannerCountdownSize: parsed.data.bannerCountdownSize,
    };
    try {
      // Persistir no backend primeiro
      const saved = await adminApi.updatePromotion(cleaned);
      setPromotion(saved);
      showSuccess('Promoção salva e sincronizada.');
    } catch (err) {
      // Em caso de falha, manter apenas local
      setPromotion(cleaned);
      showError('Falha ao sincronizar com o servidor. Promoção salva localmente.');
    }
  }

  async function disablePromotion() {
    clearPromotion();
    const disabledForm: PromotionFormData = {
      enabled: false,
      globalPercentage: undefined,
      progressiveRules: [],
      startAt: undefined,
      endAt: undefined,
      messageTemplate: defaultTemplate,
      highlightColor: '#f472b6',
      bannerShowConditions: true,
      bannerConditionsPosition: 'below',
      bannerShowCountdown: true,
      bannerCountdownPosition: 'below',
      bannerAlignment: 'center',
      bannerShowTitle: true,
      bannerTitle: '✨ PROMOÇÃO ESPECIAL ✨',
      bannerTitlePosition: 'above',
      bannerConditionsStyle: 'bullets',
      bannerDensity: 'spacious',
      bannerBorderStyle: 'subtle',
      bannerTitleFont: 'handwritten',
      bannerMessageFont: 'kawaii',
      bannerTitleColor: '#f472b6',
      bannerConditionsColor: '#f472b6',
      bannerGlobalColor: '#f472b6',
      bannerProgressiveColor: '#f472b6',
      bannerCountdownBgColor: '#fff3cd',
      bannerCountdownTextColor: '#b45309',
      bannerCountdownSize: 'md',
    };
    setForm(disabledForm);

    // Sincronizar desativação no backend
    const disabledPromotion = {
      enabled: false,
      globalPercentage: undefined,
      progressiveRules: [],
      startAt: undefined,
      endAt: undefined,
      messageTemplate: defaultTemplate,
      highlightColor: '#f472b6',
      bannerShowConditions: true,
      bannerConditionsPosition: 'below',
      bannerShowCountdown: true,
      bannerCountdownPosition: 'below',
      bannerAlignment: 'center',
      bannerShowTitle: true,
      bannerTitle: '✨ PROMOÇÃO ESPECIAL ✨',
      bannerTitlePosition: 'above',
      bannerConditionsStyle: 'bullets',
      bannerDensity: 'spacious',
      bannerBorderStyle: 'subtle',
      bannerTitleFont: 'handwritten',
      bannerMessageFont: 'kawaii',
      bannerTitleColor: '#f472b6',
      bannerConditionsColor: '#f472b6',
      bannerGlobalColor: '#f472b6',
      bannerProgressiveColor: '#f472b6',
      bannerCountdownBgColor: '#fff3cd',
      bannerCountdownTextColor: '#b45309',
      bannerCountdownSize: 'md',
    } as Promotion;

    try {
      await adminApi.updatePromotion(disabledPromotion);
      showSuccess('Promoção desativada e sincronizada.');
    } catch {
      showError('Falha ao desativar no servidor. Desativada localmente.');
    }
  }

  const active = isActive();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-purple-800">Promoções e Descontos</h2>
        </div>
        <div className="flex items-center gap-3">
          {active ? (
            <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-md text-sm"><CheckCircle2 className="w-4 h-4" /> Ativa</span>
          ) : (
            <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-3 py-1 rounded-md text-sm"><XCircle className="w-4 h-4" /> Inativa</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="space-y-5">
            {/* Habilitar */}
            <div>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.enabled} onChange={(e) => updateField('enabled', e.target.checked)} />
                <span className="text-sm text-gray-700">Habilitar promoção</span>
              </label>
            </div>

            {/* Global percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto Global (%)</label>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-500" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.globalPercentage ?? ''}
                  onChange={(e) => updateField('globalPercentage', e.target.value === '' ? undefined : Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ex: 10"
                />
              </div>
              {errors.globalPercentage && (
                <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.globalPercentage}</p>
              )}
            </div>

            {/* Progressive rules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Descontos Progressivos</label>
                <button type="button" onClick={addRule} className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">Adicionar regra</button>
              </div>
              <div className="space-y-3">
                {(form.progressiveRules || []).map((rule, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Aplicar acima de (R$)</label>
                      <input type="number" min={0} step={1} value={rule.threshold} onChange={(e) => handleRuleChange(idx, 'threshold', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Desconto (%)</label>
                      <input type="number" min={0} max={100} step={0.5} value={rule.percentage} onChange={(e) => handleRuleChange(idx, 'percentage', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeRule(idx)} className="text-sm text-red-600">Remover</button>
                    </div>
                  </div>
                ))}
              </div>
              {errors['progressiveRules'] && (
                <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors['progressiveRules']}</p>
              )}
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                <input type="datetime-local" value={form.startAt ? toLocalInput(form.startAt) : ''} onChange={(e) => updateField('startAt', e.target.value ? new Date(e.target.value).toISOString() : undefined)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Término</label>
                <input type="datetime-local" value={form.endAt ? toLocalInput(form.endAt) : ''} onChange={(e) => updateField('endAt', e.target.value ? new Date(e.target.value).toISOString() : undefined)} className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                {errors.endAt && (
                  <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.endAt}</p>
                )}
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Promocional</label>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600">Variáveis:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">%OFF%</code>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">%START_DATE%</code>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">%END_DATE%</code>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">%DAYS_LEFT%</code>
              </div>
              <ReactQuill theme="snow" value={form.messageTemplate || ''} onChange={(val) => updateField('messageTemplate', val)} />
              {errors.messageTemplate && (
                <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.messageTemplate}</p>
              )}
            </div>

            {/* Cor de destaque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor de destaque</label>
              <input type="color" value={form.highlightColor || '#f472b6'} onChange={(e) => updateField('highlightColor', e.target.value)} />
            </div>

            {/* Layout do Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Exibir condições da promoção</label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.bannerShowConditions ?? true} onChange={(e) => updateField('bannerShowConditions', e.target.checked)} />
                  Mostrar condições (global e progressivas)
                </label>
                <label className="block text-sm font-medium text-gray-700">Posição das condições</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerConditionsPosition ?? 'below'} onChange={(e) => updateField('bannerConditionsPosition', e.target.value as any)}>
                  <option value="above">Acima da mensagem</option>
                  <option value="below">Abaixo da mensagem</option>
                </select>
                <label className="block text-sm font-medium text-gray-700">Estilo das condições</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerConditionsStyle ?? 'bullets'} onChange={(e) => updateField('bannerConditionsStyle', e.target.value as any)}>
                  <option value="bullets">Marcadores</option>
                  <option value="lines">Linhas</option>
                </select>
              </div>
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Exibir contador</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.bannerShowCountdown ?? true} onChange={(e) => updateField('bannerShowCountdown', e.target.checked)} />
                Mostrar contador de término
              </label>
              <label className="block text-sm font-medium text-gray-700">Posição do contador</label>
              <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerCountdownPosition ?? 'below'} onChange={(e) => updateField('bannerCountdownPosition', e.target.value as any)}>
                <option value="above">Acima da mensagem</option>
                <option value="below">Abaixo da mensagem</option>
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fundo do contador</label>
                  <input type="color" value={form.bannerCountdownBgColor || '#fff3cd'} onChange={(e) => updateField('bannerCountdownBgColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cor do texto do contador</label>
                  <input type="color" value={form.bannerCountdownTextColor || '#b45309'} onChange={(e) => updateField('bannerCountdownTextColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tamanho do contador</label>
                  <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerCountdownSize || 'md'} onChange={(e) => updateField('bannerCountdownSize', e.target.value as any)}>
                    <option value="sm">Pequeno</option>
                    <option value="md">Médio</option>
                    <option value="lg">Grande</option>
                  </select>
                </div>
              </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Alinhamento</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerAlignment ?? 'center'} onChange={(e) => updateField('bannerAlignment', e.target.value as any)}>
                  <option value="center">Centralizado</option>
                  <option value="left">Esquerda</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Título do banner</label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.bannerShowTitle ?? true} onChange={(e) => updateField('bannerShowTitle', e.target.checked)} />
                  Mostrar título
                </label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerTitle ?? ''} onChange={(e) => updateField('bannerTitle', e.target.value)} placeholder="Ex.: ✨ PROMOÇÃO ESPECIAL ✨" />
                <label className="block text-sm font-medium text-gray-700">Posição do título</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerTitlePosition ?? 'above'} onChange={(e) => updateField('bannerTitlePosition', e.target.value as any)}>
                  <option value="above">Acima da mensagem</option>
                  <option value="below">Abaixo da mensagem</option>
                </select>
                <label className="block text-sm font-medium text-gray-700">Fonte do título</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerTitleFont ?? 'handwritten'} onChange={(e) => updateField('bannerTitleFont', e.target.value as any)}>
                  <option value="handwritten">Escrita à mão (Caveat)</option>
                  <option value="kawaii">Kawaii (Mali)</option>
                  <option value="sans">Sans</option>
                  <option value="serif">Serif</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Fonte da mensagem</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerMessageFont ?? 'kawaii'} onChange={(e) => updateField('bannerMessageFont', e.target.value as any)}>
                  <option value="handwritten">Escrita à mão (Caveat)</option>
                  <option value="kawaii">Kawaii (Mali)</option>
                  <option value="sans">Sans</option>
                  <option value="serif">Serif</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Espaçamento do banner</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerDensity ?? 'spacious'} onChange={(e) => updateField('bannerDensity', e.target.value as any)}>
                  <option value="compact">Compacto</option>
                  <option value="spacious">Espaçado</option>
                </select>
                <label className="block text-sm font-medium text-gray-700">Borda do banner</label>
                <select className="px-3 py-2 rounded-lg border-2 border-gray-200" value={form.bannerBorderStyle ?? 'subtle'} onChange={(e) => updateField('bannerBorderStyle', e.target.value as any)}>
                  <option value="subtle">Suave</option>
                  <option value="solid">Sólida</option>
                  <option value="none">Sem borda</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Cores específicas do banner</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cor do título</label>
                    <input type="color" value={form.bannerTitleColor || '#f472b6'} onChange={(e) => updateField('bannerTitleColor', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cor das condições</label>
                    <input type="color" value={form.bannerConditionsColor || '#f472b6'} onChange={(e) => updateField('bannerConditionsColor', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cor do desconto global</label>
                    <input type="color" value={form.bannerGlobalColor || '#f472b6'} onChange={(e) => updateField('bannerGlobalColor', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cor das regras progressivas</label>
                    <input type="color" value={form.bannerProgressiveColor || '#f472b6'} onChange={(e) => updateField('bannerProgressiveColor', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <button onClick={validateAndSave} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Salvar promoção</button>
              <button onClick={disablePromotion} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Desativar</button>
            </div>
          </div>
        </div>

        {/* Pré-visualização */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 lg:sticky lg:top-4 lg:max-h-[80vh] lg:overflow-auto">
          <div className="space-y-3">
            <div className={`rounded-lg p-3 border ${active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  {active ? 'Promoção ativa' : 'Promoção inativa'}
                </span>
                {form.endAt && (
                  <span className="ml-auto text-xs text-gray-600">Termina em {new Date(form.endAt).toLocaleString('pt-BR')}</span>
                )}
              </div>
            </div>

            {/* Prévia real do banner */}
            <PromotionBannerContent promotion={{
              enabled: form.enabled,
              globalPercentage: form.globalPercentage,
              progressiveRules: form.progressiveRules,
              startAt: form.startAt,
              endAt: form.endAt,
              messageTemplate: form.messageTemplate,
              highlightColor: form.highlightColor,
              bannerShowConditions: form.bannerShowConditions,
              bannerConditionsPosition: form.bannerConditionsPosition,
              bannerShowCountdown: form.bannerShowCountdown,
              bannerCountdownPosition: form.bannerCountdownPosition,
              bannerAlignment: form.bannerAlignment,
              bannerShowTitle: form.bannerShowTitle,
              bannerTitle: form.bannerTitle,
              bannerTitlePosition: form.bannerTitlePosition,
              bannerConditionsStyle: form.bannerConditionsStyle,
              bannerDensity: form.bannerDensity,
              bannerBorderStyle: form.bannerBorderStyle,
              bannerTitleFont: form.bannerTitleFont,
              bannerMessageFont: form.bannerMessageFont,
              bannerTitleColor: form.bannerTitleColor,
              bannerConditionsColor: form.bannerConditionsColor,
              bannerGlobalColor: form.bannerGlobalColor,
              bannerProgressiveColor: form.bannerProgressiveColor,
              bannerCountdownBgColor: form.bannerCountdownBgColor,
              bannerCountdownTextColor: form.bannerCountdownTextColor,
              bannerCountdownSize: form.bannerCountdownSize,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default PromotionSettings;