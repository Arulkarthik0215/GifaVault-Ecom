export type ProductCategory = 'rings' | 'chains' | 'bracelets' | 'earrings' | 'pendants' | 'sets';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
  images: string[];
  featured?: boolean;
  new?: boolean;
}

export const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Pieces' },
  { value: 'rings', label: 'Rings' },
  { value: 'chains', label: 'Chains' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'pendants', label: 'Pendants' },
  { value: 'sets', label: 'Sets' },
];

export const products: Product[] = [
  {
    id: 'eternity-band',
    name: 'Eternity Band',
    price: 245,
    category: 'rings',
    description: 'A timeless symbol of endless love. This elegant eternity band features a continuous line of brilliant stones set in premium gold, perfect for celebrating lifes most precious moments.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'cuban-link-chain',
    name: 'Cuban Link Chain',
    price: 389,
    category: 'chains',
    description: 'Bold yet refined, our Cuban link chain makes a statement. Crafted with interlocking links that catch the light beautifully, this piece transitions seamlessly from day to night.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'serpent-bracelet',
    name: 'Serpent Bracelet',
    price: 275,
    category: 'bracelets',
    description: 'Inspired by ancient mythology, this serpent bracelet wraps elegantly around your wrist. A symbol of transformation and eternal renewal.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'drop-earrings',
    name: 'Celestial Drop Earrings',
    price: 189,
    category: 'earrings',
    description: 'Delicate drops that move with grace. These celestial-inspired earrings add a touch of ethereal beauty to any ensemble.',
    images: ['/placeholder.svg'],
    new: true,
  },
  {
    id: 'signet-ring',
    name: 'Classic Signet Ring',
    price: 195,
    category: 'rings',
    description: 'A modern take on the classic signet ring. Clean lines and substantial weight make this piece a daily essential.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'rope-chain',
    name: 'Rope Chain Necklace',
    price: 320,
    category: 'chains',
    description: 'The twisted design of our rope chain creates a beautiful play of light. Versatile enough to wear alone or layered.',
    images: ['/placeholder.svg'],
    new: true,
  },
  {
    id: 'tennis-bracelet',
    name: 'Tennis Bracelet',
    price: 425,
    category: 'bracelets',
    description: 'Timeless elegance defined. This tennis bracelet features a continuous line of stones for maximum sparkle.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'heart-pendant',
    name: 'Heart Pendant',
    price: 165,
    category: 'pendants',
    description: 'A symbol of love, beautifully crafted. This heart pendant sits perfectly at the collarbone.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'stacking-rings-set',
    name: 'Stacking Rings Set',
    price: 285,
    category: 'sets',
    description: 'Three complementary rings designed to be worn together or separately. Mix, match, and express your style.',
    images: ['/placeholder.svg'],
    new: true,
  },
  {
    id: 'huggie-hoops',
    name: 'Huggie Hoop Earrings',
    price: 145,
    category: 'earrings',
    description: 'Small but mighty. These huggie hoops sit close to the ear for effortless everyday elegance.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'layering-set',
    name: 'Layering Necklace Set',
    price: 395,
    category: 'sets',
    description: 'Three necklaces at different lengths, designed to be layered for a curated look. Includes a choker, pendant, and chain.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'coin-pendant',
    name: 'Coin Pendant',
    price: 175,
    category: 'pendants',
    description: 'Inspired by ancient coins, this pendant carries a sense of history and mystery. A conversation starter.',
    images: ['/placeholder.svg'],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: ProductCategory | 'all'): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.new);
};
