import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import FeaturedProducts from "./_components/FeaturedProducts";
import HeroSection from "./_components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <HeroSection />
      <div className="py-12" />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
