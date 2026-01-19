import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { SocialProof } from '@/components/home/SocialProof';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <SocialProof />
    </Layout>
  );
};

export default Index;
