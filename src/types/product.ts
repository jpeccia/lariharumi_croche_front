export interface Product {
  categoryId: number;
  ID: number;
  name: string;
  images: string;
  category: string;
  priceRange: string;
  description: string;
  // Campos de soft delete
  deletedAt?: string;
  isDeleted?: boolean;
  // Campos de auditoria
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  ID: number;
  name: string;
  description: string;
  image: string;
  // Campos de soft delete
  deletedAt?: string;
  isDeleted?: boolean;
  // Campos de auditoria
  createdAt?: string;
  updatedAt?: string;
}