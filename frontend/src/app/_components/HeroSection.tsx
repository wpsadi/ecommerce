import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "../products/_store/search-store";

function HeroSection() {
  const { searchTerm, setSearchTerm } = useSearchStore();
  return (
    <section className="relative bg-gradient-to-br from-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Our <span className="italic">Collection</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Discover timeless pieces crafted with meticulous attention to
            detail. Each item in our collection embodies the perfect balance of
            form and function.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Input
                type="search"
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search our collection..."
                className="w-full h-14 px-6 pr-12 rounded-full border border-border bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent"
              />
              <Button
                size="sm"
                className="absolute right-2 top-2 h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/80 p-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/80 h-12 px-8"
              >
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/organizations">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-border hover:bg-muted bg-transparent"
              >
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
