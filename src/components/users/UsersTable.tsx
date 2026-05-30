import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEye, FaTrash, FaTimes } from "react-icons/fa";

// Define the User type or import it from the appropriate file
interface User {
  id: string | number;
  name: string;
  email: string;
  userType: string;
  joinedDate: string;
  lastActivity: string;
  status: string;
  avatar: string;
}

const statusStyleMap: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-600",
  disabled: "bg-gray-200 text-gray-600",
  draft: "bg-gray-100 text-gray-500",
};

interface UsersTableProps {
  user: User[];
  onUserClick?: (user: User) => void;
  onDeleteClick?: (user: User) => void;
  showUserType?: boolean;
}

export default function UsersTable({ user, onUserClick, onDeleteClick, showUserType = true }: UsersTableProps) {
  const [actionUser, setActionUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close action menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setActionUser(null);
      }
    }
    if (actionUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionUser]);

  return (
    <>
      {/* Responsive Table Wrapper */}
      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="min-w-[700px] w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 sm:px-4 py-2 sm:py-3">
                <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4" />
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">Email</th>
              {showUserType && (
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">User Type</th>
              )}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">Joined Date</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">Last Activity</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-500">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {user.map((u) => (
              <tr key={u.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => { onUserClick && onUserClick(u) }}
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4" />
                </td>
                <td className="flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3">
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                  <span className="text-[11px] sm:text-xs">{u.name}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-xs">{u.email}</td>
                {showUserType && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-xs">{u.userType}</td>
                )}
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-xs">{u.joinedDate}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-xs">{u.lastActivity}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-semibold ${statusStyleMap[(u.status || "active").toLowerCase()] || "bg-gray-100 text-gray-500"}`}>
                    {(u.status || "Active").charAt(0).toUpperCase() + (u.status || "Active").slice(1)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-right relative" onClick={e => e.stopPropagation()}>
                  <FaEllipsisV
                    className="text-gray-400 inline cursor-pointer text-xs sm:text-base"
                    onClick={() => setActionUser(u)}
                  />
                  {actionUser && actionUser.id === u.id && (
                    <div
                      ref={actionMenuRef}
                      className="absolute right-0 mt-2 w-36 sm:w-44 bg-white rounded-md shadow-lg border z-50"
                    >
                      <button
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-50 text-xs sm:text-sm"
                        onClick={() => {
                          onUserClick && onUserClick(u);
                          setActionUser(null);
                        }}
                      >
                        <FaEye className="text-gray-500 mr-2 text-xs sm:text-base" /> View Details
                      </button>
                      <button
                        className="flex items-center w-full px-3 py-2 hover:bg-red-50 text-xs sm:text-sm"
                        onClick={() => {
                          if (onDeleteClick) onDeleteClick(u);
                          setActionUser(null);
                        }}
                      >
                        <FaTrash className="text-red-500 mr-2 text-xs sm:text-base" />
                        <span className="text-red-600">Remove profile</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal (unchanged) */}
      {showDeleteModal && deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="bg-white rounded-md p-6 w-full max-w-xs shadow-lg relative">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-red-100 text-red-600 rounded-full p-2">
                <FaTrash className="w-5 h-5" />
              </span>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-2 text-start font-semibold text-lg text-black">
              Delete Profile
            </div>
            <div className="mb-6 text-start text-gray-500 text-sm">
              Are you sure you want to remove <span className="text-black">{deleteUser.name.split(" ")[0]}</span>'s profile? This action cannot be undone.
            </div>
            <div className="flex gap-2">
              <button
                className="bg-gray-100 text-gray-700 rounded-md px-4 py-2 font-medium w-full"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white rounded-md px-4 py-2 font-medium w-full"
                onClick={async () => {
                  try {
                    await fetch(`https://apis.dojoconnect.app/admin/users/${deleteUser.email}`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ confirm: true }),
                    });
                  } catch (err) {
                    // handle error if needed
                  }
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}