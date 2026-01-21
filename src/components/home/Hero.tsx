import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-collectibles.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="GIFA Vault Collectibles"
          className="w-full h-full object-cover scale-105"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

        {/* Subtle gold shimmer overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_70%_50%,_hsl(38_80%_50%_/_0.3)_0%,_transparent_60%)]" />
      </div>

      {/* Decorative Elements - hidden on mobile */}
      <div className="absolute top-1/4 left-4 lg:left-10 w-px h-16 lg:h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden md:block" />
      <div className="absolute bottom-1/4 right-4 lg:right-10 w-px h-16 lg:h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden md:block" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold animate-pulse" />
            <span className="text-gold font-sans text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase">
              Welcome to GIFA Vault
            </span>
          </motion.div>

          {/* Main Heading - Responsive typography */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-6 sm:mb-8 text-foreground tracking-tight"
          >
            <span className="block">Curated Collectibles</span>
            <span className="block mt-1 sm:mt-2">
              for the <span className="italic text-gold">Modern</span>
            </span>
            <span className="block mt-1 sm:mt-2">Enthusiast</span>
          </motion.h1>

          {/* Description - Responsive text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-sans font-light leading-relaxed mb-8 sm:mb-12 max-w-xl"
          >
            Discover rare Hot Wheels, premium die-cast models, and exclusive
            sets. Each piece in our vault is hand-selected for true collectors.
          </motion.p>

          {/* CTA Buttons - Rounded full like reference */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5"
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center sm:justify-start gap-3 px-8 sm:px-10 py-4 rounded-full overflow-hidden transition-all duration-500 bg-foreground hover:bg-foreground/90"
            >
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-background">
                Explore Collection
              </span>
              <ArrowRight className="relative w-4 h-4 text-background transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href="https://instagram.com/gifavault"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center sm:justify-start gap-3 px-8 sm:px-10 py-4 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/20 text-foreground font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-400 hover:border-gold hover:text-gold"
            >
              <Instagram className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              Follow Us
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
