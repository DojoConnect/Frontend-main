'use client';
import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { days, transformScheduleToCalendar, DaySchedule } from "./transformScheduleToCalendar";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ClassScheduleCalendarProps {
  rawSchedule?: any[];
  schedule?: DaySchedule[][];
  className?: string;
}

const ClassScheduleCalendar: React.FC<ClassScheduleCalendarProps> = ({
  rawSchedule,
  schedule: passedSchedule,
  className: classLabel,
}) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [view, setView] = useState<"week" | "month">("month");

  const computedSchedule = useMemo(() => {
    if (rawSchedule !== undefined) {
      return transformScheduleToCalendar(rawSchedule, currentYear, currentMonth);
    }
    return passedSchedule || [];
  }, [rawSchedule, passedSchedule, currentYear, currentMonth]);

  const handlePrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const handleNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleToday = () => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
  };

  const todayDay = now.getDate();
  const isCurrentMonthYear = now.getFullYear() === currentYear && now.getMonth() === currentMonth;

  return (
    <div className="bg-white border border-gray-200 rounded-xl w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            onClick={handleToday}
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              onClick={handlePrev}
            >
              <FaChevronLeft className="text-gray-500 text-[10px]" />
            </button>
            <button
              className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              onClick={handleNext}
            >
              <FaChevronRight className="text-gray-500 text-[10px]" />
            </button>
          </div>
        </div>

        <span className="text-sm font-semibold text-gray-800">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>

        <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
          <button
            className={`text-xs px-3 py-1.5 font-medium transition ${view === "week" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            className={`text-xs px-3 py-1.5 font-medium transition ${view === "month" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setView("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {days.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            {d.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>
        {computedSchedule.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            No schedule data available.
          </div>
        ) : (
          computedSchedule.map((week, i) => (
            <div key={i} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
              {week.map((day, j) => {
                const isToday = isCurrentMonthYear && day.type !== "empty" && String(day.date) === String(todayDay);
                const hasEvent = day.type !== "empty" && day.className;

                return (
                  <div
                    key={j}
                    className="min-h-[100px] p-1.5 border-r border-gray-100 last:border-r-0 bg-white"
                  >
                    {day.date !== "" && (
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1 ${isToday ? "bg-red-600 text-white" : "text-gray-500"}`}>
                        {day.date}
                      </div>
                    )}
                    {hasEvent && (
                      <div className="mt-1 rounded-md px-1.5 py-1 text-[10px] font-medium leading-tight bg-[#EDE7F6] text-[#4527A0]">
                        <div className="flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#7B1FA2]" />
                          <span className="truncate">{day.className || classLabel}</span>
                        </div>
                        {day.time && (
                          <div className="mt-0.5 pl-2.5 text-[9px] opacity-80">{day.time}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassScheduleCalendar;
