import { motion } from 'framer-motion';
import { Sparkles, Shield, Truck, Heart } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Each piece is crafted with the finest materials and meticulous attention to detail.',
  },
  {
    icon: Shield,
    title: 'Authenticity Guaranteed',
    description: 'Every item comes with a certificate of authenticity and quality assurance.',
  },
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'We deliver to your doorstep with secure, insured shipping worldwide.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Our curators pour passion into every pick, sourcing die-cast collectibles that tell stories.',
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-champagne">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-subheading mb-3"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-heading mb-6"
            >
              Welcome to <span className="text-gold">GIFA Vault</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed mb-6"
            >
              GIFA Vault is your destination for premium Hot Wheels and die-cast collectibles that celebrate
              the thrill of collecting. We believe a great find is more than just a toy—
              it's a piece of culture, nostalgia, and passion.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              Our curated collection features timeless designs crafted with exceptional
              quality, ensuring each piece becomes a cherished treasure for generations
              to come.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-6 shadow-soft"
              >
                <feature.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-serif text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
