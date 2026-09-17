import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageButtonBase =
  "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors";

export default function CreatorsPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages < 1) return null;

  return (
    <nav
      className="mt-2 flex flex-wrap items-center justify-center gap-2"
      aria-label="Creators pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${pageButtonBase} border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        const isActive = currentPage === pageNumber;

        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`${pageButtonBase} ${
              isActive
                ? "border border-[#1E60DB] bg-[#1E60DB] text-white shadow-sm btn-gradient"
                : "border border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8fafc]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${pageButtonBase} border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50`}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
