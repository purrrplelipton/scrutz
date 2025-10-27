import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

function InputGroup({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex w-full items-center rounded border border-gray-400 shadow-xs outline-none transition-[color,box-shadow]",
        "min-w-0 has-[>textarea]:h-auto",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2.5",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2.5",
        "has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-2.25",
        "has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-2.25",
        "has-[[data-slot][aria-invalid=true]]:border-red-600 has-[[data-slot][aria-invalid=true]]:ring-red-600/20",
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto select-none items-center justify-center gap-2 py-1.5 font-medium text-gray-500 text-sm group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2.25",
        "inline-end": "order-last pr-2.25",
        "block-start":
          "order-first w-full justify-start pt-2.25 pr-2.5 pl-2.25 group-has-[>input]/input-group:pt-2.25 [.border-b]:pb-2.25",
        "block-end":
          "order-last w-full justify-start pr-2.25 pb-2.25 pl-2.5 group-has-[>input]/input-group:pb-2.25 [.border-t]:pt-2.25",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: onClick only focuses input for non-interactive children
    // biome-ignore lint/a11y/useSemanticElements: Div needed to support interactive children like buttons
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

function InputGroupButton({
  className,
  type = "button",
  variant,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      type={type}
      variant={variant}
      className={cn("shadow-none", className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-gray-500 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "grow rounded-none border-0 bg-transparent shadow-none",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "grow resize-none rounded-none border-0 bg-transparent py-2.5 shadow-none",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
