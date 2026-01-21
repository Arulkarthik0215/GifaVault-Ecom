import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product, getCategoryLabel } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container - Rounded corners */}
        <div className="relative aspect-square bg-champagne overflow-hidden mb-5 rounded-2xl sm:rounded-3xl">
          {/* Gold border accent on hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 transition-colors duration-500 z-10 rounded-2xl sm:rounded-3xl" />

          {/* Image with zoom effect */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110"
          />

          {/* Luxury overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

          {/* Featured Badge - Rounded */}
          {product.featured && (
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 sm:px-4 py-1.5 text-xs font-sans font-semibold tracking-[0.1em] sm:tracking-[0.15em] uppercase z-20 rounded-full bg-gold text-white">
              Featured
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs font-sans text-muted-foreground tracking-[0.2em] uppercase">
            {getCategoryLabel(product.category)}
          </p>

          {/* Product Name */}
          <h3 className={`font-display text-xl font-medium transition-colors duration-400 ${product.new
              ? 'text-gold'
              : 'text-foreground group-hover:text-gold'
            }`}>
            {product.name}
          </h3>

          {/* Price with elegant styling */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-sans font-semibold text-foreground tracking-wide">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {/* Decorative line */}
            <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
