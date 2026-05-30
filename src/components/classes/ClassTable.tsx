import React from 'react';
import { FaEllipsisV } from "react-icons/fa";
import { useRouter } from 'next/navigation';

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
  function onClassClick(class_uid: string | number) {
    router.push(`/dashboard/classes/${class_uid}`);
  }

  return (
    <div className="rounded-lg border bg-white overflow-x-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-2 md:px-3 md:py-3 w-6">
              <input type="checkbox" className="w-3 h-3 md:w-4 md:h-4" />
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
              <td className="px-1 py-2 md:px-3 md:py-3 align-middle">
                <input type="checkbox" className="w-3 h-3 md:w-4 md:h-4" />
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                <div className="flex items-center gap-1 md:gap-2">
                  <img
                    src={c.classImg}
                    alt={c.className}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="ml-1 md:ml-2 truncate">{c.className}</span>
                </div>
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">{c.classLevel}</td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                <div className="flex items-center gap-1 md:gap-2">
                  <img
                    src={c.instructor.avatar}
                    alt={c.instructor.name}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="ml-1 md:ml-2 truncate">{c.instructor.name}</span>
                </div>
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">{c.enrolledStudents}</td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                {c.dateCreated
                  ? new Date(c.dateCreated).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle">
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${c.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-1 py-2 md:px-4 md:py-3 align-middle text-right">
                <span className="bg-white border border-gray-200 rounded p-1">
                  <FaEllipsisV className="text-gray-400 inline" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassesTable;