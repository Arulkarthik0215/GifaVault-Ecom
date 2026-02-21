import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ui/ProductCard';
import { getAllProducts, Product, ProductCategory } from '@/lib/supabase';

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hotwheels', label: 'Hot Wheels' },
  { value: 'premium', label: 'Premium' },
  { value: 'sets', label: 'Sets' },
  { value: 'matchbox', label: 'Matchbox' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | 'all' | null;
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts(activeCategory, searchQuery);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search by 300ms
    const timer = setTimeout(fetchProducts, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setActiveCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <Layout>
      {/* Filters - Sticky below header */}
      <section className="pt-14 pb-4 sm:pt-16 sm:pb-6 bg-background sticky top-0 z-40 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-secondary border-0 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeCategory === category.value
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-muted'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {products.length} products found
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
