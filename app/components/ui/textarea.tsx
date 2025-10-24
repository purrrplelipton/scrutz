import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-gray-400 aria-invalid:ring-red-600/20 aria-invalid:border-red-600 flex field-sizing-content min-h-16 w-full rounded border bg-transparent p-2.25 text-sm shadow-xs transition-all duration-200 outline-none disabled:opacity-50 md:text-sm focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 hover:border-gray-500",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
