import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-charcoal text-white overflow-hidden">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center_top,_hsl(38_80%_50%_/_0.3)_0%,_transparent_70%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 relative z-10">
        {/* Main Footer Content - Stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10 md:gap-8 mb-12 sm:mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-5">
            <Link to="/" className="inline-block mb-4 sm:mb-6">
              <span className="font-display text-2xl sm:text-3xl tracking-tight">
                <span className="font-semibold">GIFA</span>
                <span className="text-gold font-medium italic">Vault</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm font-sans leading-relaxed max-w-sm mb-6 sm:mb-8">
              Curated collectibles for the modern enthusiast.
              Elevating the collecting experience from a hobby to a passion.
            </p>

            {/* Social Links - Rounded */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://instagram.com/gifavault"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border border-white/20 hover:border-gold hover:bg-gold/10 transition-all duration-400 rounded-xl"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-gold transition-colors duration-300" />
              </a>
              <a
                href="mailto:contact@gifavault.com"
                className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border border-white/20 hover:border-gold hover:bg-gold/10 transition-all duration-400 rounded-xl"
                aria-label="Contact us via email"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-gold transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-sans text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-gold mb-4 sm:mb-6 md:mb-8">
              Quick Links
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white font-sans text-sm tracking-wide transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-white/60 hover:text-white font-sans text-sm tracking-wide transition-colors duration-300"
                >
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-4">
            <h4 className="font-sans text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-gold mb-4 sm:mb-6 md:mb-8">
              Connect With Us
            </h4>
            <div className="space-y-4 sm:space-y-5">
              <a
                href="https://instagram.com/gifavault"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:gap-4 text-white/60 hover:text-white transition-colors duration-300"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors duration-300 flex-shrink-0 rounded-lg">
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-sm font-sans tracking-wide">@gifavault</span>
              </a>
              <a
                href="mailto:contact@gifavault.com"
                className="group flex items-center gap-3 sm:gap-4 text-white/60 hover:text-white transition-colors duration-300"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors duration-300 flex-shrink-0 rounded-lg">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-sm font-sans tracking-wide break-all sm:break-normal">contact@gifavault.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Stack on mobile */}
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-white/40 font-sans tracking-wide text-center sm:text-left">
              © {new Date().getFullYear()} GIFA Vault. All rights reserved.
            </p>

            {/* Decorative element */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="w-6 sm:w-8 h-px bg-white/20" />
              <span className="text-xs text-gold/60 font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase">Premium Collectibles</span>
              <span className="w-6 sm:w-8 h-px bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
