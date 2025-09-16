"use client";
import type React from "react";
import { toast } from "sonner";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { useUser } from "@/hooks/useUser";
import Loading from "./loading";

function Auth({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useUser();

  if (isPending) return <Loading />;

  if (data?.user) {
    toast.info("You are already logged in");
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  bg-muted">
      <Header />
      <Auth>
           <div className="container mx-auto px-4 py-8">{children}</div>

      </Auth>

      <Footer />
    </div>
  );
}

export default AuthLayout;
