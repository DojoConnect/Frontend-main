import React from "react";
import { FaArrowLeft } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar';
import { resolveImageUrl } from '@/lib/imageUrl';

export default function ProfileHeader({ 
  profile,
  onBack,
}: { 
  profile: any;
  onBack: () => void;
}) {
  const imgSrc = resolveImageUrl(profile) || profile.classImg || '';

  return (
    <>
      {/* Go Back Button and Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
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
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-6">
          <Avatar src={imgSrc} alt={profile.className || 'class'} size={64} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover" />
          <div className="flex flex-col items-start">
            <div className="text-base sm:text-2xl font-bold">{profile.className}</div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">{profile.classLevel}</div>
          </div>
        </div>
        <button className="bg-green-600 text-white rounded-full px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold">
          {profile.status}
        </button>
      </div>
    </>
  );
}