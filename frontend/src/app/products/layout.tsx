import type React from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
