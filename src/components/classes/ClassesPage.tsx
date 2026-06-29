// components/ClassesPage.tsx
 'use client'
import React, { useEffect, useState } from 'react'
import { FaEllipsisV } from "react-icons/fa";
import Pagination from './Pagination';
import SearchFilterExport from './SearchFilterExport';
import ClassesTable from './ClassTable';
import { boClassesService } from '@/services/bo-classes.service';
import { resolveImageUrl } from '@/lib/imageUrl';

 export interface Instructor {
  name: string;
  avatar: string;
}

export interface ClassRow {
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

export default function ClassesPage() {
   const [classesData, setClassesData] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    boClassesService
      .listClasses({ page: 1, limit: 100 })
      .then((resp) => {
        const arr = resp.data || [];
        const mapped = arr.map((item: any) => ({
          id: item.id,
          class_uid: item.class_uid || item.id,
          className: item.name || item.class_name || '',
          classLevel: item.level || '',
          instructor: {
            name: item.instructorName || item.instructor || 'No Instructor',
            avatar: item.instructorAvatar || item.instructor_avatar || resolveImageUrl(item.instructor || {}) || null,
          },
          enrolledStudents: Number(item.enrolledStudents || item.capacity) || 0,
          dateCreated: item.createdAt || item.created_at || '',
          status: item.status === 'active' ? 'Active' : 'Deactivated',
          classImg: item.image_path
            ? (item.image_path.startsWith('http') ? item.image_path : `/${item.image_path}`)
            : (resolveImageUrl(item) || (item.instructorAvatar || item.instructor_avatar) || null),
        }));
        setClassesData(mapped);
      })
      .catch(() => setClassesData([]))
      .finally(() => setLoading(false));
  }, []);
  // Filter + paginate
  const filteredClasses = searchQuery
    ? classesData.filter((c) =>
        c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classesData;
  const pagedClasses = filteredClasses.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  return (
    <div className="px-0 md:px-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-[#0F1828] mb-4">Classes</h1>

      {/* Single card: controls + table + pagination */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E4E7EC" }}>
        <div className="p-2 sm:p-4 border-b" style={{ borderColor: "#E4E7EC" }}>
          <SearchFilterExport
            searchQuery={searchQuery}
            onSearch={(q) => { setSearchQuery(q); setPage(1); }}
          />
        </div>
        {!loading && filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="https://res.cloudinary.com/cloud-two-tech/image/upload/v1750963970/Illustration_found_gfbbgd.png"
              alt="No classes"
              className="w-[225px] h-[188px] mb-4"
            />
            <h2 className="text-2xl font-semibold text-[#303030]">Nothing here yet...</h2>
            <p className="text-base text-center text-[#9E9E9E] mt-3">Whoops ... there’s no class information available yet</p>
          </div>
        ) : (
          <>
            <ClassesTable classes={pagedClasses} loading={loading} />
            <Pagination
              totalRows={filteredClasses.length}
              rowsPerPage={rowsPerPage}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
