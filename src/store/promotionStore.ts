import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromotionState, Promotion, getApplicableDiscount, applyDiscount, isPromotionActive } from '../types/promotion';
import { publicApi } from '../services/api';

interface PromotionStore {
  promotion: PromotionState | null;
  setPromotion: (promotion: Promotion) => void;
  clearPromotion: () => void;
  isActive: () => boolean;
  getDiscountPercentage: (orderTotal: number) => number;
  getDiscountedPrice: (price: number, orderTotal?: number) => number;
  hydrateFromServer: () => Promise<void>;
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
      hydrateFromServer: async () => {
        try {
          const remote = await publicApi.getActivePromotion();
          if (!remote) return;
          // Se o remoto está ativo e é mais recente que o local, atualiza
          const local = get().promotion;
          const remoteUpdated = (remote.updatedAt && new Date(remote.updatedAt).getTime()) || 0;
          const localUpdated = (local?.updatedAt && new Date(local.updatedAt).getTime()) || 0;
          const remoteActive = isPromotionActive(remote);
          if (remoteActive && remoteUpdated >= localUpdated) {
            set({ promotion: { ...remote, updatedAt: new Date().toISOString() } });
          }
        } catch (err) {
          // Falha silenciosa para não quebrar o cliente
          console.warn('Falha ao hidratar promoção do servidor:', err);
        }
      },
    }),
    {
      name: 'promotion-storage',
      partialize: (state) => ({ promotion: state.promotion }),
      version: 1,
      // Após reidratar do storage local, tenta hidratar do servidor
      onRehydrateStorage: () => {
        return (state) => {
          try {
            // Chama fora do ciclo de renderização
            setTimeout(() => {
              usePromotionStore.getState().hydrateFromServer();
            }, 0);
          } catch (e) {
            console.warn('onRehydrateStorage promoção: falha ao agendar hidratação', e);
          }
        };
      },
    }
  )
);