"use client";

import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import FeaturedProducts from "./_components/FeaturedProducts";
import HeroSection from "./_components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Katachi
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A platform designed for artisans, creators, and customers who
              value quality and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Curated Quality
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Every product is carefully selected and crafted by skilled
                artisans who take pride in their work.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Direct from Makers
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Connect directly with creators and businesses, supporting
                independent artisans and their craft.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Sustainable Choice
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Choose products that are made to last, reducing waste and
                supporting sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
