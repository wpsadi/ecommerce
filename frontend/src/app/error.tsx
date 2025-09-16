"use client"; // Error boundaries must be Client Components

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full border-0 shadow-lg bg-muted">
          <CardContent className="flex flex-col items-center gap-6 p-8">
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
              <h2 className="text-2xl font-bold text-destructive mb-1">
                Something went wrong!
              </h2>
              <p className="text-muted-foreground text-center">
                {error?.message ||
                  "An unexpected error occurred. Please try again."}
              </p>
            </div>
            <Button variant="outline" onClick={() => reset()} className="mt-2">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
