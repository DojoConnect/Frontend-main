import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import SearchActionBar from "./SearchActionBar";
import Pagination from "./Pagination";

interface ClassItem {
  id: number | string;
  classImg?: string;
  className: string;
  classLevel?: string;
  instructorImg?: string;
  instructorName?: string;
  enrollmentDate: string;
  status: string;
}

interface ClassesTabProps {
  classes?: ClassItem[];
}

export default function ClassesTab({ classes = [] }: ClassesTabProps) {
  // Empty state:
   if (!classes || classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
        <div className="mt-6 text-black font-semibold text-lg">No Class Enrolled</div>
        <div className="mt-2 text-gray-500 text-sm">No class has been added to this profile.</div>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const rowsPerPage = 3;
  const pagedClasses = classes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <SearchActionBar />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        {classes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No classes found.</div>
        ) : (
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-white-100 border-b border-gray-100 ">
                <th className="p-3 text-left">
                  <input type="checkbox" />
                </th>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-left">Class Level</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Enrollment Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {pagedClasses.map((cls) => (
                <tr key={cls.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <img src={cls.classImg || "/classImage.png"} alt={cls.className} className="w-8 h-8 rounded-md" />
                    <span>{cls.className}</span>
                  </td>
                  <td className="p-3">{cls.classLevel}</td>
                  <td className="p-3 flex items-center gap-2">
                    {cls.instructorImg && (
                      <img src={cls.instructorImg} alt={cls.instructorName} className="w-8 h-8 rounded-full" />
                    )}
                    <span>{cls.instructorName}</span>
                  </td>
                  <td className="p-3">{cls.enrollmentDate}</td>
                  <td className="p-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-600">
                      {cls.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <FaEllipsisV className="bg-white border border-gray-200 rounded-md p-1 w-6 h-6 text-gray-300 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      {classes.length > 0 && (
        <div className="mt-4">
          <Pagination
            totalRows={classes.length}
            rowsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}