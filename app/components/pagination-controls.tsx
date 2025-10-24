import { Icon } from "@iconify-icon/react";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "~/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const generatePaginationNumbers = () => {
    const pages: Array<
      { type: "page"; value: number } | { type: "ellipsis"; id: string }
    > = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: "page", value: i });
      }
    } else {
      pages.push({ type: "page", value: 1 });

      if (currentPage > 3) {
        pages.push({ type: "ellipsis", id: "start-ellipsis" });
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push({ type: "page", value: i });
      }

      if (currentPage < totalPages - 2) {
        pages.push({ type: "ellipsis", id: "end-ellipsis" });
      }

      if (totalPages > 1) {
        pages.push({ type: "page", value: totalPages });
      }
    }

    return pages;
  };

  if (totalCount === 0) return null;

  return (
    <div className="@container mt-11 text-sm font-medium flex items-center justify-between px-2.5">
      <Pagination className="w-full @md:w-auto">
        <PaginationContent className="grow @md:grow-0 @md:[justify-content:auto] justify-center">
          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Go to previous page"
            >
              <Icon icon="material-symbols:chevron-left" />
            </PaginationButton>
          </PaginationItem>

          {generatePaginationNumbers().map((item) =>
            item.type === "ellipsis" ? (
              <PaginationItem key={item.id}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item.value}>
                <PaginationButton
                  onClick={() => onPageChange(item.value)}
                  isActive={currentPage === item.value}
                >
                  {item.value}
                </PaginationButton>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Go to next page"
            >
              <Icon icon="material-symbols:chevron-right" />
            </PaginationButton>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="hidden @md:block">
        showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
      </p>
    </div>
  );
}
