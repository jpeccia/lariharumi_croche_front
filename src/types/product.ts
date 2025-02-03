export interface Product {
  categoryId: number;
  ID: number;
  name: string;
  image: string;
  category: string;
  priceRange: string;
  description: string;
}

export interface Category {
  ID: number;
  name: string;
  description: string;
  image: string;
}