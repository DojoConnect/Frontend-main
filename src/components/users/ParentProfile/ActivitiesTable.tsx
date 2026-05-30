import React from 'react';
import { FaEllipsisV } from "react-icons/fa";
import Pagination from '../Pagination';
import SearchActionBar from './SearchActionBar';

// Helper to capitalize first letter of each word
const capitalizeWords = (str: string = "") =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

// Helper to format date as "Mon DD, YYYY HH:MM AM/PM"
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface Activity {
  id?: string | number;
  type: string;
  description?: string;
  reference?: string;
  created_at: string;
}

interface ActivitiesTableProps {
  activitiesData: Activity[];
}

export default function ActivitiesTable({ activitiesData }: ActivitiesTableProps) {
  if (!activitiesData || activitiesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
        <div className="mt-6 text-black font-semibold text-lg">No Activities</div>
        <div className="mt-2 text-gray-500 text-sm">No activities found for this user.</div>
      </div>
    );
  }
  return (
    <div>
      <SearchActionBar />
      <div className="rounded-lg border bg-white mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Activity Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date &amp; Time</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {activitiesData && activitiesData.length > 0 ? (
              activitiesData.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3">{capitalizeWords(row.type)}</td>
                  <td className="px-4 py-3">{capitalizeWords(row.description || "-")}</td>
                  <td className="px-4 py-3">{row.reference || "-"}</td>
                  <td className="px-4 py-3">{formatDateTime(row.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="bg-white rounded-md p-1 shadow">
                      <FaEllipsisV className="text-gray-400 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No activities found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination
            totalRows={activitiesData.length}
            currentPage={1}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}