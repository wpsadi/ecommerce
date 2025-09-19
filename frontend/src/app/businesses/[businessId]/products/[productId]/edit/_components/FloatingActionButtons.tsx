import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function FloatingActionButtons({
  onSave,
  onDelete,
  disabled = false,
  isLoading = false,
}: FloatingActionButtonsProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <Button
        onClick={onSave}
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16"
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          <Save className="h-6 w-6" />
        )}
      </Button>
      <Button
        onClick={onDelete}
        variant="destructive"
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-16 h-16"
        disabled={isLoading}
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  );
}
