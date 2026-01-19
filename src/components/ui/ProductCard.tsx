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
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        {/* Image Container */}
        <div className="aspect-square bg-secondary overflow-hidden relative rounded-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badge */}
          {product.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-primary-foreground text-xs font-sans font-medium rounded">
              Featured
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4">
          <p className="text-xs font-sans text-muted-foreground tracking-wider uppercase mb-1">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className={`font-serif text-lg font-medium mb-1 transition-colors ${product.new ? 'text-gold' : 'text-foreground group-hover:text-gold'}`}>
            {product.name}
          </h3>
          <p className="text-foreground font-sans font-medium">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
