import { FaEllipsisV } from "react-icons/fa";
import SearchActionBar from './SearchActionBar'

export default function ActivitiesTable({ activities }: { activities: any[] }) {
  // Empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" className="sm:w-[150px] sm:h-[150px]">
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
        <div className="mt-4 sm:mt-6 text-black font-semibold text-base sm:text-lg">No Activities</div>
        <div className="mt-2 text-gray-500 text-xs sm:text-sm">No activities on this this class.</div>
      </div>
    );
  }

  return (
    <>
      <SearchActionBar />
      <div className="rounded-md border border-gray-200 bg-white px-2 sm:px-6 py-3 sm:py-4 overflow-x-auto">
        <table className="min-w-[600px] w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-white-50">
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-500 font-semibold">Activity Type</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-500 font-semibold">Description</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-500 font-semibold">Date & Time Added</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500">{activity.type}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500">{activity.description}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500">{activity.dateTime}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-right">
                  <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-gray-200 bg-white">
                    <FaEllipsisV className="text-gray-400 text-xs sm:text-base" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}