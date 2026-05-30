import React, { useState } from "react";
import { FaUser, FaRegCopy, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

interface ParentProfile {
  name?: string;
  email?: string;
  role?: string;
  linkedDojo?: string | null;
  joined?: string | null;
  city?: string | null;
  street?: string | null;
  subscription_status?: string | null;
  referral_code?: string;
  created_at?: string;
  nextOfKinName?: string | null;
  nextOfKinEmail?: string;
  relationship?: string | null;
  childrenCount?: string | number;
  classGroups?: string | null;
  subscriptionStatus?: string | null;
}

interface ProfileOverviewProps {
  profile: ParentProfile;
}

export default function ProfileOverview({ profile }: ProfileOverviewProps) {
  const [showActions, setShowActions] = useState(false);
  const [modal, setModal] = useState<null | "deactivate" | "export" | "delete" | "status">(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields state for edit section
  const [editFields, setEditFields] = useState({
    name: profile.name || "",
    email: profile.email || "",
    role: profile.role || "",
    city: profile.city || "",
    street: profile.street || "",
  });

  // Local profile for UI updates
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
      await fetch(`https://apis.dojoconnect.app/admin/parents/${profile.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editFields.name,
          city: editFields.city,
          street: editFields.street,
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
      await fetch(`https://apis.dojoconnect.app/admin/parents/${profile.email}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive" }),
      });
      setModal(null);
      setLocalProfile((prev: any) => ({
        ...prev,
        subscription_status: "inactive",
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
      await fetch(`https://apis.dojoconnect.app/admin/parents/${profile.email}/export`, {
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
      await fetch(`https://apis.dojoconnect.app/admin/parents/${profile.email}`, {
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
            <label className="block text-gray-700 text-sm mb-1">Contact Email</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="email" value={editFields.email} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="role" value={editFields.role} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">City</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="city" value={editFields.city} onChange={handleEditChange} />
            <label className="block text-gray-700 text-sm mb-1">Street</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2" name="street" value={editFields.street} onChange={handleEditChange} />
          </div>
          {/* Readonly fields */}
          <div className="space-y-4">
            <label className="block text-gray-400 text-sm mb-1">Subscription Status</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={fallback(localProfile.subscription_status)} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Referral Code</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={fallback(localProfile.referral_code)} readOnly />
            <label className="block text-gray-400 text-sm mb-1">Joined</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100" value={fallback(localProfile.created_at)} readOnly />
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

  // Default Overview
  return (
    <div>
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
          {/* Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400 w-5 h-5" />
              <div>
                <div className="text-gray-500 text-xs">Name</div>
                <div className="text-black font-medium">{fallback(localProfile.name)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-400 w-4 h-4 cursor-pointer" />
          </div>
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-gray-400 w-5 h-5" />
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-black font-medium">{fallback(localProfile.email)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-400 w-4 h-4 cursor-pointer" />
          </div>
          {/* Role */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Role</div>
              <div className="text-black font-medium">{fallback(localProfile.role)}</div>
            </div>
          </div>
          {/* Linked Dojo */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Linked Dojo</div>
              <div className="text-black font-medium">{fallback(localProfile.linkedDojo)}</div>
            </div>
          </div>
         {/* Joined */}
  <div className="flex items-center gap-3">
    <FaCalendarAlt className="text-gray-400 w-5 h-5" />
    <div>
      <div className="text-gray-500 text-xs">Joined</div>
      <div className="text-black font-medium">{formatDate(localProfile.created_at)}</div>
    </div>
  </div>
          {/* City */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">City</div>
              <div className="text-black font-medium">{fallback(localProfile.city)}</div>
            </div>
          </div>
          {/* Street */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Street</div>
              <div className="text-black font-medium">{fallback(localProfile.street)}</div>
            </div>
          </div>
          {/* Subscription Status */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Subscription Status</div>
              <div className="text-black font-medium">{fallback(localProfile.subscription_status)}</div>
            </div>
          </div>
          {/* Referral Code */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Referral Code</div>
              <div className="text-black font-medium">{fallback(localProfile.referral_code)}</div>
            </div>
          </div>
        </div>
        {/* Column 2 */}
        <div className="bg-white border border-gray-200 rounded-md p-6 flex flex-col gap-6">
          {/* Next of Kin's Full Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400 w-5 h-5" />
              <div>
                <div className="text-gray-500 text-xs">Next of kin's full name</div>
                <div className="text-black font-medium">{fallback(localProfile.nextOfKinName)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-400 w-4 h-4 cursor-pointer" />
          </div>
          {/* Next of Kin's Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-gray-400 w-5 h-5" />
              <div>
                <div className="text-gray-500 text-xs">Next of kin's email</div>
                <div className="text-black font-medium">{fallback(localProfile.nextOfKinEmail)}</div>
              </div>
            </div>
            <FaRegCopy className="text-gray-400 w-4 h-4 cursor-pointer" />
          </div>
          {/* Relationship */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Relationship</div>
              <div className="text-black font-medium">{fallback(localProfile.relationship)}</div>
            </div>
          </div>
          {/* Number of Children */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Number of children</div>
              <div className="text-black font-medium">{fallback(localProfile.childrenCount)}</div>
            </div>
          </div>
          {/* Class Group(s) */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Class group(s)</div>
              <div className="text-black font-medium">{fallback(localProfile.classGroups)}</div>
            </div>
          </div>
          {/* Subscription Status (future) */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400 w-5 h-5" />
            <div>
              <div className="text-gray-500 text-xs">Subscription status</div>
              <div className="text-black font-medium">{fallback(localProfile.subscriptionStatus)}</div>
            </div>
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
          showCancel={false}
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