import React from "react";
import { FaArrowLeft } from 'react-icons/fa';

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
          className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition"
          aria-label="Go Back"
          type="button"
        >
          <FaArrowLeft className="text-black text-xs sm:text-base" />
        </button>
        <span className="text-gray-500 text-xs sm:text-sm mr-1 sm:mr-2">Go Back</span>
        <span className="text-gray-400 mx-1 sm:mx-2">|</span>
        <span className="text-gray-500 text-xs sm:text-sm">Classes</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-gray-500 text-xs sm:text-sm">Class List</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-red-600 text-xs sm:text-sm font-semibold">Class Profile</span>
      </div>
      {/* Profile Info Row */}
      <div className="flex md:items-center items-start justify-center mb-6 sm:mb-8">
        <img
          src={profile.classImg}
          alt={profile.className}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mr-3 sm:mr-6"
        />
        <div className="flex flex-col items-start mr-3 sm:mr-6">
          <div className="text-base sm:text-xl font-bold">{profile.className}</div>
          <div className="text-gray-500 text-xs sm:text-sm mt-1">{profile.classLevel}</div>
        </div>
        <button className="bg-green-600 text-white rounded-full px-3 sm:px-5 py-1 sm:py-2 text-xs sm:text-sm font-semibold">
          {profile.status}
        </button>
      </div>
    </>
  );
}