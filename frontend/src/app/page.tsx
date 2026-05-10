import FeaturedProducts from "./_components/FeaturedProducts";
import HeroSection from "./_components/HeroSection";

export default function HomePage() {
  return (
    <div className="bg-canvas">
      <HeroSection />
      <div className="py-12" />
      <FeaturedProducts />
    </div>
  );
}
