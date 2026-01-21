import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import productRing from '@/assets/product-ring.jpg';
import productChain from '@/assets/product-chain.jpg';
import productBracelet from '@/assets/product-bracelet.jpg';
import productEarrings from '@/assets/product-earrings.jpg';

const categories = [
  { name: 'Hot Wheels', image: productRing, href: '/products?category=hotwheels' },
  { name: 'Premium', image: productChain, href: '/products?category=premium' },
  { name: 'Sets', image: productBracelet, href: '/products?category=sets' },
  { name: 'Matchbox', image: productEarrings, href: '/products?category=matchbox' },
];

export const Categories = () => {
  return (
    <section className="py-16 sm:py-20 md:py-28 lg:py-36 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Corner ornaments - hidden on mobile/tablet */}
      <div className="absolute top-12 left-12 lg:top-16 lg:left-16 w-12 h-12 lg:w-20 lg:h-20 border-l border-t border-gold/10 hidden lg:block" />
      <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-16 w-12 h-12 lg:w-20 lg:h-20 border-r border-b border-gold/10 hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4"
          >
            <span className="w-6 sm:w-12 h-px bg-gradient-to-r from-transparent to-gold/50 hidden sm:block" />
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
            <span className="section-subheading text-gold text-xs sm:text-sm">Browse By Category</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
            <span className="w-6 sm:w-12 h-px bg-gradient-to-l from-transparent to-gold/50 hidden sm:block" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
          >
            Explore Our <span className="italic text-gold">Collection</span>
          </motion.h2>
        </div>

        {/* Categories Grid - 2 columns on mobile, 4 on larger screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
            >
              <Link
                to={category.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/40 transition-colors duration-500 rounded-2xl sm:rounded-3xl" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8">
                  <h3 className="font-display text-lg sm:text-2xl md:text-3xl text-white font-medium mb-1 sm:mb-2 transition-transform duration-500 group-hover:translate-x-1 sm:group-hover:translate-x-2">
                    {category.name}
                  </h3>

                  {/* Explore text - responsive */}
                  <div className="flex items-center gap-1 sm:gap-2 opacity-0 translate-y-2 sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-gold text-xs sm:text-sm font-sans tracking-wider uppercase">Explore</span>
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
