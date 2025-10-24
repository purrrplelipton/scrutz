import { Icon } from "@iconify-icon/react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("font-inter", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationButtonProps = {
  isActive?: boolean;
} & ComponentProps<"button">;

function PaginationButton({
  className,
  isActive,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-button"
      data-active={isActive}
      className={cn(
        "rounded-full h-6 min-w-6 content-center text-center inline-block transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "text-white bg-teal-600 font-bold shadow-md": isActive,
          "hover:bg-gray-100": !isActive,
        },
        className
      )}
      disabled={isActive}
      {...props}
    />
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <Icon icon="material-symbols:more-horiz" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationEllipsis,
};
