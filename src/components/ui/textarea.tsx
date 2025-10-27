import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded border border-gray-400 bg-transparent p-2.25 text-sm shadow-xs outline-none transition-all duration-200 hover:border-gray-500 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
