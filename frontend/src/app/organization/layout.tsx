import type React from "react";
import EnsureLoggedIn from "@/components/EnsureLoggedIn";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <EnsureLoggedIn>
      <div className="min-h-screen bg-background">
        <Header />
        {children}
        <Footer />
      </div>
    </EnsureLoggedIn>
  );
}

export default Layout;
