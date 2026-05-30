import React, { useState } from "react";
import { FaUser, FaRegCopy, FaEnvelope, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ProfileOverview({ profile }: { profile: any }) {
  const router = useRouter();
  const getInfo = (value: any) => value ?? "-";
  const [showActions, setShowActions] = useState(false);
  const [modal, setModal] = useState<null | "deactivate" | "export" | "delete" | "status">(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editFields, setEditFields] = useState({
    name: profile.name || "",
    email: profile.email || "",
    role: profile.role || "",
    age: profile.age || "",
    linkedDojo: profile.linkedDojo || "",
    joinedDate: profile.joinedDate || "",
    city: profile.city || "",
    dob: profile.dob || "",
  });

  // Update profile in UI after save
  const [localProfile, setLocalProfile] = useState(profile);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };
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
  // Helper: fallback for missing fields
  const fallback = (val: any, alt: string = "-") => val || alt;

  // Save changes (edit)
  const handleEditConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`https://apis.dojoconnect.app/admin/users/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editFields.name,
          city: editFields.city,
          dob: editFields.dob,
        }),
      });
      setEditMode(false);
      setModal(null);
      setLocalProfile((prev: any) => ({
        ...prev,
        ...editFields,
      }));
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  // Deactivate
  const handleDeactivateConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`https://apis.dojoconnect.app/admin/users/${profile.email}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive" }),
      });
      setModal(null);
      setLocalProfile((prev: any) => ({
        ...prev,
        accountStatus: "inactive",
      }));
    } catch (err: any) {
      setError(err.message || "Error deactivating user");
    } finally {
      setLoading(false);
    }
  };

  // Export
  const handleExportConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`https://apis.dojoconnect.app/admin/users/${profile.email}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setModal(null);
    } catch (err: any) {
      setError("Error exporting user data");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`https://apis.dojoconnect.app/admin/users/${profile.email}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      setModal(null);
      // Optionally redirect or update UI after deletion
    } catch (err: any) {
      setError(err.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
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
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-2">
          {showCancel && (
            <button className="bg-gray-200 text-black rounded px-4 py-1.5 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
          )}
          <button
            className="bg-[#E51B1B] text-white rounded px-4 py-1.5 text-sm"
            onClick={onConfirm}
            disabled={loading}
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
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="name" value={editFields.name} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="email" value={editFields.email} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="role" value={editFields.role} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Age</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="age" value={editFields.age} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Linked Dojo</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="linkedDojo" value={editFields.linkedDojo} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Enrollment Date</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="joinedDate" value={editFields.joinedDate} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">City</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="city" value={editFields.city} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Date of Birth</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="dob" value={editFields.dob} onChange={handleEditChange} />
          </div>
          {/* Readonly fields */}
          <div className="space-y-4">
            <label className="block text-gray-400 text-sm mb-1">Account Status</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={fallback(localProfile.accountStatus)} readOnly />
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
            onConfirm={handleEditConfirm}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Basic User information header */}
      <div className="flex items-center justify-between rounded-md bg-gray-100 px-6 py-4 mb-6">
        <span className="text-black font-semibold text-base">Basic User information</span>
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-white rounded-md px-4 py-2 border border-gray-400 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition cursor-pointer"
            type="button"
            onClick={() => setShowActions((v) => !v)}
          >
            Actions
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
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
      {/* Two-column info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="bg-white border border-gray-200 rounded-md p-6 flex flex-col gap-6">
          {/* Full Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="w-5 h-5 bg-white text-gray-300" />
              <div>
                <div className="text-gray-500 text-xs">Full Name</div>
                <div className="text-black font-medium">{getInfo(localProfile.name)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-300 w-4 h-4 cursor-pointer" />
          </div>
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEnvelope className="w-5 h-5 bg-white text-gray-300" />
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-black font-medium">{getInfo(localProfile.email)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-300 w-4 h-4 cursor-pointer" />
          </div>
          {/* Role */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Role</div>
              <div className="text-black font-medium">{getInfo(localProfile.role)}</div>
            </div>
          </div>
          {/* Age */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Age</div>
              <div className="text-black font-medium">{getInfo(localProfile.age)}</div>
            </div>
          </div>
          {/* Linked Dojo */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Linked Dojo</div>
              <div className="text-black font-medium">{getInfo(localProfile.linkedDojo)}</div>
            </div>
          </div>
{/* Enrollment Date */}
<div className="flex items-center gap-3">
  <FaCalendarAlt className="w-5 h-5 bg-white text-gray-300" />
  <div>
    <div className="text-gray-500 text-xs">Enrollment Date</div>
    <div className="text-black font-medium">{formatDate(localProfile.joinedDate)}</div>
  </div>
</div>
        {/* Column 2 */}
        <div className="bg-white border border-gray-200 rounded-md p-6 flex flex-col gap-6">
          {/* Parent full name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="w-5 h-5 bg-white text-gray-300" />
              <div>
                <div className="text-gray-500 text-xs">Parent full name</div>
                <div className="text-black font-medium">{getInfo(localProfile.parent?.name)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-300 w-4 h-4 cursor-pointer" />
          </div>
          {/* Parent email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEnvelope className="w-5 h-5 bg-white text-gray-300" />
              <div>
                <div className="text-gray-500 text-xs">Parent email</div>
                <div className="text-black font-medium">{getInfo(localProfile.parent?.email)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-300 w-4 h-4 cursor-pointer" />
          </div>
          {/* Any Physical Disabilities */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Any Physical Disabilities</div>
              <div className="text-black font-medium">{getInfo(localProfile.physicalDisabilities)}</div>
            </div>
          </div>
          {/* Allergies */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Allergies</div>
              <div className="text-black font-medium">{getInfo(localProfile.allergies)}</div>
            </div>
          </div>
          {/* Medical Conditions We Should Know */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Medical Conditions We Should Know</div>
              <div className="text-black font-medium">{getInfo(localProfile.medicalConditions)}</div>
            </div>
          </div>
          {/* Required Special Assistance */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Required Special Assistance</div>
              <div className="text-black font-medium">{getInfo(localProfile.specialAssistance)}</div>
            </div>
          </div>
          {/* Account Status */}
          <div className="flex items-center gap-3">
            <FaUser className="w-5 h-5 bg-white text-gray-300" />
            <div>
              <div className="text-gray-500 text-xs">Account Status</div>
              <div className="text-black font-medium">{getInfo(localProfile.accountStatus)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Section 2: Enrolled Classes & Activity Log */}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Enrolled Classes Column */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-2">
            <span className="text-gray-700 font-semibold">Enrolled Classes</span>
            <button
              className="text-red-500 font-semibold cursor-pointer"
              onClick={() => router.push("/StudentProfile/ClassesTab")}
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex-1 min-h-[320px] flex flex-col gap-4">
            {localProfile.enrolled_classes && localProfile.enrolled_classes.length > 0 ? (
              <div className="flex-1 flex flex-col gap-4">
                {localProfile.enrolled_classes.map((cls: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md border-b border-gray-200 last:border-b-0 flex-1 min-h-[120px]"
                    style={{ minHeight: 0 }}
                  >
                    <img src={cls.img || "/classImage.png"} alt={cls.name} className="w-16 h-16 rounded-md mr-4" />
                    <div className="flex-1">
                      <div className="font-semibold">{cls.name} - {cls.level}</div>
                      <div className="text-xs text-gray-500">{cls.instructor}</div>
                      <div className="flex mt-2 space-x-8 text-xs">
                        <div className="flex flex-col items-start">
                          <span className="text-gray-500">Duration</span>
                          <span className="text-black">{cls.duration}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-500">Frequency</span>
                          <span className="text-black">{cls.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      cls.status === "Payment Overdue" ? "bg-red-600" : cls.statusColor || "bg-green-500"
                    } text-white`}>
                      {cls.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="bg-white-500 rounded-full" dangerouslySetInnerHTML={{__html: `<svg xmlns="http://www.w3.org/2000/svg" width="121" height="121" fill="none"><g clip-path="url(#a)"><path fill="url(#b)" d="M60.5 108.1c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48Z"/><g filter="url(#c)"><rect width="49.815" height="62.011" x="36.1" y="25.923" fill="url(#d)" rx="6.4"/></g><rect width="20" height="3.92" x="40.5" y="33.923" fill="#000" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="45.043" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="56.163" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="67.283" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="78.402" fill="#D5D5D5" rx="1.96"/><g filter="url(#e)"><path fill="#fff" d="M115.759 19.07H91.727c-1.12 0-2.028.955-2.028 2.133v11.888c0 1.178.908 2.134 2.028 2.134h24.032c1.12 0 2.028-.956 2.028-2.134V21.203c0-1.178-.908-2.134-2.028-2.134Z"/></g><path fill="#CCC6D9" d="M95.7 29.7a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"/><rect width="12.8" height="4.8" x="101.301" y="24.9" fill="#D5D5D5" rx="2.4"/><path fill="#CCC6D9" d="M74.547 40.726c13.807 0 25 11.193 25 25 0 5.39-1.706 10.38-4.608 14.463l15.709 14.998-5.903 6.849-16.281-15.54a24.884 24.884 0 0 1-13.917 4.23c-13.807 0-25-11.194-25-25 0-13.807 11.193-25 25-25Zm.157 3.834c-11.69 0-21.165 9.476-21.165 21.166 0 11.689 9.476 21.165 21.165 21.165 11.69 0 21.165-9.476 21.165-21.165 0-11.69-9.476-21.165-21.165-21.166Z"/><foreignObject width="50" height="49.6" x="49.7" y="40.901"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(1.6px);clip-path:url(#f);height:100%;width:100%"/></foreignObject><path fill="#fff" fill-opacity=".3" d="M74.7 87.3c12.04 0 21.8-9.67 21.8-21.6 0-11.929-9.76-21.6-21.8-21.6-12.04 0-21.8 9.671-21.8 21.6 0 11.93 9.76 21.6 21.8 21.6Z" data-figma-bg-blur-radius="3.2"/><path fill="#000" d="m78.471 65.7 5.276-5.255a2.738 2.738 0 0 0-.055-3.83 2.773 2.773 0 0 0-3.853-.054l-5.288 5.255-5.275-5.255a2.765 2.765 0 0 0-1.97-.86 2.78 2.78 0 0 0-1.994.804 2.746 2.746 0 0 0-.81 1.982 2.737 2.737 0 0 0 .866 1.958l5.284 5.255-5.284 5.255a2.748 2.748 0 0 0-.866 1.959 2.733 2.733 0 0 0 .81 1.981 2.766 2.766 0 0 0 1.994.805 2.778 2.778 0 0 0 1.97-.86l5.287-5.256 5.288 5.256a2.774 2.774 0 0 0 3.785-.122 2.74 2.74 0 0 0 .11-3.763L78.472 65.7Z"/><path fill="#E1DCEB" d="m104.742 102.037 5.904-6.85.89.849a4.73 4.73 0 0 1 1.436 3.199 4.771 4.771 0 0 1-1.134 3.33 4.31 4.31 0 0 1-3.04 1.512 4.265 4.265 0 0 1-3.164-1.194l-.89-.848-.002.002Z"/><path fill="#000" fillRule="evenodd" d="M23.027 36.968a7.59 7.59 0 0 0-.223-1.725c-.502-2.032-2.74-3.338-5.124-3.644-2.382-.307-4.86.391-5.814 2.16-.546 1.01-.622 1.882-.399 2.616.223.731.75 1.337 1.465 1.809 1.996 1.315 5.49 1.583 7.084 1.034a17.87 17.87 0 0 0 2.16-.913c-.402 2.298-1.896 4.476-3.89 6.438-4.335 4.264-11.06 7.5-14.723 8.69a.393.393 0 0 0-.245.488.37.37 0 0 0 .467.257c3.735-1.213 10.592-4.519 15.012-8.868 2.283-2.246 3.91-4.775 4.188-7.433 5.162-2.88 9.401-8.107 13.025-12.505a.402.402 0 0 0-.04-.55.363.363 0 0 0-.526.042c-3.476 4.218-7.51 9.236-12.417 12.104Zm-.75.418a6.814 6.814 0 0 0-.196-1.949c-.434-1.76-2.43-2.8-4.492-3.065-1.265-.163-2.565-.029-3.585.447-.641.3-1.17.733-1.488 1.323-.418.774-.508 1.436-.337 1.997.172.566.597 1.02 1.152 1.385 1.818 1.199 5 1.454 6.45.953a17.558 17.558 0 0 0 2.495-1.09Z" clip-rule="evenodd"/><circle cx="114.5" cy="74.1" r="2.4" fill="#E3E3E3"/><path fill="#CCC6D9" fillRule="evenodd" d="M23.854 90.658c.428-.16.88-.374 1.227-.683.413-.367.58-.84.693-1.338.145-.639.203-1.32.378-1.96.065-.238.19-.328.244-.368a.576.576 0 0 1 .402-.118.583.583 0 0 1 .5.343c.02.038.046.097.063.178.013.059.02.243.034.32.033.187.061.375.087.563.087.628.137 1.161.412 1.738.372.783.745 1.261 1.251 1.474.49.205 1.075.166 1.822.005.071-.018.142-.033.211-.046.33-.06.645.167.71.513.065.345-.145.681-.472.757a8.35 8.35 0 0 1-.201.045c-1.01.263-2.18 1.203-2.86 2.025-.21.254-.516.963-.829 1.415-.23.334-.49.554-.708.631a.628.628 0 0 1-.735-.239.746.746 0 0 1-.121-.296 2.315 2.315 0 0 1-.012-.283c-.064-.231-.142-.457-.199-.69-.135-.555-.402-.907-.718-1.372a2.5 2.5 0 0 0-1.078-.926 8.2 8.2 0 0 1-.722-.214.785.785 0 0 1-.416-.379.761.761 0 0 1-.067-.422.702.702 0 0 1 .229-.444.789.789 0 0 1 .367-.183c.126-.028.461-.044.508-.046Zm2.867-.906c.022.053.046.107.072.16.545 1.147 1.155 1.787 1.897 2.098l.025.01c-.496.388-.945.82-1.288 1.236-.142.171-.329.526-.53.89-.185-.628-.485-1.072-.862-1.627a3.744 3.744 0 0 0-.963-1.004c.289-.156.564-.338.803-.55.399-.355.662-.766.846-1.213Z" clip-rule="evenodd"/></g><defs><linearGradient id="b" x1="60.13" x2="61.113" y1="-3.53" y2="165.038" gradientUnits="userSpaceOnUse"><stop stopColor="#F2F2F2"/><stop offset="1" stopColor="#EFEFEF"/></linearGradient><linearGradient id="d" x1="61.007" x2="61.007" y1="25.923" y2="87.934" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset=".719" stopColor="#FAFAFA"/></linearGradient><clipPath id="f" transform="translate(-49.7 -40.9)"><path d="M74.7 87.3c12.04 0 21.8-9.67 21.8-21.6 0-11.929-9.76-21.6-21.8-21.6-12.04 0-21.8 9.671-21.8 21.6 0 11.93 9.76 21.6 21.8 21.6Z"/></clipPath><clipPath id="a"><path fill="#fff" d="M.5.5h120v120H.5z"/></clipPath><filter id="c" width="73.814" height="86.012" x="24.1" y="21.923" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="8"/><feGaussianBlur stdDeviation="6"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0.19 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10845_63786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_10845_63786" result="shape"/></filter><filter id="e" width="38.488" height="26.555" x="86.899" y="15.469" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="2.4" dy="1.6"/><feGaussianBlur stdDeviation="2.6"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.104618 0 0 0 0 0.465612 0 0 0 0 0.545833 0 0 0 0.09 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10845_63786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_10845_63786" result="shape"/></filter></defs></svg>`}} />
                <div className="text-black font-semibold mb-1">No classes enrolled</div>
                <div className="text-gray-500 text-sm">No class information available yet.</div>
              </div>
            )}
          </div>
        </div>
        {/* Activity Log Column */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-2">
            <span className="text-gray-700 font-semibold">Recent Activities</span>
            <button
              className="text-red-500 font-semibold cursor-pointer"
              onClick={() => router.push("/StudentProfile/ActivitiesTab")}
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex-1 min-h-[320px] flex flex-col gap-4">
            {localProfile.activity_log && localProfile.activity_log.length > 0 ? (
              localProfile.activity_log.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-4"
                >
                  <div>
                    <div className="font-semibold text-black">{act.title}</div>
                    <div className="text-xs text-gray-500">{act.date}</div>
                  </div>
                  <FaEllipsisV className="border border-gray-300 rounded-md p-1 text-gray-400 cursor-pointer" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="bg-white-500 rounded-full" dangerouslySetInnerHTML={{__html: `<svg xmlns="http://www.w3.org/2000/svg" width="121" height="121" fill="none"><g clip-path="url(#a)"><path fill="url(#b)" d="M60.5 108.1c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48Z"/><g filter="url(#c)"><rect width="49.815" height="62.011" x="36.1" y="25.923" fill="url(#d)" rx="6.4"/></g><rect width="20" height="3.92" x="40.5" y="33.923" fill="#000" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="45.043" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="56.163" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="67.283" fill="#D5D5D5" rx="1.96"/><rect width="40" height="3.92" x="40.5" y="78.402" fill="#D5D5D5" rx="1.96"/><g filter="url(#e)"><path fill="#fff" d="M115.759 19.07H91.727c-1.12 0-2.028.955-2.028 2.133v11.888c0 1.178.908 2.134 2.028 2.134h24.032c1.12 0 2.028-.956 2.028-2.134V21.203c0-1.178-.908-2.134-2.028-2.134Z"/></g><path fill="#CCC6D9" d="M95.7 29.7a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"/><rect width="12.8" height="4.8" x="101.301" y="24.9" fill="#D5D5D5" rx="2.4"/><path fill="#CCC6D9" d="M74.547 40.726c13.807 0 25 11.193 25 25 0 5.39-1.706 10.38-4.608 14.463l15.709 14.998-5.903 6.849-16.281-15.54a24.884 24.884 0 0 1-13.917 4.23c-13.807 0-25-11.194-25-25 0-13.807 11.193-25 25-25Zm.157 3.834c-11.69 0-21.165 9.476-21.165 21.166 0 11.689 9.476 21.165 21.165 21.165 11.69 0 21.165-9.476 21.165-21.165 0-11.69-9.476-21.165-21.165-21.166Z"/><foreignObject width="50" height="49.6" x="49.7" y="40.901"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(1.6px);clip-path:url(#f);height:100%;width:100%"/></foreignObject><path fill="#fff" fill-opacity=".3" d="M74.7 87.3c12.04 0 21.8-9.67 21.8-21.6 0-11.929-9.76-21.6-21.8-21.6-12.04 0-21.8 9.671-21.8 21.6 0 11.93 9.76 21.6 21.8 21.6Z" data-figma-bg-blur-radius="3.2"/><path fill="#000" d="m78.471 65.7 5.276-5.255a2.738 2.738 0 0 0-.055-3.83 2.773 2.773 0 0 0-3.853-.054l-5.288 5.255-5.275-5.255a2.765 2.765 0 0 0-1.97-.86 2.78 2.78 0 0 0-1.994.804 2.746 2.746 0 0 0-.81 1.982 2.737 2.737 0 0 0 .866 1.958l5.284 5.255-5.284 5.255a2.748 2.748 0 0 0-.866 1.959 2.733 2.733 0 0 0 .81 1.981 2.766 2.766 0 0 0 1.994.805 2.778 2.778 0 0 0 1.97-.86l5.287-5.256 5.288 5.256a2.774 2.774 0 0 0 3.785-.122 2.74 2.74 0 0 0 .11-3.763L78.472 65.7Z"/><path fill="#E1DCEB" d="m104.742 102.037 5.904-6.85.89.849a4.73 4.73 0 0 1 1.436 3.199 4.771 4.771 0 0 1-1.134 3.33 4.31 4.31 0 0 1-3.04 1.512 4.265 4.265 0 0 1-3.164-1.194l-.89-.848-.002.002Z"/><path fill="#000" fillRule="evenodd" d="M23.027 36.968a7.59 7.59 0 0 0-.223-1.725c-.502-2.032-2.74-3.338-5.124-3.644-2.382-.307-4.86.391-5.814 2.16-.546 1.01-.622 1.882-.399 2.616.223.731.75 1.337 1.465 1.809 1.809 1.996 1.315 5.49 1.583 7.084 1.034a17.87 17.87 0 0 0 2.16-.913c-.402 2.298-1.896 4.476-3.89 6.438-4.335 4.264-11.06 7.5-14.723 8.69a.393.393 0 0 0-.245.488.37.37 0 0 0 .467.257c3.735-1.213 10.592-4.519 15.012-8.868 2.283-2.246 3.91-4.775 4.188-7.433 5.162-2.88 9.401-8.107 13.025-12.505a.402.402 0 0 0-.04-.55.363.363 0 0 0-.526.042c-3.476 4.218-7.51 9.236-12.417 12.104Zm-.75.418a6.814 6.814 0 0 0-.196-1.949c-.434-1.76-2.43-2.8-4.492-3.065-1.265-.163-2.565-.029-3.585.447-.641.3-1.17.733-1.488 1.323-.418.774-.508 1.436-.337 1.997.172.566.597 1.02 1.152 1.385 1.818 1.199 5 1.454 6.45.953a17.558 17.558 0 0 0 2.495-1.09Z" clip-rule="evenodd"/><circle cx="114.5" cy="74.1" r="2.4" fill="#E3E3E3"/><path fill="#CCC6D9" fillRule="evenodd" d="M23.854 90.658c.428-.16.88-.374 1.227-.683.413-.367.58-.84.693-1.338.145-.639.203-1.32.378-1.96.065-.238.19-.328.244-.368a.576.576 0 0 1 .402-.118.583.583 0 0 1 .5.343c.02.038.046.097.063.178.013.059.02.243.034.32.033.187.061.375.087.563.087.628.137 1.161.412 1.738.372.783.745 1.261 1.251 1.474.49.205 1.075.166 1.822.005.071-.018.142-.033.211-.046.33-.06.645.167.71.513.065.345-.145.681-.472.757a8.35 8.35 0 0 1-.201.045c-1.01.263-2.18 1.203-2.86 2.025-.21.254-.516.963-.829 1.415-.23.334-.49.554-.708.631a.628.628 0 0 1-.735-.239.746.746 0 0 1-.121-.296 2.315 2.315 0 0 1-.012-.283c-.064-.231-.142-.457-.199-.69-.135-.555-.402-.907-.718-1.372a2.5 2.5 0 0 0-1.078-.926 8.2 8.2 0 0 1-.722-.214.785.785 0 0 1-.416-.379.761.761 0 0 1-.067-.422.702.702 0 0 1 .229-.444.789.789 0 0 1 .367-.183c.126-.028.461-.044.508-.046Zm2.867-.906c.022.053.046.107.072.16.545 1.147 1.155 1.787 1.897 2.098l.025.01c-.496.388-.945.82-1.288 1.236-.142.171-.329.526-.53.89-.185-.628-.485-1.072-.862-1.627a3.744 3.744 0 0 0-.963-1.004c.289-.156.564-.338.803-.55.399-.355.662-.766.846-1.213Z" clip-rule="evenodd"/></g><defs><linearGradient id="b" x1="60.13" x2="61.113" y1="-3.53" y2="165.038" gradientUnits="userSpaceOnUse"><stop stopColor="#F2F2F2"/><stop offset="1" stopColor="#EFEFEF"/></linearGradient><linearGradient id="d" x1="61.007" x2="61.007" y1="25.923" y2="87.934" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset=".719" stopColor="#FAFAFA"/></linearGradient><clipPath id="f" transform="translate(-49.7 -40.9)"><path d="M74.7 87.3c12.04 0 21.8-9.67 21.8-21.6 0-11.929-9.76-21.6-21.8-21.6-12.04 0-21.8 9.671-21.8 21.6 0 11.93 9.76 21.6 21.8 21.6Z"/></clipPath><clipPath id="a"><path fill="#fff" d="M.5.5h120v120H.5z"/></clipPath><filter id="c" width="73.814" height="86.012" x="24.1" y="21.923" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="8"/><feGaussianBlur stdDeviation="6"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0.19 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10845_63786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_10845_63786" result="shape"/></filter><filter id="e" width="38.488" height="26.555" x="86.899" y="15.469" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="2.4" dy="1.6"/><feGaussianBlur stdDeviation="2.6"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.104618 0 0 0 0 0.465612 0 0 0 0 0.545833 0 0 0 0.09 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10845_63786"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_10845_63786" result="shape"/></filter></defs></svg>`}} />
                <div className="text-black font-semibold mb-1">No recent activities</div>
                <div className="text-gray-500 text-sm">No activity information available yet.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Deactivate Modal */}
      {modal === "deactivate" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#FEE4E2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#FEF3F2" strokeWidth="4" rx="14"/><path stroke="#D92D20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 8 13.92 8 12.8 8h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 9.52 8 10.08 8 11.2v.8m2 5.5v5m4-5v5M5 12h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 28 15.88 28 14.2 28h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C7 25.72 7 24.88 7 23.2V12"/></svg>
          }
          title="Deactivate Profile"
          description="Are you sure you want to deactivate this profile? The user can be reactivated back."
          confirmText="Deactivate"
          onConfirm={handleDeactivateConfirm}
        />
      )}
      {/* Export Modal */}
      {modal === "export" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#F2F2F2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#EFEFEF" strokeWidth="4" rx="14"/><path fill="#737373" d="M19.137 17.138 16.47 19.804a.667.667 0 0 1-.943 0L12.861 17.138a.667.667 0 1 1 .942-.943l1.529 1.529V10a.667.667 0 0 1 1.333 0v7.724l1.529-1.53a.667.667 0 1 1 .943.944Z"/><path fill="#737373" d="M10.665 19.666a.667.667 0 0 0-1.333 0v1a2.667 2.667 0 0 0 2.667 2.667h8a2.667 2.667 0 0 0 2.666-2.667v-1a.667.667 0 0 0-1.333 0v1c0 .737-.597 1.334-1.333 1.334h-8a1.333 1.333 0 0 1-1.334-1.334v-1Z"/></svg>
          }
          title="Export User Data"
          description="Exporting user data."
          confirmText="Export"
          onConfirm={handleExportConfirm}
        />
      )}
      {/* Delete Modal */}
      {modal === "delete" && (
        <ModalCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><rect width="28" height="28" x="2" y="2" fill="#FEE4E2" rx="14"/><rect width="28" height="28" x="2" y="2" stroke="#FEF3F2" strokeWidth="4" rx="14"/><path stroke="#D92D20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 8 13.92 8 12.8 8h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 9.52 8 10.08 8 11.2v.8m2 5.5v5m4-5v5M5 12h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 28 15.88 28 14.2 28h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C7 25.72 7 24.88 7 23.2V12"/></svg>
          }
          title="Delete Profile"
          description="Are you sure you want to delete this profile? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
    </div>
  );
} 