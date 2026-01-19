import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

export const SocialProof = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 border-2 border-background rounded-xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic mb-4">
            Join Our Community
          </h2>
          
          <p className="text-background/70 mb-8 text-lg">
            Follow us on Instagram for new arrivals, behind-the-scenes 
            content, and exclusive drops.
          </p>
          
          <a
            href="https://instagram.com/gifavault"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-sans text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-4 h-4" />
            @gifavault
          </a>
        </motion.div>
      </div>
    </section>
  );
};
