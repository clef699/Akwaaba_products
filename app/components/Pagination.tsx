"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 4,
  onPageChange,
}: PaginationProps) {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={18} className="text-gray-600" />
      </button>

      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`w-10 h-10 rounded font-semibold transition ${
            pageNum === page
              ? "bg-(--primary) text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={18} className="text-gray-600" />
      </button>
    </div>
  );
}
