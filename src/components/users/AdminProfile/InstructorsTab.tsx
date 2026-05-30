import React, { useState } from "react";
import Pagination from "../StudentProfile/Pagination";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import ProfileFormModal from "../ProfileFormModal";
import ConfirmProfileModal from "../ConfirmProfileModal";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-600",
  Disabled: "bg-yellow-100 text-yellow-600",
};

export default function InstructorsTab({ instructors = [], refreshInstructors }: { instructors?: any[], refreshInstructors?: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Modal flow: open form, then confirm, then create
  const handleCreateClick = () => setShowForm(true);
  const handleFormConfirm = (payload: any) => {
    setPendingPayload(payload);
    setShowForm(false);
    setShowConfirm(true);
  };
  const handleConfirm = async () => {
    if (!pendingPayload) return;
    setLoading(true);
    try {
      await fetch("https://backoffice-api.dojoconnect.app/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload),
      });
      setShowConfirm(false);
      setPendingPayload(null);
      setLoading(false);
      if (refreshInstructors) refreshInstructors();
    } catch {
      setShowConfirm(false);
      setPendingPayload(null);
      setLoading(false);
    }
  };

 if (!instructors.length) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-96">
          {/* SVG illustration for empty state */}
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
          <div className="mt-6 text-black font-semibold text-lg">No Instructor Added</div>
          <div className="mt-2 text-gray-500 text-sm">No instructor has been added to this profile.</div>
          <button
            className="mt-6 flex items-center bg-[#E51B1B] text-white px-6 py-2 rounded-md font-semibold cursor-pointer"
            onClick={handleCreateClick}
          >
            <FaPlus className="mr-2" /> Add Instructor
          </button>
        </div>
        {showForm && (
          <ProfileFormModal
            type="instructor"
            onClose={() => setShowForm(false)}
            onConfirm={handleFormConfirm}
          />
        )}
        {showConfirm && (
          <ConfirmProfileModal
            onCancel={() => setShowConfirm(false)}
            onConfirm={handleConfirm}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-200">
                <th className="p-3 text-left text-black font-medium">
                  <input type="checkbox" />
                </th>
                <th className="p-3 text-left text-black font-medium">Name</th>
                <th className="p-3 text-left text-black font-medium">Email</th>
                <th className="p-3 text-left text-black font-medium">Joined Date</th>
                <th className="p-3 text-left text-black font-medium">Last Activity</th>
                <th className="p-3 text-left text-black font-medium">Status</th>
                <th className="p-3 text-left text-black font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst, idx) => (
                <tr key={idx} className="bg-white border-b border-gray-200 last:border-b-0 h-14">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <img src={inst.img} alt={inst.name} className="w-8 h-8 rounded-full" />
                    <span>{inst.name}</span>
                  </td>
                  <td className="p-3">{inst.email}</td>
                  <td className="p-3">{inst.joined}</td>
                  <td className="p-3">{inst.lastActivity}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[inst.status as keyof typeof statusStyles]}`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <FaEllipsisV className="border border-gray-200 rounded-md p-1 w-6 h-6 text-gray-400 bg-white cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2 mt-4">
          <Pagination
            totalRows={instructors.length}
            currentPage={1}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </>
    );
  }