import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import productRing from '@/assets/product-ring.jpg';
import productChain from '@/assets/product-chain.jpg';
import productBracelet from '@/assets/product-bracelet.jpg';
import productEarrings from '@/assets/product-earrings.jpg';

const categories = [
  { name: 'Rings', image: productRing, href: '/products?category=rings' },
  { name: 'Chains', image: productChain, href: '/products?category=chains' },
  { name: 'Bracelets', image: productBracelet, href: '/products?category=bracelets' },
  { name: 'Earrings', image: productEarrings, href: '/products?category=earrings' },
];

export const Categories = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-subheading mb-3"
          >
            Browse By Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading"
          >
            Shop Our Collections
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                className="block group relative aspect-square overflow-hidden bg-champagne"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-background font-medium">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
