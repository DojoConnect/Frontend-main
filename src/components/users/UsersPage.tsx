'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaFilter, FaDownload, FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp } from "react-icons/fi";
import UsersTable from "./UsersTable";
import UserSummary from "./UserSummary";
import Pagination from "./Pagination";
import ExportModal from './ExportModal';
import CreateProfileModal from "./CreateProfileModal";

const FILTERS = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "All time", value: "all" },
  { label: "Custom date", value: "custom" },
];

const ROLE_DISPLAY_MAP: Record<string, string> = {
  admin: "School Admin",
  instructor: "Instructor",
  parent: "Parent",
  child: "Student",
  student: "Student",
};

const TABS = [
  { label: "All Users", value: "all" },
  { label: "School Admins", value: "admin" },
  { label: "Instructors", value: "instructor" },
  { label: "Parents", value: "parent" },
  { label: "Students", value: "student" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 20 }, (_, i) => 2016 + i);

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("today");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthYearModal, setShowMonthYearModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [customRange, setCustomRange] = useState<{ start?: string, end?: string }>({});
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [monthPage, setMonthPage] = useState(0);
  const [yearPage, setYearPage] = useState(0);
  const [tempMonth, setTempMonth] = useState(calendarMonth);
  const [tempYear, setTempYear] = useState(calendarYear);
  const [highlightRange, setHighlightRange] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });

  const [showExportModal, setShowExportModal] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<any>(null);

  const handleDeleteClick = (user: any) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  // Fetch users from backend with filter
  useEffect(() => {
    setLoading(true);
    let body: any = { period: activeFilter };
    if (activeFilter === "custom" && customRange.start && customRange.end) {
      body.startDate = customRange.start;
      body.endDate = customRange.end;
    }
    fetch("https://backoffice-api.dojoconnect.app/get_users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setUsers(
            data.data.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              userType: ROLE_DISPLAY_MAP[u.role] || u.role,
              joinedDate: u.created_at ? u.created_at.split(" ")[0] : "",
              lastActivity: u.last_activity || "-",
              status: u.subscription_status ? u.subscription_status.charAt(0).toUpperCase() + u.subscription_status.slice(1) : "Inactive",
              avatar: u.avatar && u.avatar !== "" ? u.avatar : "/default-avatar.png",
            }))
          );
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  }, [activeFilter, customRange]);

  // Filtered users for current tab
  const filteredUsers =
    activeTab === "all"
      ? users
      : activeTab === "student"
        ? users.filter((u) => ["student", "child"].includes((u.role || "").toLowerCase()))
        : users.filter((u) => (u.role || "").toLowerCase() === activeTab);

  // Filtered users for current page
  const pagedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, users]);

  // Count for each backend role
  const getCount = (type: string) =>
    type === "all"
      ? users.length
      : users.filter((u) => u.role === type).length;

  const handleUserClick = (user: any) => {
    if ((user.role || "").toLowerCase() === "admin") {
      router.push(`/dashboard/users/school-admin/${user.id}`);
    } else if ((user.role || "").toLowerCase() === "instructor") {
      router.push(`/dashboard/users/instructor/${user.id}`);
    } else if ((user.role || "").toLowerCase() === "parent") {
      router.push(`/dashboard/users/parent/${user.id}`);
    } else if (["student", "child"].includes((user.role || "").toLowerCase())) {
      router.push(`/dashboard/users/student/${user.id}`);
    } else {
      router.push(`/dashboard/users/${user.id}`);
    }
  };

  // Counts for summary
  const adminCount = users.filter(u => (u.role || "").toLowerCase() === "admin").length;
  const instructorCount = users.filter(u => (u.role || "").toLowerCase() === "instructor").length;
  const parentCount = users.filter(u => (u.role || "").toLowerCase() === "parent").length;
  const studentCount = users.filter(u => ["student", "child"].includes((u.role || "").toLowerCase())).length;

  // Calendar logic
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => ({
    day: new Date(calendarYear, calendarMonth, -firstDayOfWeek + i + 1).getDate(),
    isPrev: true
  }));
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isPrev: false
  }));
  const calendarDays = [...prevMonthDays, ...monthDays];

  return (
    <div className="px-0 md:px-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl text-[#0F1828] font-semibold">Users</h1>
        <div className="flex flex-wrap gap-2 sm:justify-end relative">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`px-3 sm:px-4 py-1 border rounded-full whitespace-nowrap flex items-center gap-1 cursor-pointer text-xs sm:text-sm
                ${activeFilter === f.value
                  ? 'bg-red-100 text-red-600 border-red-300'
                  : 'bg-white text-gray-600 border-gray-300'
                }`}
              onClick={() => {
                setActiveFilter(f.value);
                if (f.value === "custom") setShowCalendar(true);
                else setShowCalendar(false);
              }}
            >
              {f.label}
              {f.value === "custom" && <FiChevronDown className="text-gray-500 text-base sm:text-lg" />}
            </button>
          ))}
        </div>
      </div>
      {/* Calendar Modal */}
      {/* ...no changes here... */}
      {/* User Summary */}
      <div className="mb-4">
        <UserSummary
          adminCount={adminCount}
          instructorCount={instructorCount}
          parentCount={parentCount}
          studentCount={studentCount}
        />
      </div>
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-4 mb-6 border-b border-gray-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const isAll = tab.value === "all";
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap
                ${isActive
                  ? "border-b-2 border-red-600"
                  : "border-b-2 border-transparent hover:text-red-600"}
                bg-transparent rounded-t cursor-pointer
              `}
              style={{ outline: "none", background: "none", color: isActive ? "#EB5017" : "#70707A" }}
            >
              {tab.label}
              {isAll && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-white bg-red-600 text-[10px] sm:text-xs font-semibold">
                  {getCount("all")}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/* Controls: Search, Filter, Export */}
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between bg-white rounded-xl p-2 sm:p-4 mb-8"
        style={{ border: "1px solid #E4E7EC" }}>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center border rounded px-2 py-1 bg-white w-[140px] sm:w-auto text-xs sm:text-sm">
            <FaSearch className="text-gray-400 mr-2 text-xs sm:text-base" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full text-xs sm:text-sm"
              style={{ minWidth: 0 }}
            />
          </div>
          <div className="flex items-center border rounded px-2 py-1 bg-white w-[90px] sm:w-auto text-xs sm:text-sm">
            <FaFilter className="text-gray-400 mr-2 text-xs sm:text-base" />
            <span>Filter</span>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 relative w-full sm:w-auto justify-end">
          {/* Create New Button */}
          <button
            className="flex items-center gap-1 sm:gap-2 bg-red-600 border cursor-pointer border-red-600 text-white rounded-md px-2 sm:px-4 py-1.5 sm:py-2 font-medium shadow hover:bg-red-700 transition text-xs sm:text-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus className="text-white text-xs sm:text-base" />
            <span>Create New</span>
          </button>
          {/* Export Button */}
          <button
            className="flex items-center gap-1 sm:gap-2 bg-white border cursor-pointer border-red-600 text-red-600 rounded-md px-2 sm:px-4 py-1.5 sm:py-2 font-medium shadow hover:bg-red-50 transition text-xs sm:text-sm"
            onClick={() => setShowExportModal((prev) => !prev)}
          >
            <FaDownload className="text-red-600 text-xs sm:text-base" />
            Export
          </button>
          {showExportModal && (
            <>
              {/* Overlay to close modal when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                style={{ background: "transparent" }}
                onClick={() => setShowExportModal(false)}
              />
              <ExportModal
                onClose={() => setShowExportModal(false)}
                // filters={yourFiltersObject}
                includeAll={true}
              />
            </>
          )}
        </div>
      </div>
      {/* Table/Grid or Empty State */}
      <div className="bg-white rounded-xl p-0 overflow-x-auto" style={{ border: "1px solid #E4E7EC" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex bg-white mt-4 flex-col items-center justify-center py-16 sm:py-20 rounded-xl "
            style={{ border: '1px solid #E4E7EC' }}>
            <img
              src="https://res.cloudinary.com/cloud-two-tech/image/upload/v1750963970/Illustration_found_gfbbgd.png"
              alt="No data"
              className="w-[160px] h-[130px] sm:w-[225px] sm:h-[188px] mb-4"
            />
            <h2 className="text-lg sm:text-2xl font-semibold text-[#303030] text-center">Nothing here yet...</h2>
            <p className="text-sm sm:text-base text-[#9E9E9E] mt-3 text-center">Whoops ... there’s no information available yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <UsersTable
                user={pagedUsers}
                onUserClick={handleUserClick}
                onDeleteClick={handleDeleteClick}
                // You should update UsersTable to use responsive font, icon, and image sizes!
              />
            </div>
            <Pagination
              totalRows={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      {/* Create Profile Modal */}
      {showCreateModal && (
        <CreateProfileModal
          onClose={() => {
            setShowCreateModal(false);
            // Optionally refetch users
          }}
        />
      )}
      {showDeleteModal && deleteUser && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.06)" }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="absolute z-60 bg-white rounded-md p-6 w-full max-w-xs shadow-lg"
            style={{
              left: deleteUser?.modalPosition?.x ?? "50%",
              top: deleteUser?.modalPosition?.y ?? "30%",
              transform: deleteUser?.modalPosition
                ? "translate(0, 0)"
                : "translate(-50%, 0)",
            }}
            onClick={e => e.stopPropagation()}
          >
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
                  } catch (err) { }
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}