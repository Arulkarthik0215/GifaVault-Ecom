import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Hot Wheels', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80', href: '/products?category=hotwheels' },
  { name: 'Premium', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80', href: '/products?category=premium' },
  { name: 'Sets', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', href: '/products?category=sets' },
  { name: 'Matchbox', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80', href: '/products?category=matchbox' },
];

export const Categories = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-medium text-xs sm:text-sm tracking-widest uppercase mb-3"
          >
            Browse By Category
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Outfit'] text-3xl sm:text-4xl font-semibold text-foreground tracking-tight"
          >
            Explore Our Collection
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content - Always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="font-['Outfit'] text-white text-lg sm:text-xl font-semibold tracking-tight mb-1">
                    {category.name}
                  </h3>

                  {/* Explore text - Always visible like reference */}
                  <div className="flex items-center gap-1 text-white/80 text-sm group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
