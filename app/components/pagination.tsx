"use client";
import React, { useState, useEffect } from "react";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface PaginationProps {
  totalPages: number;
  filteredData: number;
  onChangePage: (newPage: number) => void;
  onChangeLimit: (newLimit: number) => void;
}

export default function Pagination({
  totalPages,
  filteredData,
  onChangePage,
  onChangeLimit,
}: PaginationProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onChangePage(newPage);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // เพิ่ม animation
      });
    }
  };

  useEffect(() => {
    scrollToTop(); // เลื่อนขึ้นด้านบนทุกครั้งที่เปลี่ยนหน้า
  }, [page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [filteredData, totalPages]);

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    onChangeLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 first:pt-4 w-full">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="limit" className="md:block hidden text-sm text-gray-600">
          แสดงผลต่อหน้า:
        </label>
        <select
          id="limit"
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none transition"
          value={limit}
          onChange={(e) => changeLimit(Number(e.target.value))}
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
          className={`p-2 rounded-full ${
            page <= 1
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => changePage(1)}
          disabled={page <= 1}
        >
          <MdKeyboardDoubleArrowLeft size={24} />
        </button>
        <button
          className={`p-2 rounded-full ${
            page <= 1
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => changePage(page - 1)}
          disabled={page <= 1}
        >
          <MdKeyboardArrowLeft size={24} />
        </button>

        <span className="text-sm text-gray-600">
          หน้า <span className="font-semibold">{page}</span> จาก{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          className={`p-2 rounded-full ${
            page >= totalPages
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => changePage(page + 1)}
          disabled={page >= totalPages}
        >
          <MdKeyboardArrowRight size={24} />
        </button>
        <button
          className={`p-2 rounded-full ${
            page >= totalPages
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200 text-gray-600 cursor-pointer"
          }`}
          onClick={() => changePage(totalPages)}
          disabled={page >= totalPages}
        >
          <MdKeyboardDoubleArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
