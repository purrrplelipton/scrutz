import { Root, Thumb } from "@radix-ui/react-switch";
import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

function Switch({ className, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-purple-700 data-[state=unchecked]:bg-gray-400 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md active:scale-95",
        className
      )}
      {...props}
    >
      <Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-4 rounded-full ring-0 transition-all duration-200 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 data-[state=checked]:scale-110"
        )}
      />
    </Root>
  );
}

export { Switch };
