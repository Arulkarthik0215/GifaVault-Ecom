import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';

export const FeaturedProducts = () => {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-gradient-to-b from-background via-champagne/30 to-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Subtle corner decorations - hidden on mobile */}
      <div className="absolute top-16 left-16 lg:top-20 lg:left-20 w-16 lg:w-24 h-16 lg:h-24 border-l border-t border-gold/10 hidden lg:block rounded-tl-3xl" />
      <div className="absolute bottom-16 right-16 lg:bottom-20 lg:right-20 w-16 lg:w-24 h-16 lg:h-24 border-r border-b border-gold/10 hidden lg:block rounded-br-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
              <span className="section-subheading text-gold text-xs sm:text-sm">Featured</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
            >
              Top Picks from <span className="italic text-gold">The Vault</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden sm:block"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-medium tracking-wider uppercase transition-colors duration-400 hover:text-gold underline-animation"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile View All Link - Rounded full */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 sm:hidden"
        >
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 border border-foreground/20 font-sans text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-400 hover:border-gold hover:text-gold rounded-full"
          >
            View All Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
