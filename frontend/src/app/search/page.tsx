"use client";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Input } from "@/components/ui/input";
import SearchProductList from "./_components/SearchProductList";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setInputValue(query);
    setSearchQuery(query);
  }, [searchParams]);

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
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-[32px] font-[Helvetica_Now_Display_Medium,Helvetica,sans-serif] text-ink uppercase tracking-normal mb-4">
            Search Products
          </h1>
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mute h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for products, categories, or tags..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-12 h-[40px] text-[16px]"
              />
            </div>
          </form>
        </div>
        <SearchProductList query={searchQuery} />
      </div>
      <Footer />
    </div>
  );
}
