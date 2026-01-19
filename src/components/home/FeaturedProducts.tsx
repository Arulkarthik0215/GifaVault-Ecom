import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const FeaturedProducts = () => {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold font-sans text-sm tracking-wider uppercase mb-3"
            >
              Featured
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-serif font-bold"
            >
              Top Picks from The Vault
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-sans hover:text-gold transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:hidden"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-sans hover:text-gold transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
