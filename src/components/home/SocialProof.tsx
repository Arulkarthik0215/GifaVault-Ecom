import { motion } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';

export const SocialProof = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Instagram className="w-12 h-12 text-gold mx-auto mb-6" />
          
          <h2 className="section-heading mb-4">
            Follow Our Journey
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Join our community of jewellery lovers. Get exclusive previews, 
            styling tips, and behind-the-scenes content.
          </p>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <Instagram className="w-4 h-4" />
            @gifavault
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-serif text-gold mb-2">500+</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-gold mb-2">100%</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Authentic Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-gold mb-2">24/7</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Customer Support</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-gold mb-2">Worldwide</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Shipping Available</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
