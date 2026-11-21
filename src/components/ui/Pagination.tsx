"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize = 6,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) return null;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startItem = (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages: (number | "...")[] = [1];

    if (safePage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-5 pt-4 border-t border-white/75 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs font-bold text-gray-600">
        Showing{" "}
        <span className="font-extrabold text-gray-900">{startItem}</span>–
        <span className="font-extrabold text-gray-900">{endItem}</span> of{" "}
        <span className="font-extrabold text-gray-900">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          aria-label="Previous page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/65 hover:bg-white text-gray-800 border border-white/90 text-xs font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-2 py-1 text-xs font-extrabold text-gray-500 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 px-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                page === safePage
                  ? "bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] text-white shadow-[0_4px_12px_rgba(255,87,34,0.32)]"
                  : "bg-white/60 hover:bg-white text-gray-700 border border-white/90"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/65 hover:bg-white text-gray-800 border border-white/90 text-xs font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}