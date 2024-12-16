export interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  priceRange: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}