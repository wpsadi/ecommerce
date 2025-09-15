// components/LoadingScreen.tsx
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="p-8 shadow-lg rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading, please wait...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
