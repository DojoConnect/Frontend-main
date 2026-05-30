import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import SearchActionBar from "./SearchActionBar";
import Pagination from "./Pagination";

// Helper: format date as 'Day, Month Date, Year'
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AssignedClassesTable({ assignedClasses }: { assignedClasses: any[] }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pagedClasses = assignedClasses.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="mt-6">
      {assignedClasses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none">
              <path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/>
              <path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/>
              <path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/>
              <path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/>
              <path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/>
              <defs>
                <linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCEDED"/>
                  <stop offset="1" stopColor="#FCDEDE"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-6 text-black font-semibold text-lg">No Assigned Classes Found</div>
            <div className="mt-2 text-gray-500 text-sm">No assigned class records available for this user.</div>
          </div>
        </div>
      ) : (
        <>
          <SearchActionBar />
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 rounded-md">
                  <th className="p-3 rounded-l-md text-left">Class Name</th>
                  <th className="p-3 text-left">Class Level</th>
                  <th className="p-3 text-left">Enrolled Students</th>
                  <th className="p-3 text-left">Date Assigned</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 rounded-r-md text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedClasses.map((cls, idx) => (
                  <tr key={cls.class_uid || cls.id || idx} className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <img src={`/${cls.image_path || "classImage.png"}`} alt={cls.class_name} className="w-10 h-10 rounded-md" />
                      <span>{cls.class_name}</span>
                    </td>
                    <td className="p-3">{cls.level}</td>
                    <td className="p-3">{cls.capacity}</td>
                    <td className="p-3">{formatDate(cls.created_at)}</td>
                    <td className="p-3">
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                        {cls.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <FaEllipsisV className="border border-gray-300 rounded-md p-1 bg-white text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalRows={assignedClasses.length}
            rowsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}