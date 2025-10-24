import { Icon } from "@iconify-icon/react";
import {
  Content,
  Group,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Icon as SelectPrimitiveIcon,
  Separator,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select";
import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

function Select({ ...props }: ComponentProps<typeof Root>) {
  return <Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: ComponentProps<typeof Group>) {
  return <Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: ComponentProps<typeof Value>) {
  return <Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Trigger>) {
  return (
    <Trigger
      data-slot="select-trigger"
      className={cn(
        "min-h-10 border-gray-400 data-placeholder:text-gray-500 [&_svg:not([class*='text-'])]:text-gray-500 aria-invalid:ring-red-600/20 aria-invalid:border-red-600 flex w-full items-center justify-between gap-2 rounded border bg-transparent px-2.5 py-2.25 text-sm whitespace-nowrap shadow-xs transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:border-gray-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 data-[state=open]:border-teal-600 data-[state=open]:ring-2 data-[state=open]:ring-teal-600/20",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitiveIcon asChild>
        <Icon
          icon="material-symbols:keyboard-arrow-down"
          className="opacity-50 transition-transform duration-200 data-[state=open]:rotate-180"
        />
      </SelectPrimitiveIcon>
    </Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        data-slot="select-content"
        className={cn(
          "bg-white text-gray-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded border border-gray-400 shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1"
          )}
        >
          {children}
        </Viewport>
        <SelectScrollDownButton />
      </Content>
    </Portal>
  );
}

function SelectLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="select-label"
      className={cn("text-gray-500 px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="select-item"
      className={cn(
        "[&_svg:not([class*='text-'])]:text-gray-500 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 transition-colors duration-150 hover:bg-teal-50 focus:bg-teal-50 data-highlighted:bg-teal-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <ItemIndicator>
          <Icon icon="material-symbols:check" />
        </ItemIndicator>
      </span>
      <ItemText>{children}</ItemText>
    </Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof ScrollUpButton>) {
  return (
    <ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 transition-all duration-200 hover:bg-gray-100 active:scale-95",
        className
      )}
      {...props}
    >
      <Icon icon="material-symbols:keyboard-arrow-up" />
    </ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof ScrollDownButton>) {
  return (
    <ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 transition-all duration-200 hover:bg-gray-100 active:scale-95",
        className
      )}
      {...props}
    >
      <Icon icon="material-symbols:keyboard-arrow-down" />
    </ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
