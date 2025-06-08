"use client"
import { useEffect } from "react"
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md"

interface PaginationProps {
  currentPage: number 
  pageSize: number 
  totalPages: number
  totalItems: number 
  onChangePage: (newPage: number) => void
  onChangeLimit: (newLimit: number) => void
}

export default function Pagination({
  currentPage,
  pageSize,
  totalPages,
  onChangePage,
  onChangeLimit,
}: PaginationProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onChangePage(newPage)
    }
  }

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToTop() // Scroll to top when currentPage changes
  }, [currentPage])

  // This useEffect was trying to reset the page if it became invalid.
  // This logic is better handled in the parent component (StoresList)
  // by ensuring the currentPage passed to Pagination is always valid.
  // For example, if filters change totalPages, StoresList should redirect to page 1 if currentPage is out of bounds.
  // useEffect(() => {
  //   if (currentPage > totalPages && totalPages > 0) {
  //     onChangePage(1); // Suggest parent to change to page 1
  //   } else if (totalPages === 0 && currentPage !== 1) {
  //     onChangePage(1); // If no pages, go to 1 (or handle as no results)
  //   }
  // }, [totalItems, totalPages, currentPage, onChangePage]);

  const handleLimitChange = (newLimit: number) => {
    onChangeLimit(newLimit)
    // The parent (StoresList) will handle setting the page to 1 when limit changes
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 pt-4 w-full">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="limit" className="md:block hidden text-sm text-gray-600">
          แสดงผลต่อหน้า:
        </label>
        <select
          id="limit"
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none transition"
          value={pageSize} // Controlled by pageSize prop
          onChange={(e) => handleLimitChange(Number(e.target.value))}
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="36">36</option>
          <option value="48">48</option>
          <option value="60">60</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Go to first page"
          className={`p-2 rounded-full ${
            currentPage <= 1 ? "text-gray-400 cursor-default" : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage <= 1}
        >
          <MdKeyboardDoubleArrowLeft size={24} />
        </button>
        <button
          aria-label="Go to previous page"
          className={`p-2 rounded-full ${
            currentPage <= 1 ? "text-gray-400 cursor-default" : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <MdKeyboardArrowLeft size={24} />
        </button>

        <span className="text-sm text-gray-600">
          หน้า <span className="font-semibold">{currentPage}</span> จาก{" "}
          <span className="font-semibold">{totalPages > 0 ? totalPages : 1}</span>
        </span>

        <button
          aria-label="Go to next page"
          className={`p-2 rounded-full ${
            currentPage >= totalPages
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <MdKeyboardArrowRight size={24} />
        </button>
        <button
          aria-label="Go to last page"
          className={`p-2 rounded-full ${
            currentPage >= totalPages
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <MdKeyboardDoubleArrowRight size={24} />
        </button>
      </div>
    </div>
  )
}
