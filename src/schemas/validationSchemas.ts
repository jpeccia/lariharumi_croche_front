import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Schema para produtos
export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').max(500, 'Descrição muito longa'),
  price: z.union([
    z.string().min(1, 'Preço é obrigatório'),
    z.number().min(0, 'Preço deve ser positivo')
  ]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      if (isNaN(num)) throw new Error('Preço inválido');
      return num;
    }
    return val;
  }),
  categoryId: z.union([
    z.string().min(1, 'Categoria é obrigatória'),
    z.number().min(1, 'Categoria é obrigatória')
  ]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val);
      if (isNaN(num)) throw new Error('Categoria inválida');
      return num;
    }
    return val;
  }),
  images: z.array(z.instanceof(File)).optional(),
});

// Schema para categorias
export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres').max(200, 'Descrição muito longa'),
});

// Schema para upload de imagens
export const imageUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'Pelo menos uma imagem é obrigatória').max(5, 'Máximo 5 imagens'),
});

// Tipos derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;

// Validação de URL de imagem
export const imageUrlSchema = z.string().url('URL de imagem inválida');

// Validação de ID numérico
export const idSchema = z.number().int().positive('ID deve ser um número positivo');

// Schema para filtros de produtos
export const productFilterSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
