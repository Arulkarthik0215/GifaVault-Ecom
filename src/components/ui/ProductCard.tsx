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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden mb-4 rounded-xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Featured Badge */}
          {product.featured && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-gold text-white rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
            {getCategoryLabel(product.category)}
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
