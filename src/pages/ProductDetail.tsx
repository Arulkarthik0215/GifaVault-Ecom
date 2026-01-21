import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, Share2, CheckCircle, Shield, Package } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { getProductById, getFeaturedProducts, getCategoryLabel } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';

const INSTAGRAM_URL = 'https://www.instagram.com/gifavault/';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const relatedProducts = getFeaturedProducts().filter((p) => p.id !== id).slice(0, 4);

  const handleBuyOnInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'GifaVault Product',
      text: `Check out ${product?.name} at GifaVault!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-['Outfit'] text-2xl font-semibold tracking-tight mb-4">Product Not Found</h1>
          <Link to="/products" className="text-gold hover:underline">
            Back to Collection
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </motion.div>

          {/* Product Content */}
          <div className="grid md:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-5 relative aspect-square bg-secondary overflow-hidden rounded-xl max-w-md"
            >
              {/* Featured Badge on Image */}
              {product.featured && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-gold text-white text-xs font-semibold rounded-md shadow-lg">
                  Featured
                </span>
              )}
              {product.new && !product.featured && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-md shadow-lg">
                  New Arrival
                </span>
              )}
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-7 flex flex-col"
            >
              {/* Category */}
              <p className="text-xs text-gold font-semibold tracking-wider uppercase mb-2">
                {getCategoryLabel(product.category)}
              </p>

              {/* Product Name */}
              <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-emerald-500 font-medium text-sm">In Stock</span>
              </div>

              {/* Buy on Instagram & Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={handleBuyOnInstagram}
                  className="flex items-center justify-center gap-2.5 bg-foreground text-background px-8 py-3 rounded-full font-medium text-sm hover:bg-foreground/90 transition-all min-w-[240px]"
                >
                  <Instagram className="w-4 h-4" />
                  Buy on Instagram
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center w-11 h-11 rounded-lg border border-border hover:bg-secondary transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>100% Authentic Product</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Safe & Secure Packaging</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <h2 className="font-['Outfit'] text-xl sm:text-2xl font-semibold text-foreground tracking-tight text-center mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
