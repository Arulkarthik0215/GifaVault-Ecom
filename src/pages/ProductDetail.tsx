import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { getProductById, getFeaturedProducts } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import productRing from '@/assets/product-ring.jpg';
import productChain from '@/assets/product-chain.jpg';
import productBracelet from '@/assets/product-bracelet.jpg';
import productEarrings from '@/assets/product-earrings.jpg';

// Map category to images for demo
const categoryImages: Record<string, string> = {
  rings: productRing,
  chains: productChain,
  bracelets: productBracelet,
  earrings: productEarrings,
  pendants: productChain,
  sets: productRing,
};

const features = [
  { icon: Truck, text: 'Free shipping on orders over $200' },
  { icon: Shield, text: '1 year warranty included' },
  { icon: RotateCcw, text: '30-day easy returns' },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const relatedProducts = getFeaturedProducts().filter((p) => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-24 text-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <Link to="/products" className="text-gold hover:underline">
            ← Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const productImage = categoryImages[product.category] || productRing;

  return (
    <Layout>
      <section className="py-8 md:py-16">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </motion.div>

          {/* Product Content */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-square bg-champagne overflow-hidden"
            >
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.new && (
                  <span className="px-3 py-1 bg-gold text-primary-foreground text-xs font-sans tracking-wider uppercase">
                    New
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 bg-foreground text-background text-xs font-sans tracking-wider uppercase">
                    Featured
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h1 className="text-3xl md:text-4xl font-serif font-light mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-gold font-serif mb-6">
                ${product.price.toFixed(2)}
              </p>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button className="btn-outline flex items-center justify-center gap-2 sm:px-6">
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
            <div className="mt-24">
              <h2 className="section-heading text-center mb-12">You May Also Like</h2>
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
