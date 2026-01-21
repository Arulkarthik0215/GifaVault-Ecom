import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-['Outfit'] text-2xl font-semibold tracking-tight">
                GIFA<span className="text-gold">Vault</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Curated collectibles for the modern enthusiast.
              Elevating the collecting experience from a hobby to a passion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Outfit'] text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-['Outfit'] text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/gifavault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @gifavault
              </a>
              <a
                href="mailto:contact@gifavault.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@gifavault.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-white/40 text-center sm:text-left">
            {new Date().getFullYear()} GIFA Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
