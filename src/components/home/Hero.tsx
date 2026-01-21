import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';
import heroImage from '@/assets/hero-collectibles.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="GIFA Vault Collectibles"
          className="w-full h-full object-cover"
        />
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 sm:pt-12">
        <div className="max-w-xl">
          {/* Welcome Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6"
          >
            Welcome to GIFA Vault
          </motion.p>

          {/* Main Heading - Exact line breaks like reference */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-tight mb-4 sm:mb-6"
          >
            Curated Collectibles
            <br />
            for the Modern
            <br />
            Enthusiast
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
          >
            Discover rare Hot Wheels, premium die-cast models, and exclusive
            sets. Each piece in our vault is hand-selected for true collectors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://instagram.com/gifavault"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-background border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
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
