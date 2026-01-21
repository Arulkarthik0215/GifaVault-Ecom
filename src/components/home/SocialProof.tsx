import { motion } from 'framer-motion';
import { Instagram, Star } from 'lucide-react';

export const SocialProof = () => {
  return (
    <section className="relative py-20 sm:py-28 md:py-32 lg:py-40 overflow-hidden gradient-dark-luxury">
      {/* Decorative gold accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Corner ornaments - hidden on mobile */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-12 w-16 h-16 lg:w-32 lg:h-32 border-l border-t border-gold/20 hidden md:block rounded-tl-3xl" />
      <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 w-16 h-16 lg:w-32 lg:h-32 border-r border-b border-gold/20 hidden md:block rounded-br-3xl" />

      {/* Radial glow */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_hsl(38_80%_50%_/_0.15)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          {/* Icon Container - Rounded */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-8 sm:mb-10 rounded-2xl border border-gold/30">
            <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
          </div>

          {/* Heading - Responsive */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 sm:mb-6 tracking-tight">
            Join Our <span className="italic text-gold">Community</span>
          </h2>

          {/* Description - Responsive */}
          <p className="text-white/60 text-base sm:text-lg md:text-xl font-sans font-light leading-relaxed mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Follow us on Instagram for new arrivals, behind-the-scenes
            content, and exclusive drops.
          </p>

          {/* CTA Button - Rounded full */}
          <a
            href="https://instagram.com/gifavault"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 overflow-hidden transition-all duration-500 border border-gold/50 hover:border-transparent rounded-full"
          >
            {/* Button background on hover */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-gold rounded-full" />

            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <Instagram className="relative w-4 h-4 sm:w-5 sm:h-5 text-gold group-hover:text-white transition-colors duration-300" />
            <span className="relative font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white">
              @gifavault
            </span>
          </a>

          {/* Trust indicators - Responsive grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10"
          >
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
              <span className="text-white/50 text-xs sm:text-sm font-sans">Premium Quality</span>
            </div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
              <span className="text-white/50 text-xs sm:text-sm font-sans">Authentic Collectibles</span>
            </div>
            <div className="w-px h-4 bg-white/20 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
              <span className="text-white/50 text-xs sm:text-sm font-sans">Expert Curation</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
