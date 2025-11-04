import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PromotionState, Promotion, getApplicableDiscount, applyDiscount, isPromotionActive } from '../types/promotion';

interface PromotionStore {
  promotion: PromotionState | null;
  setPromotion: (promotion: Promotion) => void;
  clearPromotion: () => void;
  isActive: () => boolean;
  getDiscountPercentage: (orderTotal: number) => number;
  getDiscountedPrice: (price: number, orderTotal?: number) => number;
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
    }),
    {
      name: 'promotion-storage',
      partialize: (state) => ({ promotion: state.promotion }),
      version: 1,
    }
  )
);