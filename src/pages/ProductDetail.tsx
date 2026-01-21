import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw, Sparkles, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { getProductById, getFeaturedProducts, getCategoryLabel } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';

const features = [
  { icon: Truck, text: 'Free shipping on orders over ₹999' },
  { icon: Shield, text: '100% authentic products guaranteed' },
  { icon: RotateCcw, text: '7-day easy returns' },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const relatedProducts = getFeaturedProducts().filter((p) => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-gold/30 flex items-center justify-center mx-auto mb-6 sm:mb-8 rounded-2xl">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold/50" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The item you're looking for might have been moved.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gold hover:underline font-sans tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-24 pb-8 sm:pt-28 sm:pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-10"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground hover:text-gold transition-colors duration-300 font-sans tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Collection
            </Link>
          </motion.div>

          {/* Product Content - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
            {/* Product Image - Rounded */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              {/* Image Container */}
              <div className="aspect-square bg-champagne overflow-hidden relative group rounded-2xl sm:rounded-3xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 transition-colors duration-500 rounded-2xl sm:rounded-3xl" />
              </div>

              {/* Decorative line - hidden on mobile */}
              <div className="absolute -left-6 top-1/4 w-px h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col"
            >
              {/* Category */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-gold" />
                <p className="text-xs font-sans text-gold tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium">
                  {getCategoryLabel(product.category)}
                </p>
              </div>

              {/* Title - Responsive */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-3 sm:mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-2xl sm:text-3xl font-display font-medium text-gold mb-6 sm:mb-8">
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              {/* Badges - Rounded full */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {product.new && (
                  <span className="px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-sans font-semibold tracking-[0.1em] sm:tracking-[0.15em] uppercase gradient-gold text-white rounded-full">
                    New Arrival
                  </span>
                )}
                {product.featured && (
                  <span className="px-4 sm:px-5 py-1.5 sm:py-2 bg-charcoal text-white text-xs font-sans font-semibold tracking-[0.1em] sm:tracking-[0.15em] uppercase rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed font-sans text-sm sm:text-base mb-8 sm:mb-10">
                {product.description}
              </p>

              {/* Actions - Rounded full buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                <button className="group relative flex-1 flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 overflow-hidden transition-all duration-500 bg-foreground hover:bg-foreground/90 rounded-full">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <ShoppingBag className="relative w-4 h-4 sm:w-5 sm:h-5 text-background" />
                  <span className="relative font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-background">
                    Add to Cart
                  </span>
                </button>
                <button className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 border border-border hover:border-gold font-sans text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-400 hover:text-gold rounded-full">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                  Wishlist
                </button>
              </div>

              {/* Features - Rounded icons */}
              <div className="border-t border-border pt-8 sm:pt-10 space-y-4 sm:space-y-5">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 rounded-xl">
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground font-sans">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-24 md:mt-32">
              <div className="text-center mb-10 sm:mb-16">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
                  <Star className="w-4 h-4 text-gold" />
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium">
                  You May Also <span className="italic text-gold">Like</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
