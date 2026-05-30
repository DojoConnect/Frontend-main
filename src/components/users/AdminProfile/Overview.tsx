import React, { useState } from "react";
import { FaUser, FaEnvelope, FaCopy, FaCalendarAlt } from "react-icons/fa";

interface ProfileOverviewProps {
  profile: any;
}

// Helper: fallback for missing fields
const fallback = (val: any, alt: string = "-") => val || alt;

// Helper: format date as 'Day, Month Date, Year'
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
  const instructors = profile.overview_metrics?.total_instructors ?? profile.total_instructors ?? profile.instructors ?? 0;
  const activeStudents = profile.overview_metrics?.total_students ?? profile.total_students ?? profile.activeStudents ?? 0;
  const runningClasses = profile.overview_metrics?.total_classes ?? profile.total_classes ?? profile.runningClasses ?? 0;
  const avgAttendance = profile.overview_metrics?.avg_attendance ?? profile.avgAttendance ?? "-";

  const [showActions, setShowActions] = useState(false);
  const [modal, setModal] = useState<null | "deactivate" | "export" | "delete" | "status">(null);

  // Editable fields state for edit section
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    dojoName: profile.dojo_name || "",
    email: profile.email || "",
    role: profile.role || "",
    joined: profile.joined || profile.created_at || "",
    location: profile.location || profile.city || "",
    currentPlan: profile.current_plan || "",
    subscriptionType: profile.subscription_type || "",
    paymentStatus: profile.payment_status || "",
    renewalDate: profile.subscription_renewal || "",
    accountStatus: profile.account_status || profile.status || "",
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  // Modal layout
  const ModalCard = ({
    icon,
    title,
    description,
    confirmText,
    onConfirm,
    showCancel = true,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
    showCancel?: boolean;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.03)" }}>
      <div className="bg-white rounded-md p-6 w-full max-w-sm relative shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">{icon}</div>
          <button className="text-gray-400 ml-2" onClick={() => setModal(null)}>✕</button>
        </div>
        <div className="text-lg font-semibold mb-1 text-left">{title}</div>
        <div className="text-gray-600 mb-4 text-left text-sm">{description}</div>
        <div className="flex justify-end gap-2 mt-2">
          {showCancel && (
            <button className="bg-gray-200 text-black rounded px-4 py-1.5 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
          )}
          <button
            className="bg-[#E51B1B] text-white rounded px-4 py-1.5 text-sm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Profile Form
  if (editMode) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-4 w-full">
          <span className="text-gray-700 font-semibold">Edit Profile</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editable fields */}
          <div className="space-y-4">
            <label className="block text-gray-700 text-sm mb-1">Dojo Owner First Name</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="firstName" value={editFields.firstName} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Dojo Owner Last Name</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="lastName" value={editFields.lastName} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Dojo Name</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="dojoName" value={editFields.dojoName} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Contact Email</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="email" value={editFields.email} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="role" value={editFields.role} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Joined</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="joined" value={editFields.joined} onChange={handleEditChange} />
          </div>
          {/* Readonly fields */}
          <div className="space-y-4">
            <label className="block text-gray-400 text-sm mb-1">Dojo Location</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.location} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Current Plan</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.currentPlan} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Subscription Type</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.subscriptionType} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Payment Status</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.paymentStatus} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Subscription Renewal Date</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.renewalDate} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Account Status</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={editFields.accountStatus} readOnly />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="bg-gray-200 text-black rounded px-4 py-1.5 text-sm" onClick={() => setEditMode(false)}>Cancel</button>
          <button className="bg-[#E51B1B] text-white rounded px-4 py-1.5 text-sm" onClick={() => setModal("status")}>Save Changes</button>
        </div>
        {/* Save Changes Modal */}
        {modal === "status" && (
          <ModalCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#D1FADF" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#ECFDF3" strokeWidth="4" rx="14"/><path stroke="#039855" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13.5 16 2 2 4-4"/></svg>
            }
            title="Save Changes"
            description="You are about to save profile changes."
            confirmText="Confirm"
            onConfirm={() => { setModal(null); setEditMode(false); }}
          />
        )}
      </div>
    );
  }

  // Default Overview
  return (
    <div className="space-y-8">
      {/* Basic user info row */}
      <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-4 w-full">
        <span className="text-gray-700 font-semibold">Basic user information</span>
        {/* Actions Button and Dropdown */}
        <div className="relative">
          <button
            className="flex items-center border border-gray-500 rounded-md px-6 py-3 bg-white text-black cursor-pointer"
            onClick={() => setShowActions((v) => !v)}
          >
            Actions
            <svg className="w-4 h-4 text-gray-700 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
              <button
                className="flex items-center w-full px-4 py-3 hover:bg-gray-100"
                onClick={() => { setEditMode(true); setShowActions(false); }}
              >
                {/* Edit SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="mr-2"><path stroke="#737373" strokeLinecap="round" strokeLinejoin="round" d="m11.241 2.991 1.125-1.125a1.25 1.25 0 0 1 1.768 1.768l-7.08 7.079a3 3 0 0 1-1.264.754L4 12l.533-1.79a3 3 0 0 1 .754-1.265l5.954-5.954Zm0 0L13 4.75m-1 4.583V12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 12.5v-7A1.5 1.5 0 0 1 3.5 4h3.167"/></svg>
                Edit Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-3 hover:bg-gray-100"
                onClick={() => { setModal("deactivate"); setShowActions(false); }}
              >
                {/* Deactivate SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="mr-2"><path stroke="#737373" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.666 7h-4m-1.5-2.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-6.5 8.573v-.073a4.25 4.25 0 0 1 8.5 0V12.822A8.211 8.211 0 0 1 6.915 14a8.211 8.211 0 0 1-4.25-1.177Z"/></svg>
                Deactivate Profile
              </button>
              <button
                className="flex items-center w-full px-4 py-3 hover:bg-gray-100"
                onClick={() => { setModal("export"); setShowActions(false); }}
              >
                {/* Export SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="mr-2"><path fill="#737373" d="M11.137 9.138 8.47 11.804a.667.667 0 0 1-.943 0L4.861 9.138a.667.667 0 1 1 .942-.943l1.529 1.529V2a.667.667 0 0 1 1.333 0v7.724l1.529-1.53a.667.667 0 1 1 .943.944Z"/><path fill="#737373" d="M2.665 11.666a.667.667 0 0 0-1.333 0v1a2.667 2.667 0 0 0 2.667 2.667h8a2.667 2.667 0 0 0 2.666-2.667v-1a.667.667 0 0 0-1.333 0v1c0 .737-.597 1.334-1.333 1.334h-8a1.333 1.333 0 0 1-1.334-1.334v-1Z"/></svg>
                Export User Data
              </button>
              <button
                className="flex items-center w-full px-4 py-3 hover:bg-gray-100"
                onClick={() => { setModal("delete"); setShowActions(false); }}
              >
                {/* Delete SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" className="mr-2"><path stroke="#F04438" strokeLinecap="round" strokeLinejoin="round" d="M14 3.987a67.801 67.801 0 0 0-6.68-.334c-1.32 0-2.64.067-3.96.2L2 3.987M5.666 3.313l.147-.873c.106-.634.186-1.107 1.313-1.107h1.747c1.126 0 1.213.5 1.313 1.113l.147.867M12.567 6.094l-.433 6.713c-.074 1.047-.134 1.86-1.994 1.86H5.86c-1.86 0-1.92-.813-1.993-1.86l-.433-6.713"/></svg>
                Delete Profile
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Two columns below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="border border-gray-300 rounded-md bg-gray-50 p-6 space-y-6">
          {/* Dojo Owner First Name */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Dojo Owner First Name</div>
                <div className="text-base text-black font-semibold">{fallback(profile.first_name)}</div>
              </div>
            </div>
            <FaCopy className="text-gray-400 cursor-pointer" />
          </div>
          {/* Dojo Owner Last Name */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Dojo Owner Last Name</div>
                <div className="text-base text-black font-semibold">{fallback(profile.last_name)}</div>
              </div>
            </div>
            <FaCopy className="text-gray-400 cursor-pointer" />
          </div>
          {/* Dojo Name */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Dojo Name</div>
                <div className="text-base text-black font-semibold">{fallback(profile.dojo_name)}</div>
              </div>
            </div>
          </div>
          {/* Contact Email */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Contact Email</div>
                <div className="text-base text-black">{fallback(profile.email)}</div>
              </div>
            </div>
            <FaCopy className="text-gray-400 cursor-pointer" />
          </div>
          {/* Role */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaUser className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Role</div>
                <div className="text-base text-black">{fallback(profile.role)}</div>
              </div>
            </div>
          </div>
          {/* Joined */}
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-3 text-xl" />
              <div>
                <div className="text-xs text-gray-500">Joined</div>
                <div className="text-base text-black">{formatDate(profile.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Column 2 */}
        <div className="border border-gray-300 rounded-md bg-gray-50 p-6 space-y-6">
          {/* Dojo Location */}
          <div className="flex items-center min-h-[48px]">
            <FaUser className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Dojo Location</div>
              <div className="text-base text-black">{fallback(profile.location || profile.city)}</div>
            </div>
          </div>
          {/* Current Plan */}
          <div className="flex items-center min-h-[48px]">
            <FaUser className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Current Plan</div>
              <div className="text-base text-black">{fallback(profile.current_plan)}</div>
            </div>
          </div>
          {/* Subscription Type */}
          <div className="flex items-center min-h-[48px]">
            <FaUser className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Subscription Type</div>
              <div className="text-base text-black">{fallback(profile.subscription_type)}</div>
            </div>
          </div>
          {/* Payment Status */}
          <div className="flex items-center min-h-[48px]">
            <FaUser className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Payment Status</div>
              <div className="text-base text-black">{fallback(profile.payment_status)}</div>
            </div>
          </div>
          {/* Subscription Renewal Date */}
          <div className="flex items-center min-h-[48px]">
            <FaCalendarAlt className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Subscription Renewal Date</div>
              <div className="text-base text-black">{formatDate(profile.subscription_renewal)}</div>
            </div>
          </div>
          {/* Account Status */}
          <div className="flex items-center min-h-[48px]">
            <FaUser className="text-gray-400 mr-3 text-xl" />
            <div>
              <div className="text-xs text-gray-500">Account Status</div>
              <div className="text-base text-black">{fallback(profile.account_status || profile.status)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Instructors */}
        <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
          <div className="text-gray-500 text-sm">Number of Instructors</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-black text-xl font-bold">{instructors}</span>
            <button className="text-green-600 text-xs font-semibold hover:underline">View list</button>
          </div>
        </div>
        {/* Active Students */}
        <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
          <div className="text-gray-500 text-sm">Total Active Students</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-black text-xl font-bold">{activeStudents}</span>
            <button className="text-green-600 text-xs font-semibold hover:underline">View list</button>
          </div>
        </div>
        {/* Running Classes */}
        <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
          <div className="text-gray-500 text-sm">Total Classes Running</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-black text-xl font-bold">{runningClasses}</span>
            <button className="text-green-600 text-xs font-semibold hover:underline">View list</button>
          </div>
        </div>
        {/* Average Attendance */}
        <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col justify-between">
          <div className="text-gray-500 text-sm">Average Attendance Rate</div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-black text-xl font-bold">{avgAttendance}</span>
          </div>
        </div>
      </div>
      {/* Modals */}
      {modal === "deactivate" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#FEE4E2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#FEF3F2" strokeWidth="4" rx="14"/><path stroke="#D92D20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 8 13.92 8 12.8 8h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 9.52 8 10.08 8 11.2v.8m2 5.5v5m4-5v5M5 12h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 28 15.88 28 14.2 28h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C7 25.72 7 24.88 7 23.2V12"/></svg>
          }
          title="Deactivate Profile"
          description="Are you sure you want to deactivate this profile? The user can be reactivated back."
          confirmText="Deactivate"
          onConfirm={() => setModal(null)}
        />
      )}
      {modal === "export" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#F2F2F2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#EFEFEF" strokeWidth="4" rx="14"/><path fill="#737373" d="M19.137 17.138 16.47 19.804a.667.667 0 0 1-.943 0L12.861 17.138a.667.667 0 1 1 .942-.943l1.529 1.529V10a.667.667 0 0 1 1.333 0v7.724l1.529-1.53a.667.667 0 1 1 .943.944Z"/><path fill="#737373" d="M10.665 19.666a.667.667 0 0 0-1.333 0v1a2.667 2.667 0 0 0 2.667 2.667h8a2.667 2.667 0 0 0 2.666-2.667v-1a.667.667 0 0 0-1.333 0v1c0 .737-.597 1.334-1.333 1.334h-8a1.333 1.333 0 0 1-1.334-1.334v-1Z"/></svg>
          }
          title="Export User Data"
          description="Exporting user data."
          confirmText="Export"
          onConfirm={() => setModal(null)}
        />
      )}
      {modal === "delete" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#FEE4E2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#FEF3F2" strokeWidth="4" rx="14"/><path stroke="#D92D20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 8 13.92 8 12.8 8h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 9.52 8 10.08 8 11.2v.8m2 5.5v5m4-5v5M5 12h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 28 15.88 28 14.2 28h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C7 25.72 7 24.88 7 23.2V12"/></svg>
          }
          title="Delete Profile"
          description="Are you sure you want to delete this profile? This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default ProfileOverview;