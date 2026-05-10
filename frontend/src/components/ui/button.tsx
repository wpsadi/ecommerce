import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-[Helvetica_Now_Text_Medium,Helvetica,sans-serif] transition-all duration-150 ease-out uppercase disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#111111] text-white rounded-[30px] px-8 py-0 h-[48px] text-[16px] tracking-[0.05em]",
        secondary:
          "bg-[#f5f5f5] text-[#111111] rounded-[30px] px-8 py-0 h-[48px] text-[16px] tracking-[0.05em]",
        outline:
          "bg-white/90 text-[#111111] rounded-[30px] px-6 py-0 h-[48px] text-[16px] tracking-[0.05em]",
        icon:
          "bg-transparent rounded-full size-[40px]",
      },
      size: {
        default: "h-[48px] px-8",
        lg: "h-[48px] px-8",
        icon: "size-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        "active:scale-[0.95] active:opacity-70 hover:brightness-110"
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
