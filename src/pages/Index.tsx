import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { About } from '@/components/home/About';
import { SocialProof } from '@/components/home/SocialProof';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <About />
      <SocialProof />
    </Layout>
  );
};

export default Index;
