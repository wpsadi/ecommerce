import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingCreateButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
}

export function FloatingCreateButton({
  disabled = false,
  isLoading = false,
}: FloatingCreateButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        type="submit"
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16"
        disabled={disabled || isLoading}
      >
        <Save className="h-6 w-6" />
      </Button>
    </div>
  );
}
