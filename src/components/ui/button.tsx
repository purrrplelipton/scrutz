import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded border border-transparent p-2.25 font-medium text-sm outline-none transition-all duration-200 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-800/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800",
        destructive: "bg-red-800 text-white hover:bg-red-900 active:bg-red-950",
        outline: "border-current text-teal-600 shadow-xs hover:bg-teal-50",
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
