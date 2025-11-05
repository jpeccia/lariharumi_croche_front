import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromotionState, Promotion, getApplicableDiscount, applyDiscount, isPromotionActive } from '../types/promotion';
import { promotionSchema } from '../schemas/promotionSchema';

interface PromotionStore {
  promotion: PromotionState | null;
  setPromotion: (promotion: Promotion) => void;
  clearPromotion: () => void;
  isActive: () => boolean;
  getDiscountPercentage: (orderTotal: number) => number;
  getDiscountedPrice: (price: number, orderTotal?: number) => number;
  initializeFromPublic: () => Promise<void>;
}

export const usePromotionStore = create<PromotionStore>()(
  persist(
    (set, get) => ({
      promotion: null,
      setPromotion: (promotion: Promotion) => {
        const updated: PromotionState = {
          ...promotion,
          updatedAt: new Date().toISOString(),
        };
        set({ promotion: updated });
      },
      clearPromotion: () => set({ promotion: null }),
      isActive: () => {
        const promo = get().promotion;
        return isPromotionActive(promo || undefined);
      },
      getDiscountPercentage: (orderTotal: number) => {
        const promo = get().promotion;
        return getApplicableDiscount(promo || undefined, orderTotal);
      },
      getDiscountedPrice: (price: number, orderTotal: number = price) => {
        const pct = get().getDiscountPercentage(orderTotal);
        return applyDiscount(price, pct);
      },
      initializeFromPublic: async () => {
        try {
          // Se já existe promoção persistida, não precisa inicializar
          if (get().promotion) return;

          const res = await fetch('/promotion.json', { cache: 'no-cache' });
          if (!res.ok) return;
          const data = await res.json();
          // Validar estrutura básica com Zod (permitindo campos opcionais)
          const parsed = promotionSchema.safeParse(data);
          if (!parsed.success) return;
          const cleaned: Promotion = parsed.data as Promotion;
          set({ promotion: { ...cleaned, updatedAt: new Date().toISOString() } });
        } catch (e) {
          // Silenciar erros (arquivo pode não existir em alguns ambientes)
        }
      },
    }),
    {
      name: 'promotion-storage',
      partialize: (state) => ({ promotion: state.promotion }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Após rehidratar, se não houver promoção, tenta carregar do arquivo público
        if (!state?.promotion) {
          // Chama de forma assíncrona para não bloquear
          setTimeout(() => {
            // Evitar exceções se a store ainda não estiver montada
            try {
              // @ts-ignore - chamar método da store
              usePromotionStore.getState().initializeFromPublic();
            } catch {}
          }, 0);
        }
      },
    }
  )
);