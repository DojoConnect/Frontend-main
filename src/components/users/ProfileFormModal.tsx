import React, { useState } from "react";

const ProfileFormModal = ({
  type,
  onClose,
  onConfirm,
}: {
  type: string | null;
  onClose: () => void;
  onConfirm: (payload: any) => void;
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dojoName: "",
    dojoLocation: "",
    instructorDojo: "",
    parentPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Map frontend form to backend payload
  const getPayload = () => {
    let name = `${form.firstName} ${form.lastName}`.trim();
    let payload: any = {
      name,
      email: form.email,
      role: type,
    };
    if (type === "admin") {
      payload.dojo_name = form.dojoName;
      payload.dojo_location = form.dojoLocation;
    }
    if (type === "instructor") {
      payload.instructor_dojo = form.instructorDojo;
    }
    if (type === "parent") {
      payload.parent_phone = form.parentPhone;
    }
    return payload;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(getPayload());
  };

  let fields;
  if (type === "admin") {
    fields = (
      <>
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
        <Input label="Contact Email Address" name="email" value={form.email} onChange={handleChange} />
        <Input label="Dojo Name" name="dojoName" value={form.dojoName} onChange={handleChange} />
        <Input label="Dojo Location" name="dojoLocation" value={form.dojoLocation} onChange={handleChange} />
      </>
    );
  } else if (type === "instructor") {
    fields = (
      <>
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
        <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
        <Select
          label="Dojo"
          name="instructorDojo"
          value={form.instructorDojo}
          onChange={handleChange}
          options={["Dojo One", "Dojo Two", "Dojo Three"]}
        />
      </>
    );
  } else if (type === "parent") {
    fields = (
      <>
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
        <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
      </>
    );
  }

  // Header icon for each type
  const headerIcon = {
    admin: (
      <svg width="22" height="20" viewBox="0 0 16 14" fill="none"><path d="M15.3332 12.6668H14.6665V6.0001H11.9998V4.39062L7.99984 0.390625L3.99984 4.39062V6.0001H1.33317V12.6668H0.666504V14.0001H15.3332V12.6668ZM3.99984 12.6668H2.6665V7.3335H3.99984V12.6668ZM11.9998 7.3335H13.3332V12.6668H11.9998V7.3335ZM7.33317 8.00016H8.6665V12.6668H7.33317V8.00016Z" fill="#E93333"/></svg>
    ),
    instructor: (
      <svg width="18" height="20" viewBox="0 0 12 14" fill="none"><path d="M3.33333 1.66683C3.33333 2.40321 2.73638 3.00016 2 3.00016C1.26362 3.00016 0.666667 2.40321 0.666667 1.66683C0.666667 0.930449 1.26362 0.333496 2 0.333496C2.73638 0.333496 3.33333 0.930449 3.33333 1.66683ZM1.33333 9.66683V13.6668H0V5.66683C0 4.56226 0.895433 3.66683 2 3.66683C2.54706 3.66683 3.04282 3.88647 3.4039 4.24238L4.98687 5.7373L6.52873 4.19542L7.47153 5.13824L5.0134 7.59636L4 6.6393V13.6668H2.66667V9.66683H1.33333ZM4.66667 2.3335H10.6667V8.3335H4.66667V9.66683H7.57693L9.45927 13.6668H10.9329L9.05053 9.66683H11.3333C11.7015 9.66683 12 9.36836 12 9.00016V1.66683C12 1.29864 11.7015 1.00016 11.3333 1.00016H4.66667V2.3335Z" fill="#E93333"/></svg>
    ),
    parent: (
      <svg width="20" height="18" viewBox="0 0 14 13" fill="none"><path d="M3.66683 6.3335C2.00998 6.3335 0.666829 4.99035 0.666829 3.3335C0.666829 1.67664 2.00998 0.333496 3.66683 0.333496C5.32368 0.333496 6.66683 1.67664 6.66683 3.3335C6.66683 4.99035 5.32368 6.3335 3.66683 6.3335ZM10.6668 9.00016C9.1941 9.00016 8.00016 7.80623 8.00016 6.3335C8.00016 4.86074 9.1941 3.66683 10.6668 3.66683C12.1396 3.66683 13.3335 4.86074 13.3335 6.3335C13.3335 7.80623 12.1396 9.00016 10.6668 9.00016ZM10.6668 9.66683C12.3237 9.66683 13.6668 11.01 13.6668 12.6668V13.0002H7.66683V12.6668C7.66683 11.01 9.00996 9.66683 10.6668 9.66683ZM3.66683 7.00016C5.50778 7.00016 7.00016 8.49256 7.00016 10.3335V13.0002H0.333496V10.3335C0.333496 8.49256 1.82588 7.00016 3.66683 7.00016Z" fill="#E93333"/></svg>
    ),
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />
      {/* Main Modal */}
      <div className="fixed inset-0 z-60 flex items-center justify-center">
        <div
          className="bg-white rounded-xl shadow-lg w-[340px] min-h-[340px] p-5 relative flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-3 mb-3">
            <span>{headerIcon[type as keyof typeof headerIcon]}</span>
            <div className="flex flex-col items-start">
              <span className="font-bold text-black text-base">
                {type === "admin" && "Create New Dojo Admin"}
                {type === "instructor" && "Create New Dojo Instructor"}
                {type === "parent" && "Create New Dojo Parent"}
              </span>
              <span className="text-gray-500 text-sm mt-1">
                {type === "admin" && "Fill the form to add a new admin"}
                {type === "instructor" && "Fill the form to add a new instructor"}
                {type === "parent" && "Fill the form to add a new parent"}
              </span>
            </div>
            <button
              className="ml-auto text-gray-400 hover:text-gray-600"
              onClick={onClose}
              type="button"
              style={{ fontSize: "2.2rem", lineHeight: "1", marginLeft: "auto" }}
              aria-label="Close"
            >×</button>
          </div>
          <form className="flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
            {fields}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="border border-gray-300 rounded-md bg-white text-black py-2 px-4 font-semibold flex-1"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-red-600 rounded-md bg-red-600 text-white py-2 px-4 font-semibold flex-1"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const Input = ({ label, name, value, onChange }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md bg-white px-3 py-2 text-sm placeholder:text-gray-400"
      placeholder={`Enter the ${label.toLowerCase()}`}
      required={label.toLowerCase().includes("email") || label.toLowerCase().includes("first name") || label.toLowerCase().includes("last name")}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md bg-white px-3 py-2 text-sm text-gray-700"
      required
    >
      <option value="">Select a dojo</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProfileFormModal;