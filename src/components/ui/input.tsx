import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded border border-gray-400 p-2.25 font-medium text-sm shadow-xs outline-none transition-all duration-200 hover:border-gray-500 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-red-600 aria-invalid:ring-red-600/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
