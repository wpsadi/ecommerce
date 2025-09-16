"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

export const queryClient = new QueryClient();
function TanstackProvider({ children }: { children: React.ReactNode }) {
  // Create a client

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default TanstackProvider;
