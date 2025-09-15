"use client";

import { ArrowRight, Eye, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dummyProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/store/cart.store";
import { formatINR } from "@/utils/currency";

export default function HomePage() {
  const { addItem } = useCartStore();
  const featuredProducts = dummyProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 text-balance">
              Our <span className="italic">Collection</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
              Discover timeless pieces crafted with meticulous attention to
              detail. Each item in our collection embodies the perfect balance
              of form and function.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search our collection..."
                  className="w-full h-14 px-6 pr-12 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-2 h-10 w-10 rounded-full bg-slate-900 hover:bg-slate-800 p-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 h-12 px-8"
                >
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/organizations">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 border-slate-300 hover:bg-slate-50 bg-transparent"
                >
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Featured Products
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Handpicked items that showcase the finest craftsmanship and design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={product.mainImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    quality={85}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.id === "2" && (
                    <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-500">
                      New
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 w-8 p-0 bg-slate-900 hover:bg-slate-800"
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            quantity: 1,
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">
                      {formatINR(product.price)}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50 bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 hover:bg-slate-50 bg-transparent"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
