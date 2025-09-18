"use client";

import {
  Loader2,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useSearchStore } from "@/app/products/_store/search-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/store/cart.store";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { useSession, signOut } = authClient;
  const { data, isPending } = useSession();
  const { items } = useCartStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(searchTerm.trim());
    }
  };

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-background rounded-sm"></div>
            </div>
            <span className="font-bold text-xl text-foreground">Ecomm</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-muted border-border focus:bg-background"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <span className="text-muted-foreground hover:text-foreground font-medium flex items-center">
              <AnimatedThemeToggler />
            </span>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Products
            </Link>

            {isPending && (
              <div className="text-muted-foreground">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {data?.user && (
              <>
                <Link
                  href="/organization"
                  className="text-muted-foreground hover:text-foreground font-medium"
                >
                  Organization
                </Link>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-foreground text-background">
                        {items.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <div className="w-6 h-6 bg-muted rounded-full overflow-hidden">
                        {data.user?.image ? (
                          <Image
                            src={data.user.image || "/placeholder.svg"}
                            alt={data.user.name}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-border flex items-center justify-center text-muted-foreground text-xs font-medium">
                            {data.user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{data.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/organization" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Organization
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!isPending && !data?.user && (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="sm"
                    className="bg-foreground text-background hover:bg-foreground/80"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-muted border-border"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              <Link
                href="/products"
                className="block py-2 text-muted-foreground hover:text-foreground font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {data?.user ? (
                <>
                  <Link
                    href="/organizations"
                    className="block py-2 text-muted-foreground hover:text-foreground font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Organizations
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center py-2 text-muted-foreground hover:text-foreground font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart {items.length > 0 && `(${items.length})`}
                  </Link>
                  <Link
                    href="/orders"
                    className="block py-2 text-muted-foreground hover:text-foreground font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-muted-foreground hover:text-foreground font-medium"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-3 pt-3 border-t border-border">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-foreground text-background hover:bg-foreground/80">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
