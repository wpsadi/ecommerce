"use client";
import type React from "react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import Loading from "./loading";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useUser();

  if (isPending) return <Loading />;

  if (data?.user) {
    toast.info("You are already logged in");
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}

export default AuthLayout;
