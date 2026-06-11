import React, { useState, useEffect } from "react";
import Avatar from '@/components/ui/Avatar';
import { boFeedbackService } from "@/services/bo-feedback.service";
import Pagination from "../users/InstructorProfile/Pagination";
import FeedbackModal from "./FeedbackModal";
import { formatDateCustom } from "@/lib/dateFormatter";

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await boFeedbackService.listFeedbacks({ page, limit: rowsPerPage, search });
        const items = Array.isArray(res.data) ? res.data : [];
        setTotalCount(res.meta?.totalCount ?? items.length);
        setFeedbacks(
          items.map((fb: any) => ({
            id: fb.id,
            img: "/Avatars.jpg",
            name: fb.fullName || fb.firstName + ' ' + fb.lastName,
            email: fb.userEmail || fb.email,
            userType: fb.role ? fb.role.charAt(0).toUpperCase() + fb.role.slice(1) : "",
            feedback: fb.feedback || fb.message || fb.content,
            date: fb.createdAt ? formatDateCustom(fb.createdAt) : "",
            time: fb.createdAt?.split("T")[1] || "",
            status: "In-Review",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    const totalPages = Math.ceil(feedbacks.length / rowsPerPage);
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [feedbacks, page, rowsPerPage]);

  const paginatedFeedbacks = feedbacks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-4 sm:p-8 space-y-6 relative">
      <div className="font-bold text-lg sm:text-xl mb-2">Feedbacks</div>
      <div className="bg-white rounded-md p-2 sm:p-4 space-y-4">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white w-full max-w-sm">
            <span className="text-gray-400 mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              type="text"
              placeholder="Search feedback"
              className="outline-none bg-transparent text-sm w-full"
            />
          </div>
        </div>
        <div>
          {feedbacks.length === 0 ? (
            <div className="flex bg-white mt-4 flex-col items-center justify-center py-20 rounded-xl" style={{ border: '1px solid #E4E7EC' }}>
              <img
                src="https://res.cloudinary.com/cloud-two-tech/image/upload/v1750963970/Illustration_found_gfbbgd.png"
                alt="No data"
                className="w-[180px] h-[150px] sm:w-[225px] sm:h-[188px] mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-semibold text-[#303030]">Nothing here yet...</h2>
              <p className="text-sm sm:text-base text-[#9E9E9E] text-center mt-3">Whoops ... there’s no information available yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-100 rounded-md">
                      <th className="p-2 sm:p-3 rounded-l-md text-left">User Full Name</th>
                      <th className="p-2 sm:p-3 text-left">User Type</th>
                      <th className="p-2 sm:p-3 text-left">Feedback</th>
                      <th className="p-2 sm:p-3 text-left">Date & Time</th>
                      <th className="p-2 sm:p-3 rounded-r-md text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.map((fb) => (
                      <tr key={fb.id} className="border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedFeedback(fb)}
                      >
                        <td className="p-2 sm:p-3 flex items-center gap-2">
                          <Avatar src={fb.img} alt={fb.name} size={32} className="w-7 h-7 sm:w-8 sm:h-8" />
                          <span className="whitespace-nowrap">{fb.name}</span>
                        </td>
                        <td className="p-2 sm:p-3">{fb.feedback}</td>
                        <td className="p-2 sm:p-3">{fb.date} {fb.time}</td>
                        <td className="p-2 sm:p-3">
                          {fb.status === "In-Review" ? (
                            <span className="rounded-full px-2 sm:px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-500 whitespace-nowrap">
                              In-Review
                            </span>
                          ) : (
                            <span className="rounded-full px-2 sm:px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 whitespace-nowrap">
                              Resolved
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                totalRows={totalCount}
                rowsPerPage={rowsPerPage}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
      {/* Feedback Modal */}
      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}