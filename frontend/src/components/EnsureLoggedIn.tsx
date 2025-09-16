"use client";
import Link from "next/link";
import type React from "react";
import { useUser } from "@/hooks/useUser";

function EnsureLoggedIn({ children }: { children: React.ReactNode }) {
  const { isPending, data, error } = useUser();
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted-foreground border-t-primary" />
          <span className="text-muted-foreground text-lg">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }
  if (error || !data?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <span className="text-destructive text-lg font-semibold">
            You must be logged in to access this page.
          </span>
          <Link href="/auth" className="text-primary underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default EnsureLoggedIn;
