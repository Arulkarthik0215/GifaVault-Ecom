import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
import heroImage from '@/assets/hero-collectibles.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="GIFA Vault Collectibles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold font-sans text-sm tracking-wider uppercase mb-4"
          >
            Welcome to GIFA Vault
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-foreground drop-shadow-md"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            Curated Collectibles
            <br />
            for the Modern
            <br />
            Enthusiast
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            Discover rare Hot Wheels, premium die-cast models, and exclusive 
            sets. Each piece in our vault is hand-selected for true collectors.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-sans text-sm tracking-wide hover:opacity-90 transition-opacity group"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="https://instagram.com/gifavault"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-8 py-4 rounded-full font-sans text-sm tracking-wide hover:bg-secondary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              Follow Us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
