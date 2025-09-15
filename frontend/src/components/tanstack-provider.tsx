"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

function TanstackProvider({ children }: { children: React.ReactNode }) {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default TanstackProvider;
