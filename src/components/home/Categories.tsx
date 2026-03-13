import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSiteContent } from '@/components/SiteContentContext';
import { getAllCategories, Category } from '@/lib/supabase';

const defaultImages = [
  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80',
  'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80',
];

// Fallback categories if Supabase table isn't set up yet
const FALLBACK_CATEGORIES = [
  { name: 'Hot Wheels', slug: 'hotwheels', image_url: '' },
  { name: 'Premium', slug: 'premium', image_url: '' },
  { name: 'Sets', slug: 'sets', image_url: '' },
  { name: 'Matchbox', slug: 'matchbox', image_url: '' },
];

export const Categories = () => {
  const { getContent } = useSiteContent();
  const [categories, setCategories] = useState<Pick<Category, 'name' | 'slug' | 'image_url'>[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag-to-scroll logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Auto-scroll infinite loop logic
  useEffect(() => {
    let animationId: number;
    const scroll = () => {
      if (scrollRef.current && !isHovered && !isDragging) {
        scrollRef.current.scrollLeft += 1.25; // Speed (play with this for faster/slower)

        // Seamless infinite loop: when we've scrolled half the container, reset to 0. 
        // We duplicate the items 4x, so resetting at half is perfectly seamless.
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging]);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        if (data.length > 0) setCategories(data);
      })
      .catch(() => {
        // Use fallback categories
      })
      .finally(() => setLoading(false));
  }, []);

  // Build display data: use DB image_url, or fallback to site content image, or default Unsplash
  const displayCategories = categories.map((cat, i) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url || getContent(`category_${cat.slug}_image`, defaultImages[i % defaultImages.length]),
    href: `/products?category=${cat.slug}`,
  }));

  // For infinite scroll we duplicate the list 4x to ensure enough content to cleanly reset halfway
  const marqueeItems = [...displayCategories, ...displayCategories, ...displayCategories, ...displayCategories];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-medium text-xs sm:text-sm tracking-widest uppercase mb-3"
          >
            {getContent('categories_subtitle', 'Browse By Category')}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-['Outfit'] text-3xl sm:text-4xl font-semibold text-foreground tracking-tight"
          >
            {getContent('categories_heading', 'Explore Our Collection')}
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayCategories.length <= 4 ? (
          /* Static grid for 4 or fewer categories */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Horizontal scroll slider for 5+ categories with auto-scroll */
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={() => { handleMouseLeave(); setIsHovered(false); }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className={`flex gap-4 sm:gap-6 overflow-x-auto pb-6 -mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab cursor-pointer'}`}
          >
            {marqueeItems.map((category, index) => (
              <motion.div
                key={`${category.slug}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % displayCategories.length) * 0.1 }}
                onClick={(e) => { if (isDragging) e.preventDefault(); }}
                className="flex-shrink-0 pointer-events-auto"
                style={{ width: 'clamp(240px, 60vw, 300px)' }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* Shared category card component */
const CategoryCard = ({ category }: { category: { name: string; image: string; href: string } }) => (
  <Link
    to={category.href}
    className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
  >
    <img
      src={category.image}
      alt={category.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

    {/* Content - Always visible */}
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
      <h3 className="font-['Outfit'] text-white text-lg sm:text-xl font-semibold tracking-tight mb-1">
        {category.name}
      </h3>

      {/* Explore text */}
      <div className="flex items-center gap-1 text-white/80 text-sm group-hover:text-white transition-colors">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </Link>
);
