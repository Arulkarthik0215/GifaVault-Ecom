import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Collection', href: '/products' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'py-3 glass shadow-soft'
          : 'py-4 sm:py-5 bg-transparent'
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-0">
          <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-tight transition-all duration-300 group-hover:text-gold">
            <span className="font-semibold">GIFA</span>
            <span className="text-gold font-medium italic">Vault</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative text-sm font-sans font-medium tracking-wider uppercase transition-colors duration-300 underline-animation ${location.pathname === item.href
                  ? 'text-gold'
                  : 'text-foreground/80 hover:text-foreground'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions - Rounded full button */}
        <div className="hidden md:flex items-center">
          <a
            href="https://instagram.com/gifavault"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 border border-foreground/20 rounded-full text-sm font-sans font-medium tracking-wider uppercase hover:border-gold hover:text-gold transition-all duration-400"
          >
            <Instagram className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Follow</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden glass"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-lg sm:text-xl font-display font-medium tracking-wide transition-colors ${location.pathname === item.href
                        ? 'text-gold'
                        : 'text-foreground hover:text-gold'
                      }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Elegant divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-2"
              />

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                href="https://instagram.com/gifavault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 border border-foreground/20 rounded-full text-foreground hover:text-gold hover:border-gold transition-colors w-fit"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-sans tracking-wider uppercase">@gifavault</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
