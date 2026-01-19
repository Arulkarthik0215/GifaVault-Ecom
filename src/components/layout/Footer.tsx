import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold tracking-tight">
                GIFA<span className="text-gold font-bold">Vault</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Curated collectibles for the modern enthusiast.
              <br />
              Elevating the collecting experience from a
              <br />
              hobby to a passion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-medium tracking-wider uppercase text-background/50 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-sans text-sm font-medium tracking-wider uppercase text-background/50 mb-6">
              Connect With Us
            </h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/gifavault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Instagram className="w-5 h-5" />
                @gifavault
              </a>
              <a
                href="mailto:contact@gifavault.com"
                className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
              >
                <Mail className="w-5 h-5" />
                contact@gifavault.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <p className="text-sm text-background/50 text-center">
            © {new Date().getFullYear()} GIFA Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
