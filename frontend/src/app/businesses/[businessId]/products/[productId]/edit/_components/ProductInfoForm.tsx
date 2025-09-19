import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductInfoFormProps {
  name: string;
  price: string;
  quantity: string;
  onNameChange: (name: string) => void;
  onPriceChange: (price: string) => void;
  onQuantityChange: (quantity: string) => void;
}

export function ProductInfoForm({
  name,
  price,
  quantity,
  onNameChange,
  onPriceChange,
  onQuantityChange,
}: ProductInfoFormProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter product name"
              className="text-3xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          Price
        </Label>
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">₹</span>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="0"
            className="text-4xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-primary"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Price includes all taxes
        </p>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          Quantity Available
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder="0"
          className="w-32"
        />
      </div>
    </div>
  );
}
