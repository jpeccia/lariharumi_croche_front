export interface Product {
  categoryId: number;
  id: number;
  name: string;
  image: string;
  category: Category; // Aqui estamos garantindo que category é um objeto
  priceRange: string;
  description: string;
  
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}