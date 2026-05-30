import { FaEllipsisV, FaRegCalendarAlt, FaRegChartBar, FaRegUser, FaSearch, FaFilter } from "react-icons/fa";

type AttendanceRow = {
  id: string | number;
  avatar: string;
  name: string;
  attendance: string;
  sessionsAttended: number;
  sessionsMissed: number;
  lastAttended: string;
  status: string;
};

export default function AttendanceTab({
  attendance,
  rows,
}: {
  attendance: any;
  rows: AttendanceRow[];
}) {
  // Extract attendanceSummary from attendance prop
  const attendanceSummary = attendance?.summary || {
    totalSessions: 0,
    averageRate: "0%",
    lowAttendanceCount: 0,
    lowAttendancePercent: "0%",
  };

  // Extract attendanceRows from attendance prop or use rows
  const attendanceRows: AttendanceRow[] = attendance?.rows || rows;

  // Empty state
  if (!attendance || attendance.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border">
        {/* ...SVG... */}
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" className="sm:w-[150px] sm:h-[150px]">
          {/* ...SVG paths... */}
        </svg>
        <div className="mt-4 sm:mt-6 text-black font-semibold text-base sm:text-lg">No Attedance</div>
        <div className="mt-2 text-gray-500 text-xs sm:text-sm">No attendance has been added to this class.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Attendance Summary & Cards */}
      <div className="rounded-md border border-gray-200 bg-white px-3 sm:px-6 py-3 sm:py-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <span className="text-black font-semibold text-sm sm:text-base">Attendance Summary</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Total Sessions Held */}
          <div className="flex-1 rounded-md border border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-100">
                <FaRegCalendarAlt className="text-red-400 text-base sm:text-lg" />
              </span>
              <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FaEllipsisV className="text-xs sm:text-base" />
              </button>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-black mb-1">{attendanceSummary.totalSessions}</div>
            <div className="text-gray-500 text-xs sm:text-sm">Total sessions held</div>
          </div>
          {/* Average Attendance Rate */}
          <div className="flex-1 rounded-md border border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-100">
                <FaRegChartBar className="text-red-400 text-base sm:text-lg" />
              </span>
              <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FaEllipsisV className="text-xs sm:text-base" />
              </button>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-black mb-1">{attendanceSummary.averageRate}</div>
            <div className="text-gray-500 text-xs sm:text-sm">Average attendance rate</div>
          </div>
          {/* Students with Low Attendance */}
          <div className="flex-1 rounded-md border border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-100">
                <FaRegUser className="text-red-400 text-base sm:text-lg" />
              </span>
              <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FaEllipsisV className="text-xs sm:text-base" />
              </button>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-black mb-1">{attendanceSummary.lowAttendanceCount}</div>
            <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm">
              <span>Students with low attendance</span>
              <span className="bg-red-100 text-red-500 rounded-md px-2 py-1 ml-2 text-[11px] sm:text-xs font-semibold">
                {attendanceSummary.lowAttendancePercent} of total
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Attendance History Section */}
      <div className="rounded-md border border-gray-200 bg-white px-3 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
          <span className="text-black font-semibold text-sm sm:text-base">Attendance History</span>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-2 rounded-md border border-gray-300 bg-white-50 text-xs sm:text-sm w-[110px] sm:w-[140px]"
              />
              <FaSearch className="absolute left-2 top-2.5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter"
                className="pl-8 pr-3 py-2 rounded-md border border-gray-300 bg-white-50 text-xs sm:text-sm w-[70px] sm:w-[90px]"
              />
              <FaFilter className="absolute left-2 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
        {/* Attendance Table */}
        <table className="min-w-[700px] w-full text-xs sm:text-sm divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 sm:px-4 py-2 sm:py-3"><input type="checkbox" /></th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Attendance %</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Sessions Attended</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Sessions Missed</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Last Attended</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-gray-500">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {attendanceRows.map((student: AttendanceRow) => (
              <tr key={student.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-2 sm:px-4 py-2 sm:py-3"><input type="checkbox" /></td>
                <td className="flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3">
                  <img src={student.avatar} alt={student.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                  <span className="text-xs sm:text-sm">{student.name}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{student.attendance}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{student.sessionsAttended}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{student.sessionsMissed}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{student.lastAttended}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className="px-2 py-1 rounded text-[11px] sm:text-xs font-semibold bg-green-100 text-green-600">
                    {student.status}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">
                  <span className="bg-white border border-gray-200 rounded p-1">
                    <FaEllipsisV className="text-gray-400 inline text-xs sm:text-base" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}