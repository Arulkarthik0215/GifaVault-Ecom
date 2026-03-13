import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Share2, CheckCircle, Shield, Package, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { getProductById, getFeaturedProducts, getAllCategories, Product, Category } from '@/lib/supabase';
import { ProductCard } from '@/components/ui/ProductCard';
import HowToBuyModal from '@/components/HowToBuyModal';
import { useSiteContent } from '@/components/SiteContentContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '917598723389';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const { getContent } = useSiteContent();

  // Build category label from dynamic categories
  const getCategoryLabel = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name.toUpperCase() : slug.toUpperCase();
  };


  // Build all images array from product
  const allImages = product
    ? [product.image_url, ...(product.additional_images || [])].filter(Boolean)
    : [];

  // Load categories
  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => { });
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedImageIndex(0);
    Promise.all([
      getProductById(id),
      getFeaturedProducts(),
    ])
      .then(([prod, featured]) => {
        setProduct(prod);
        setRelatedProducts(featured.filter((p) => String(p.id) !== id).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Build the shareable URL that serves dynamic OG tags (product image, name, price)
  // The API endpoint auto-redirects users to the actual product page
  const getShareUrl = () => {
    const origin = window.location.origin;
    return `${origin}/api/og?id=${id}`;
  };

  const handleBuyOnWhatsApp = () => {
    if (!product?.in_stock) {
      toast.error('This product is currently out of stock', {
        description: 'Please check back later or browse other products.',
        duration: 3000,
      });
      return;
    }
    const shareUrl = getShareUrl();
    const message = `Hi! I'm interested in buying *${product?.name}* (₹${product?.price.toLocaleString('en-IN')}).\nProduct link: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareData = {
      title: product?.name || 'GifaVault Product',
      text: `Check out ${product?.name} at GifaVault!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

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
            {/* Product Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-5 max-w-md"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-secondary overflow-hidden rounded-xl mb-3">
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
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex] || allImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}

                {/* Arrow Navigation (only for multiple images) */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(i => i === 0 ? allImages.length - 1 : i - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(i => i === allImages.length - 1 ? 0 : i + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip (only if multiple images) */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                        ? 'border-gold ring-1 ring-gold'
                        : 'border-border hover:border-muted-foreground'
                        }`}
                    >
                      <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
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
                <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className={`font-medium text-sm ${product.in_stock ? 'text-emerald-500' : 'text-red-400'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* How to Buy Guide */}
              <div className="mb-6">
                <HowToBuyModal />
              </div>

              {/* Buy on WhatsApp & Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={handleBuyOnWhatsApp}
                  className={`flex items-center justify-center gap-2.5 px-8 py-3 rounded-full font-medium text-sm transition-all min-w-[240px] shadow-md ${product.in_stock
                    ? 'bg-[#25D366] text-white hover:bg-[#1da851] cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                    }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {product.in_stock ? 'Buy on WhatsApp' : 'Out of Stock'}
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
                  <span>{getContent('trust_badge_1', '100% Authentic Product')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{getContent('trust_badge_2', 'Quality Guaranteed')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{getContent('trust_badge_3', 'Safe & Secure Packaging')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <h2 className="font-['Outfit'] text-xl sm:text-2xl font-semibold text-foreground tracking-tight text-center mb-8">
                {getContent('related_products_heading', 'You May Also Like')}
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
