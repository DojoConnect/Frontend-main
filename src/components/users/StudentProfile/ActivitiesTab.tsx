import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import SearchActionBar from "./SearchActionBar";
import Pagination from "./Pagination";

interface Activity {
  type: string;
  description: string;
  date: string;
}

interface ActivitiesTabProps {
  activities?: Activity[];
}
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


export default function ActivitiesTab({ activities = [] }: ActivitiesTabProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;
  const totalPages = Math.ceil(activities.length / rowsPerPage);
  const pagedActivities = activities.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (activities.length === 0) {
    return (
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
          <div className="mt-6 text-black font-semibold text-lg">No Activities Found</div>
          <div className="mt-2 text-gray-500 text-sm">No activity records available for this user.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <SearchActionBar />
      {/* Border line just before the table, no space */}
      <div className="border-b border-gray-200" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-white">
                <th className="p-3 text-left text-black font-medium text-xs sm:text-sm">Activity Type</th>
                <th className="p-3 text-left text-black font-medium text-xs sm:text-sm">Description</th>
                <th className="p-3 text-left text-black font-medium text-xs sm:text-sm">Date &amp; Time Added</th>
                <th className="p-3 text-left text-black font-medium text-xs sm:text-sm"></th>
              </tr>
              {/* Light gray border line below table head */}
              <tr>
                <td colSpan={4} className="border-b border-gray-200 p-0"></td>
              </tr>
            </thead>
            <tbody>
              {pagedActivities.map((act, idx) => (
                <tr key={idx} className="bg-white border-b border-gray-200 last:border-b-0 h-14">
                  <td className="p-3 text-xs sm:text-sm">{act.type}</td>
                  <td className="p-3 text-xs sm:text-sm">{act.description}</td>
                  <td className="p-3 text-xs sm:text-sm">{formatDate(act.date)}</td>
                  <td className="p-3">
                    <FaEllipsisV className="border border-gray-200 rounded-md p-1 w-6 h-6 text-gray-400 bg-white cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
      {/* Pagination with all-round border */}
      {activities.length > 0 && (
        <div className="rounded-md p-2 mt-4">
          <Pagination
            totalRows={activities.length}
            rowsPerPage={rowsPerPage}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}