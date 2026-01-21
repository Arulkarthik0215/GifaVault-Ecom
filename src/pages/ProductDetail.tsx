import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
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
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
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
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-square bg-secondary overflow-hidden rounded-2xl"
            >
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
              className="flex flex-col"
            >
              <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">
                {getCategoryLabel(product.category)}
              </p>

              <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              <p className="text-2xl font-semibold text-gold mb-6">
                ₹{product.price.toLocaleString('en-IN')}
              </p>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                {product.new && (
                  <span className="px-3 py-1 bg-gold text-white text-xs font-medium rounded-full">
                    New Arrival
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-full font-medium text-sm hover:bg-foreground/90 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border font-medium text-sm hover:bg-secondary transition-colors">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-8 space-y-4">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <feature.icon className="w-5 h-5 text-gold" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-24">
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-tight text-center mb-10">
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
