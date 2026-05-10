"use client";

import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchStore } from "@/app/products/_store/search-store";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/store/cart.store";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { useSession, signOut } = authClient;
  const { data } = useSession();
  const { items } = useCartStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas">
        {/* Utility Bar */}
        <div className="h-[36px] flex items-center justify-end px-4" style={{ fontSize: "9px" }}>
          <nav className="flex items-center gap-4 text-ink" style={{ fontFamily: "Helvetica Neue, Helvetica, sans-serif" }}>
            <Link href="/store" className="hover:underline cursor-pointer">Find a Store</Link>
            <Link href="/help" className="hover:underline cursor-pointer">Help</Link>
            <Link href="/join" className="hover:underline cursor-pointer">Join Us</Link>
            <Link href="/signin" className="hover:underline cursor-pointer">Sign In</Link>
          </nav>
        </div>

        {/* Main Nav */}
        <div className="flex h-[56px] items-center justify-between border-t border-hairline">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center ml-4">
              <div className="w-8 h-8 bg-ink flex items-center justify-center">
                <div className="w-4 h-4 bg-canvas"></div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="nav-link text-ink text-body-strong relative">
                New & Featured
              </Link>
              <Link href="/men" className="nav-link text-ink text-body-strong relative">
                Men
              </Link>
              <Link href="/women" className="nav-link text-ink text-body-strong relative">
                Women
              </Link>
              <Link href="/kids" className="nav-link text-ink text-body-strong relative">
                Kids
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 mr-4">
            {/* Search Pill */}
            <div className="hidden md:flex items-center">
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-soft-cloud rounded-md h-[40px] px-4">
                  <Search className="h-4 w-4 text-charcoal mr-2" />
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-ink placeholder:text-mute w-[180px]"
                    style={{ fontFamily: "Helvetica Now Text, Helvetica, sans-serif" }}
                  />
                </div>
              </form>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative cursor-pointer">
              <div className="w-[40px] h-[40px] rounded-full bg-soft-cloud flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-ink" />
              </div>
              {items.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-ink rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">{items.length}</span>
                </div>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-ink" />
              ) : (
                <Menu className="h-5 w-5 text-ink" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-canvas left-0 top-0 w-[280px] border-r border-hairline">
          <div className="p-6 pt-16">
            <nav className="flex flex-col gap-6">
              <Link href="/products" className="text-ink text-body-strong" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link href="/men" className="text-ink text-body-strong" onClick={() => setIsMenuOpen(false)}>Men</Link>
              <Link href="/women" className="text-ink text-body-strong" onClick={() => setIsMenuOpen(false)}>Women</Link>
              <Link href="/kids" className="text-ink text-body-strong" onClick={() => setIsMenuOpen(false)}>Kids</Link>
              {!data?.user && (
                <div className="flex flex-col gap-3 pt-4 border-t border-hairline">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full text-ink text-body-strong py-2 text-left">Login</button>
                  </Link>
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-ink text-canvas text-body-strong rounded-full px-6 py-2 uppercase">Sign Up</button>
                  </Link>
                </div>
              )}
              {data?.user && (
                <div className="flex flex-col gap-3 pt-4 border-t border-hairline">
                  <Link href="/orders" className="text-ink text-body-strong" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-ink text-body-strong text-left">Logout</button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}