import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-[#999999] w-full min-w-0 rounded border px-2.5 py-2.25 shadow-xs transition-[color,box-shadow] outline-none font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
        "aria-invalid:ring-red-600/20 aria-invalid:border-red-600",
        className
      )}
      {...props}
    />
  );
}

export { Input };
