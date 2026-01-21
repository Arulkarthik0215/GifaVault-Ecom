import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ui/ProductCard';
import { products, categories, ProductCategory } from '@/data/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | 'all' | null;
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return result;
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
      {/* Page Header Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-b from-champagne/50 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-32 left-10 w-px h-24 bg-gradient-to-b from-gold/30 to-transparent hidden lg:block" />
        <div className="absolute top-32 right-10 w-px h-24 bg-gradient-to-b from-gold/30 to-transparent hidden lg:block" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="section-subheading text-gold">Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6"
          >
            All <span className="italic text-gold">Products</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-muted-foreground font-sans text-lg max-w-2xl leading-relaxed"
          >
            Browse our complete collection of die-cast collectibles, from classic Hot Wheels to
            premium limited editions.
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border bg-background sticky top-[72px] z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
          >
            {/* Search Bar - Rounded full */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-champagne/50 border border-border focus:border-gold text-sm font-sans transition-all duration-400 focus:outline-none focus:ring-0 placeholder:text-muted-foreground rounded-full"
              />
            </div>

            {/* Category Filters - Rounded full */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`relative px-6 py-3 text-sm font-sans font-medium tracking-wider uppercase transition-all duration-400 overflow-hidden rounded-full ${activeCategory === category.value
                      ? 'text-white bg-foreground'
                      : 'text-foreground border border-border hover:border-gold/50 bg-background'
                    }`}
                >
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-muted-foreground font-sans tracking-wide mb-10"
          >
            <span className="text-gold font-medium">{filteredProducts.length}</span> products found
          </motion.p>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Empty State - Rounded container */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-6 rounded-2xl">
                <SlidersHorizontal className="w-6 h-6 text-gold/50" />
              </div>
              <h3 className="font-display text-2xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground font-sans">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
