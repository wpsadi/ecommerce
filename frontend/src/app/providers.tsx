import type React from "react";
import TanstackProvider from "@/components/tanstack-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ServerUp from "./_components/ServerUp";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ServerUp />

        {children}

        <Toaster />
      </ThemeProvider>
    </TanstackProvider>
  );
}

export default Providers;
