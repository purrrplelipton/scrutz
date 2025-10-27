import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Avatar({ className, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      data-slot="avatar"
      className={cn(
        "relative flex size-9 shrink-0 overflow-hidden rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof Fallback>) {
  return (
    <Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-gray-400 flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
