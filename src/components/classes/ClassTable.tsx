import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaEye } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { formatDateCustom } from '@/lib/dateFormatter';
import Avatar from '@/components/ui/Avatar';
import { resolveImageUrl } from '@/lib/imageUrl';

interface Instructor {
  name: string;
  avatar: string;
}

interface ClassRow {
  id: string | number;
  class_uid: string;
  className: string;
  classLevel: string;
  instructor: Instructor;
  enrolledStudents: number;
  dateCreated: string;
  status: string;
  classImg: string;
}

interface ClassesTableProps {
  classes: ClassRow[];
  loading: boolean;
  onClassClick?: (id: string | number) => void;
}

const ClassesTable: React.FC<ClassesTableProps> = ({ classes, loading }) => {
  const router = useRouter();
  const [actionClass, setActionClass] = useState<ClassRow | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const allSelected = classes.length > 0 && selectedIds.size === classes.length;
  const toggleSelectAll = () => setSelectedIds(allSelected ? new Set() : new Set(classes.map(c => c.id)));
  const toggleSelect = (id: string | number) => setSelectedIds(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActionClass(null);
      }
    }
    if (actionClass) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionClass]);

  function onClassClick(class_uid: string | number) {
    router.push(`/dashboard/classes/${class_uid}`);
  }

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-2 md:px-3 md:py-3 w-6">
              <input
                type="checkbox"
                className="w-3 h-3 md:w-4 md:h-4 cursor-pointer"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[120px]">Class Name</th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[90px]">Class Level</th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[120px]">Instructor</th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[80px]">Enrolled</th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[120px]">Date Created</th>
            <th className="px-1 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-500 min-w-[80px]">Status</th>
            <th className="px-1 py-2 md:px-4 md:py-3 w-8"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {classes.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                if (onClassClick) {
                  onClassClick(c.class_uid);
                } else {
                  router.push(`/dashboard/classes/${c.class_uid}`);
                }
              }}
            >
              <td className="px-1 py-2 md:px-3 md:py-3 align-middle" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="w-3 h-3 md:w-4 md:h-4 cursor-pointer"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                <div className="flex items-center gap-1 md:gap-2">
                  {/* class image kept as-is when needed; if it's a person avatar use Avatar instead */}
                  {(
                    resolveImageUrl(c) || c.classImg
                  ) ? (
                    <Avatar src={resolveImageUrl(c) || c.classImg} alt={c.className} size={32} className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover" />
                  ) : null}
                  <span className="ml-1 md:ml-2 truncate">{c.className}</span>
                </div>
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">{c.classLevel || ''}</td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                <div className="flex items-center gap-1 md:gap-2">
                  <Avatar src={c.instructor?.avatar || (c.instructor && resolveImageUrl(c.instructor))} alt={c.instructor?.name} size={32} className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover" />
                  <span className="ml-1 md:ml-2 truncate">{c.instructor?.name || ''}</span>
                </div>
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">{c.enrolledStudents}</td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                {c.dateCreated ? formatDateCustom(c.dateCreated) : ''}
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                {c.status ? (
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${String(c.status).toLowerCase() === 'inactive' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {c.status}
                  </span>
                ) : ''}
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle text-right relative" onClick={e => e.stopPropagation()}>
                <span
                  className="bg-white border border-gray-200 rounded p-1 cursor-pointer inline-flex items-center"
                  onClick={() => setActionClass(actionClass?.id === c.id ? null : c)}
                >
                  <FaEllipsisV className="text-gray-400" />
                </span>
                {actionClass?.id === c.id && (
                  <div
                    ref={actionMenuRef}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    <button
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-50 text-xs sm:text-sm"
                      onClick={() => { router.push(`/dashboard/classes/${c.class_uid}`); setActionClass(null); }}
                    >
                      <FaEye className="text-gray-500 mr-2" /> View Details
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassesTable;