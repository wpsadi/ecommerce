import type React from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="container mx-auto px-4 py-8 bg-muted">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;
