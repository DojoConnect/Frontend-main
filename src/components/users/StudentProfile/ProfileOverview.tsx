import React, { useState } from "react";
import { boUsersService } from '@/services/bo-users.service';
import { FaUser, FaRegCopy, FaEnvelope, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import { formatDateCustom } from '@/lib/dateFormatter';

export default function ProfileOverview({ profile, classes = [], activities = [], setActiveTab }: { profile: any; classes?: any[]; activities?: any[]; setActiveTab?: (tab: string) => void }) {
  const router = useRouter();
  const getInfo = (value: any) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === 'object') {
      return value.name || value.dojoName || value.dojo_name || JSON.stringify(value);
    }
    return value;
  };
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
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // Helper: fallback for missing fields
  const fallback = (val: any, alt: string = "") => val || alt;

  // Save changes (edit)
  const handleEditConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const idOrEmail = profile.id || (profile as any).userId || profile.email;
      await boUsersService.updateUser(String(idOrEmail), {
        firstName: editFields.name?.split(' ')[0] || undefined,
        lastName: editFields.name?.split(' ').slice(1).join(' ') || undefined,
        city: editFields.city,
        dob: editFields.dob,
      } as any);
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
      const idOrEmail = profile.id || profile.userId || profile.email;
      await boUsersService.updateUserStatus(String(idOrEmail), 'inactive');
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
        <div className="flex items-center justify-between mb-4 w-full">
          <span className="text-gray-800 font-semibold text-base">Edit Profile</span>
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
      <div className="flex items-center justify-between mb-4 w-full">
        <span className="text-gray-800 font-semibold text-base">Basic User Information</span>
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Enrolled Classes</span>
            <button
              className="text-red-500 font-semibold cursor-pointer text-sm"
              onClick={() => setActiveTab ? setActiveTab("Classes") : undefined}
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex-1 min-h-[320px] flex flex-col gap-4">
            {classes && classes.length > 0 ? (
              <div className="flex-1 flex flex-col gap-4">
                {classes.slice(0, 2).map((cls: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <Avatar src={null} alt={cls.className || ''} size={48} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{cls.className}{cls.classLevel ? ` - ${cls.classLevel}` : ''}</div>
                      <div className="text-xs text-gray-500">{cls.instructorName || ''}</div>
                      <div className="flex mt-1 gap-6 text-xs">
                        {cls.frequency && (
                          <div className="flex flex-col">
                            <span className="text-gray-400">Frequency</span>
                            <span className="text-black">{String(cls.frequency).replace(/_/g, ' ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold flex-shrink-0 ${cls.enrollmentActive || String(cls.status).toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {cls.enrollmentActive || String(cls.status).toLowerCase() === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-black font-semibold mb-1">No classes enrolled</div>
                <div className="text-gray-500 text-sm">No class information available yet.</div>
              </div>
            )}
          </div>
        </div>
        {/* Activity Log Column */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Recent Activities</span>
            <button
              className="text-red-500 font-semibold cursor-pointer text-sm"
              onClick={() => setActiveTab ? setActiveTab("Activities") : undefined}
            >
              View all
            </button>
          </div>
          <div className="bg-white rounded-md border border-gray-200 p-4 flex-1 min-h-[320px] flex flex-col gap-3">
            {activities && activities.length > 0 ? (
              activities.slice(0, 2).map((act: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-3">
                  <div>
                    <div className="font-semibold text-black text-sm">{act.description || act.title || act.type}</div>
                    <div className="text-xs text-gray-500">{act.date ? (() => { try { return formatDateCustom(act.date); } catch { return ''; } })() : ''}</div>
                  </div>
                  <FaEllipsisV className="border border-gray-300 rounded-md p-1 text-gray-400 cursor-pointer w-6 h-6" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
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
  );
}