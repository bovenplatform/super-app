import * as React from "react";
import { cn } from "@superapp/utils";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : currentPage * pageSize;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1",
        className
      )}
    >
      <div className="text-xs text-muted">
        {totalItems ? (
          <>
            Menampilkan <span className="font-semibold text-main">{startItem}</span> -{" "}
            <span className="font-semibold text-main">{endItem}</span> dari{" "}
            <span className="font-semibold text-main">{totalItems}</span> data
          </>
        ) : (
          <>
            Halaman <span className="font-semibold text-main">{currentPage}</span> dari{" "}
            <span className="font-semibold text-main">{totalPages}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="text-xs"
        >
          ← Sebelumnya
        </Button>

        <div className="flex items-center gap-1 px-2 text-xs font-semibold text-main">
          <span>{currentPage}</span>
          <span className="text-muted">/</span>
          <span>{Math.max(1, totalPages)}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="text-xs"
        >
          Selanjutnya →
        </Button>
      </div>
    </div>
  );
}
