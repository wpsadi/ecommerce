"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchProductList from "./_components/SearchProductList";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync query param to state on mount
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setInputValue(query);
    setSearchQuery(query);
  }, [searchParams]);

  // Debounce inputValue to update searchQuery
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    // Optionally update URL param here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Search Products
          </h1>
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for products, categories, or tags..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-12 h-12 text-lg bg-muted border-border focus:bg-background"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
        <SearchProductList query={searchQuery} />
      </div>
      <Footer />
    </div>
  );
}
