"use client"
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import Avatar from '@/components/ui/Avatar';

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
  const [avatarSize, setAvatarSize] = useState<number>(64);

  useEffect(() => {
    function update() {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      // On small screens prioritize avatar size by making text smaller
      setAvatarSize(w < 640 ? 96 : 64);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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
        <span className="text-gray-500 text-xs sm:text-sm">Users</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-gray-500 text-xs sm:text-sm">User List</span>
        <span className="text-gray-400 mx-1 sm:mx-2">/</span>
        <span className="text-red-600 text-xs sm:text-sm font-semibold">User Profile</span>
      </div>
      {/* Profile Info Row */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center">
          {(() => {
            const base = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || '';
            const possible = profile?.avatar || profile?.avatarUrl || profile?.imageUrl || profile?.image || profile?.profileImage || profile?.picture || profile?.cloudinary_url || profile?.profile_picture;
            let avatarSrc: string | undefined;
            if (possible && typeof possible === 'string') {
              if (possible.startsWith('http')) {
                avatarSrc = possible;
              } else if (possible.startsWith('/')) {
                avatarSrc = `${base}${possible}`;
              } else {
                avatarSrc = `${base}/${possible}`;
              }
            } else if (profile?.avatar_public_id || profile?.avatarPublicId) {
              const id = profile.avatar_public_id || profile.avatarPublicId;
              avatarSrc = `${base}/images/${id}`;
            } else if (profile?.image_path) {
              avatarSrc = `${base}/${profile.image_path}`;
            } else {
              avatarSrc = undefined;
            }
            return <Avatar src={avatarSrc} alt={profile.name || profile.className} size={avatarSize} className="mr-3 sm:mr-6" />;
          })()}
          <div className="flex flex-col items-start">
            <div className="text-base sm:text-2xl font-bold capitalize">{profile.name}</div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">{profile.email}</div>
          </div>
        </div>
        <button
          className={`rounded-full px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-semibold capitalize ${statusStyles[(profile.status || "active").toLowerCase()] || "bg-gray-100 text-gray-500"}`}
        >
          {(profile.status || "Active").charAt(0).toUpperCase() + (profile.status || "Active").slice(1)}
        </button>
      </div>
    </>
  );
}