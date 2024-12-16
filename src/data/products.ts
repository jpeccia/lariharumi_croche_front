import { Product, Category } from '../types/product';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Amigurumis',
    description: 'Bichinhos de crochê fofos e personalizáveis',
    image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'Xales e Mantas',
    description: 'Peças delicadas para aquecer com estilo',
    image: 'https://images.unsplash.com/photo-1594128618672-f71765d6f2d1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'Decoração',
    description: 'Itens para deixar sua casa mais aconchegante',
    image: 'https://images.unsplash.com/photo-1580746738099-6c290dfd0a70?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'Pelúcias',
    description: '',
    image: 'https://images.unsplash.com/photo-1580746738099-6c290dfd0a70?auto=format&fit=crop&q=80&w=400'
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Coelho Amigurumi',
    image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&q=80&w=400',
    category: 'Amigurumis',
    priceRange: 'R$ 80 - R$ 120',
    description: 'Coelhinho fofo feito com muito carinho, personalização de cores disponível'
  },
  {
    id: 2,
    name: 'Xale Primavera',
    image: 'https://images.unsplash.com/photo-1594128618672-f71765d6f2d1?auto=format&fit=crop&q=80&w=400',
    category: 'Xales e Mantas',
    priceRange: 'R$ 150 - R$ 200',
    description: 'Xale delicado em ponto floral, perfeito para dias frescos'
  },
  {
    id: 3,
    name: 'Centro de Mesa',
    image: 'https://images.unsplash.com/photo-1580746738099-6c290dfd0a70?auto=format&fit=crop&q=80&w=400',
    category: 'Decoração',
    priceRange: 'R$ 60 - R$ 100',
    description: 'Centro de mesa em crochê, diversos tamanhos disponíveis'
  }
];
