import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useSiteContent } from '@/components/SiteContentContext';

export const SocialProof = () => {
  const { getContent } = useSiteContent();

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-charcoal text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Heading */}
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            {getContent('social_heading', 'Join Our Community')}
          </h2>

          {/* Description */}
          <p className="text-white/60 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            {getContent('social_description', 'Follow us on Instagram for new arrivals, behind-the-scenes content, and exclusive drops.')}
          </p>

          {/* CTA Button */}
          <a
            href={getContent('instagram_url', 'https://instagram.com/gifavault')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-charcoal font-medium text-sm hover:bg-white/90 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            {getContent('instagram_handle', '@gifavault')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};
