import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para produto
export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  priceRange: z.string().min(1, 'Faixa de preço é obrigatória'),
  categoryId: z.number().min(1, 'Categoria é obrigatória'),
  images: z.array(z.instanceof(File)).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema para categoria
export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição muito longa'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Schema para upload de imagem
export const imageUploadSchema = z.object({
  file: z.instanceof(File, 'Arquivo inválido'),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
}).refine(
  (data) => data.file.size <= data.maxSize,
  { message: 'Arquivo muito grande (máximo 5MB)' }
).refine(
  (data) => data.allowedTypes.includes(data.file.type),
  { message: 'Tipo de arquivo não suportado' }
);

export type ImageUploadData = z.infer<typeof imageUploadSchema>;
