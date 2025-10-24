import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-gray-400 w-full min-w-0 rounded border p-2.25 shadow-xs transition-all duration-200 outline-none font-medium disabled:pointer-events-none disabled:opacity-50 text-sm focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 hover:border-gray-500",
        "aria-invalid:ring-red-600/20 aria-invalid:border-red-600",
        className
      )}
      {...props}
    />
  );
}

export { Input };
