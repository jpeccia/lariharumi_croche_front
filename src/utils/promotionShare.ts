import { Promotion } from '../types/promotion';

export function encodePromotion(promo: Promotion): string {
  try {
    const json = JSON.stringify(promo);
    return encodeURIComponent(json);
  } catch {
    return '';
  }
}

export function decodePromotion(encoded: string): Promotion | null {
  try {
    const json = decodeURIComponent(encoded);
    return JSON.parse(json) as Promotion;
  } catch {
    return null;
  }
}