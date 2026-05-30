import React from "react";
import { FaArrowLeft } from 'react-icons/fa';

// Define statusStyles for different user statuses
const statusStyles: { [key: string]: string } = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  banned: "bg-red-100 text-red-700",
};

export default function ProfileHeader({ 
  profile,
  onBack,
}: { 
  profile: any;
  onBack: () => void;
}) {
  return (
    <>
      {/* Go Back Button and Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="flex md:items-center items-start  justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition"
          aria-label="Go Back"
          type="button"
        >
          <FaArrowLeft className="text-black text-xs sm:text-base" />
        </button>
        <span className="text-gray-500 text-xs sm:text-sm mr-1 sm:mr-2">Go Back</span>
        <span className="text-gray-400 mx-1 sm:mx-2">|</span>
        <span className="text-gray-500 text-xs sm:text-sm">User</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-gray-500 text-xs sm:text-sm">User List</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-red-600 text-xs sm:text-sm font-semibold">User Profile</span>
      </div>
      {/* Profile Info Row */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <img
          src={profile.classImg}
          alt={profile.className}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mr-3 sm:mr-6"
        />
        <div className="flex flex-col items-start mr-3 sm:mr-6">
          <div className="text-base sm:text-xl font-bold">{profile.name}</div>
          <div className="text-gray-500 text-xs sm:text-sm mt-1">{profile.email}</div>
        </div>
         <button
          className={`rounded-full px-3 py-1 sm:px-6 sm:py-2 text-[11px] sm:text-sm font-semibold capitalize ${statusStyles[(profile.status || "active").toLowerCase()] || "bg-gray-100 text-gray-500"}`}
        >
          {(profile.status || "Active").charAt(0).toUpperCase() + (profile.status || "Active").slice(1)}
        </button>
      </div>
    </>
  );
}