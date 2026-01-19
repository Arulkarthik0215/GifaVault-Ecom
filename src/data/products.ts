export type ProductCategory = 'hotwheels' | 'premium' | 'sets' | 'matchbox';

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
  { value: 'all', label: 'All' },
  { value: 'hotwheels', label: 'Hot Wheels' },
  { value: 'premium', label: 'Premium' },
  { value: 'sets', label: 'Sets' },
  { value: 'matchbox', label: 'Matchbox' },
];

export const getCategoryLabel = (category: ProductCategory): string => {
  const cat = categories.find(c => c.value === category);
  return cat ? cat.label.toUpperCase() : category.toUpperCase();
};

export const products: Product[] = [
  {
    id: '1970-dodge-charger',
    name: '1970 Dodge Charger R/T',
    price: 599,
    category: 'hotwheels',
    description: 'Iconic American muscle car in stunning detail. The 1970 Dodge Charger R/T is a must-have for any serious collector. Features authentic detailing and premium finish.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'tesla-roadster',
    name: 'Tesla Roadster',
    price: 449,
    category: 'hotwheels',
    description: 'The future of automotive excellence in die-cast form. This Tesla Roadster captures the sleek lines and innovative spirit of the original.',
    images: ['/placeholder.svg'],
    featured: true,
    new: true,
  },
  {
    id: 'porsche-911-gt3',
    name: 'Porsche 911 GT3 RS',
    price: 1299,
    category: 'premium',
    description: 'Premium collection piece featuring the legendary Porsche 911 GT3 RS. Exceptional craftsmanship with moving parts and detailed interior.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'muscle-car-collection',
    name: 'Muscle Car Collection',
    price: 2499,
    category: 'sets',
    description: 'Complete set of 5 classic American muscle cars. Includes Mustang, Camaro, Challenger, Charger, and Corvette. Limited edition packaging.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'lamborghini-aventador',
    name: 'Lamborghini Aventador',
    price: 899,
    category: 'premium',
    description: 'Italian supercar excellence captured in premium die-cast. Features opening doors and detailed V12 engine.',
    images: ['/placeholder.svg'],
    new: true,
  },
  {
    id: 'ford-mustang-gt',
    name: 'Ford Mustang GT',
    price: 549,
    category: 'hotwheels',
    description: 'Classic American pony car with iconic styling. This Ford Mustang GT showcases the timeless design that made it a legend.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'jdm-legends-set',
    name: 'JDM Legends Set',
    price: 1899,
    category: 'sets',
    description: 'Collection of 4 iconic Japanese cars - Skyline GT-R, Supra, RX-7, and NSX. Perfect for JDM enthusiasts.',
    images: ['/placeholder.svg'],
    new: true,
  },
  {
    id: 'ferrari-f40',
    name: 'Ferrari F40',
    price: 1499,
    category: 'premium',
    description: 'The legendary Ferrari F40 in stunning detail. One of the most iconic supercars ever made, now in your collection.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'land-rover-defender',
    name: 'Land Rover Defender',
    price: 399,
    category: 'matchbox',
    description: 'Classic British off-roader with rugged styling. Perfect recreation of the iconic Defender.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'chevy-camaro-ss',
    name: 'Chevy Camaro SS',
    price: 579,
    category: 'hotwheels',
    description: 'Modern muscle meets classic heritage. The Camaro SS in Hot Wheels form captures the aggressive styling perfectly.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'fire-rescue-set',
    name: 'Fire Rescue Set',
    price: 799,
    category: 'matchbox',
    description: 'Complete fire rescue team including fire engine, ambulance, and rescue truck. Great for young collectors.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'mclaren-p1',
    name: 'McLaren P1',
    price: 1399,
    category: 'premium',
    description: 'Hypercar excellence from McLaren. The P1 in premium die-cast with exceptional attention to detail.',
    images: ['/placeholder.svg'],
    featured: true,
  },
  {
    id: 'volkswagen-beetle',
    name: 'Volkswagen Beetle',
    price: 349,
    category: 'matchbox',
    description: 'The peoples car in classic form. This VW Beetle captures the charm of the original design.',
    images: ['/placeholder.svg'],
  },
  {
    id: 'supercar-collection',
    name: 'Supercar Collection',
    price: 3499,
    category: 'sets',
    description: 'Ultimate supercar set featuring Ferrari, Lamborghini, Porsche, McLaren, and Bugatti. Premium packaging and display case included.',
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
