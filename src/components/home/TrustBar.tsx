import { Shield, Truck, Star } from 'lucide-react';
import { useSiteContent } from '@/components/SiteContentContext';

export const TrustBar = () => {
    const { getContent } = useSiteContent();

    const trustItems = [
        {
            icon: Shield,
            title: getContent('trust_item_1_title', 'Authentic Products'),
            description: getContent('trust_item_1_description', '100% genuine collectibles'),
        },
        {
            icon: Truck,
            title: getContent('trust_item_2_title', 'Safe Delivery'),
            description: getContent('trust_item_2_description', 'Carefully packed & shipped'),
        },
        {
            icon: Star,
            title: getContent('trust_item_3_title', 'Premium Selection'),
            description: getContent('trust_item_3_description', 'Hand-picked rare finds'),
        },
    ];

    return (
        <section className="py-10 sm:py-12 md:py-14 border-b border-zinc-200 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16 md:gap-24 lg:gap-36">
                    {trustItems.map((item) => (
                        <div key={item.title} className="flex items-center gap-5">
                            {/* Icon - Bigger with light gray circular background */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
                                <item.icon className="w-6 h-6 text-zinc-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[15px] text-zinc-900">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-zinc-500 mt-0.5">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
