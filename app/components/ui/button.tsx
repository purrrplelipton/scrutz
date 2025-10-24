import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-red-800/20 aria-invalid:border-red-600 border border-transparent p-2.25 active:scale-95 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800",
        destructive: "text-white bg-red-800 hover:bg-red-900 active:bg-red-950",
        outline: "text-teal-600 border-current shadow-xs hover:bg-teal-50",
        ghost: "hover:bg-teal-100 hover:text-teal-600",
        link: "underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
