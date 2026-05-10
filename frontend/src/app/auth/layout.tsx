"use client";
import type React from "react";
import { toast } from "sonner";
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
    <div className="bg-muted">
      <Auth>
        <div className="container mx-auto px-4 py-8">{children}</div>
      </Auth>
    </div>
  );
}

export default AuthLayout;
