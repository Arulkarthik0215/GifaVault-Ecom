import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/supabase';

// Category label helper
const categoryLabels: Record<string, string> = {
  hotwheels: 'HOT WHEELS',
  premium: 'PREMIUM',
  sets: 'SETS',
  matchbox: 'MATCHBOX',
};

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden mb-4 rounded-xl">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-gold text-white rounded-full">
              Featured
            </span>
          )}

          {/* Out of Stock Overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground bg-background/80 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
            {categoryLabels[product.category] || product.category.toUpperCase()}
          </p>

          <h3 className={`font-['Outfit'] font-semibold tracking-tight mb-1 transition-colors ${product.new
            ? 'text-gold'
            : 'text-foreground group-hover:text-gold'
            }`}>
            {product.name}
          </h3>

          <p className="font-['Outfit'] font-semibold text-foreground">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
