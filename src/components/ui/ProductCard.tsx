import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="product-card block group">
        {/* Image Container */}
        <div className="aspect-square bg-champagne overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.new && (
              <span className="px-3 py-1 bg-gold text-primary-foreground text-xs font-sans tracking-wider uppercase">
                New
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1 bg-foreground text-background text-xs font-sans tracking-wider uppercase">
                Featured
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background px-6 py-2 text-sm font-sans tracking-wider uppercase">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-serif text-lg font-medium mb-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground font-sans">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
