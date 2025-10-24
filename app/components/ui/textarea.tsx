import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[#999999] aria-invalid:ring-red-600/20 aria-invalid:border-red-600 flex field-sizing-content min-h-16 w-full rounded border bg-transparent px-2.5 py-2.25 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
