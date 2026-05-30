import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type Feedback = {
  status: string;
  date: string;
  time: string;
  name: string;
  email: string;
  userType: string;
  feedback: string;
};

interface FeedbackModalProps {
  feedback: Feedback;
  onClose: () => void;
}

export default function FeedbackModal({ feedback, onClose }: FeedbackModalProps) {
  return (
    <>
      {/* Overlay with reduced opacity */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white z-50 shadow-lg flex flex-col transition-all duration-200">
        {/* Arrow icon */}
        <div className="flex flex-col items-start p-4 border-b">
          <button
            onClick={onClose}
            className="mb-4 bg-white border border-gray-300 rounded-full p-2 cursor-pointer"
            aria-label="Back"
          >
            <FaArrowLeft className="text-black" />
          </button>
          <div className="flex items-center w-full">
            <span className="font-bold text-black text-base sm:text-lg mr-3">Feedback</span>
            {feedback.status === "In-Review" ? (
              <span className="rounded-full px-2 sm:px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500 whitespace-nowrap">
                In-Review
              </span>
            ) : (
              <span className="rounded-full px-2 sm:px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 whitespace-nowrap">
                Resolved
              </span>
            )}
          </div>
        </div>
        {/* Info */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="font-bold text-black text-base sm:text-lg mb-3">Feedback Info</div>
            <div className="space-y-3">
              <div className="flex justify-between gap-2">
                <span className="text-gray-400 text-xs">Date/Time</span>
                <span className="text-black text-xs sm:text-base">{feedback.date} {feedback.time}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400 text-xs">User Name</span>
                <span className="text-black text-xs sm:text-base">{feedback.name}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400 text-xs">Email</span>
                <span className="text-black text-xs sm:text-base">{feedback.email}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400 text-xs">User Type</span>
                <span className="text-black text-xs sm:text-base">{feedback.userType}</span>
              </div>
            </div>
          </div>
          <div className="mb-2 font-semibold text-black text-sm sm:text-base">Feedback Description</div>
          <div className="text-black text-xs sm:text-base">{feedback.feedback}</div>
        </div>
        {/* Footer Button */}
        <div className="p-4 border-t">
          {feedback.status === "In-Review" ? (
            <button
              className="w-full rounded-md bg-red-500 text-white py-2 font-semibold cursor-pointer text-xs sm:text-base"
            >
              Mark as Resolved
            </button>
          ) : (
            <button
              className="w-full rounded-md bg-gray-400 text-white py-2 font-semibold cursor-pointer text-xs sm:text-base"
              disabled
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </div>
    </>
  );
}