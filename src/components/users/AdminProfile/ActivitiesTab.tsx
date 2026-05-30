import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import SearchActionBar from "../StudentProfile/SearchActionBar";
import Pagination from "../StudentProfile/Pagination";

interface Activity {
  id: string | number;
  type: string;
  description: string;
  date: string;
  time: string;
}

export default function ActivitiesTab({ activities = [] }: { activities?: Activity[] }) {
  // Empty state:
     if (!activities || activities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="none"><path fill="url(#a)" d="M75 150c41.421 0 75-33.579 75-75S116.421 0 75 0 0 33.579 0 75s33.579 75 75 75Z"/><path fill="#fff" d="M120 150H30V53a16.018 16.018 0 0 0 16-16h58a15.906 15.906 0 0 0 4.691 11.308A15.89 15.89 0 0 0 120 53v97Z"/><path fill="#E51B1B" d="M75 102c13.255 0 24-10.745 24-24S88.255 54 75 54 51 64.745 51 78s10.745 24 24 24Z"/><path fill="#fff" d="M83.485 89.314 75 80.829l-8.485 8.485-2.829-2.829L72.172 78l-8.486-8.485 2.829-2.829L75 75.172l8.485-8.486 2.829 2.829L77.828 78l8.486 8.485-2.829 2.829Z"/><path fill="#FCDEDE" d="M88 108H62a3 3 0 1 0 0 6h26a3 3 0 1 0 0-6ZM97 120H53a3 3 0 1 0 0 6h44a3 3 0 1 0 0-6Z"/><defs><linearGradient id="a" x1="75" x2="75" y1="0" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#FCEDED"/><stop offset="1" stopColor="#FCDEDE"/></linearGradient></defs></svg>
          <div className="mt-6 text-black font-semibold text-lg">No Activities found </div>
          <div className="mt-2 text-gray-500 text-sm">No activity has been added to this profile.</div>
        </div>
      );
    }

  return (
    <div className="bg-white-100 rounded-md p-4">
      <SearchActionBar />
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 rounded-md">
            <th className="p-3 rounded-l-md text-left">Activity Type</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time Added</th>
            <th className="p-3 rounded-r-md text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act) => (
            <tr key={act.id} className="border-b">
              <td className="p-3">{act.type}</td>
              <td className="p-3">{act.description}</td>
              <td className="p-3">{act.date}</td>
              <td className="p-3">{act.time}</td>
              <td className="p-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  <FaEllipsisV className="border border-gray-300 rounded-md p-2 bg-white text-gray-400" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rounded-md p-2 mt-4">
       <Pagination
      totalRows={activities.length}
      currentPage={1}
      onPageChange={() => {}}
      />
      </div>
    </div>
  );
}