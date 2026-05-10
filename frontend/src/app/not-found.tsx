"use client";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full border-0 shadow-lg bg-muted">
        <CardContent className="flex flex-col items-center gap-6 p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
          <h2 className="text-3xl font-bold text-destructive mb-1">
            404 - Page Not Found
          </h2>
          <p className="text-muted-foreground text-center mb-2">
            Sorry, the page you are looking for does not exist or has been
            moved.
          </p>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;
