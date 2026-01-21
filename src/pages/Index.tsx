import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { SocialProof } from '@/components/home/SocialProof';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <TrustBar />
      <Categories />
      <FeaturedProducts />
      <SocialProof />
    </Layout>
  );
};

export default Index;
