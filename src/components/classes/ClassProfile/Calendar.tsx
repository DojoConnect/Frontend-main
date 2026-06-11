'use client';
import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch, FaRegClock } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { days, transformScheduleToCalendar, DaySchedule } from "./transformScheduleToCalendar";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface ClassScheduleCalendarProps {
  rawSchedule?: any[];
  schedule?: DaySchedule[][];
}

const ClassScheduleCalendar: React.FC<ClassScheduleCalendarProps> = ({ rawSchedule, schedule: passedSchedule }) => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-indexed

  const computedSchedule = useMemo(() => {
    if (rawSchedule !== undefined) {
      return transformScheduleToCalendar(rawSchedule, currentYear, currentMonth);
    }
    return passedSchedule || [];
  }, [rawSchedule, passedSchedule, currentYear, currentMonth]);

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleToday = () => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-2 sm:p-4 w-full">
      {/* Header Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2 border-t border-gray-300 pt-2 pb-4 border-b">
        {/* Left: Today & Arrows */}
        <div className="flex items-center gap-2">
          <button
            className="bg-white border border-gray-300 rounded-md px-2 py-1 sm:px-3 text-black text-xs sm:text-sm font-medium"
            onClick={handleToday}
          >
            Today
          </button>
          <div className="flex gap-1">
            <button className="bg-white border border-gray-300 rounded-md p-1" onClick={handlePrev}>
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button className="bg-white border border-gray-300 rounded-md p-1" onClick={handleNext}>
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
        {/* Center: Month/Year */}
        <div className="text-base sm:text-lg font-semibold text-gray-600 text-center">
          {MONTH_NAMES[currentMonth]}, {currentYear}
        </div>
        {/* Right: View Switch & Search */}
        <div className="flex items-center gap-2 justify-end">
          <button className="bg-white border border-gray-300 rounded-md px-2 py-1 flex items-center gap-1 text-xs sm:text-sm">
            <span className="text-gray-600 font-semibold">Week</span>
            <span className="text-black font-semibold">/ Month</span>
          </button>
          <button className="bg-white border border-gray-300 rounded-md p-2">
            <HiOutlineMenuAlt3 className="text-gray-600" />
          </button>
          <button className="bg-white border border-gray-300 rounded-md p-2">
            <FaSearch className="text-gray-600" />
          </button>
        </div>
      </div>
      {/* Days Row */}
      <div className="hidden xs:flex border-b border-gray-300">
        {days.map((d, idx) => (
          <div
            key={d}
            className={`flex-1 text-center py-2 sm:py-4 text-xs sm:text-lg font-bold text-gray-500 border-b-2 border-gray-300 ${idx !== days.length - 1 ? "border-r border-gray-300" : ""}`}
          >
            {d}
          </div>
        ))}
      </div>
      {/* Calendar Weeks */}
      <div className="flex flex-col gap-2">
        {computedSchedule.map((week, i) => (
          <div key={i} className="flex flex-col xs:flex-row">
            {week.map((day, j) => {
              if (day.type === "empty") {
                return (
                  <div
                    key={j}
                    className="flex-1 flex flex-col items-center justify-start p-2 bg-gray-100 border border-gray-200 min-h-[60px] sm:min-h-[120px]"
                  >
                    {day.date !== '' && (
                      <span className="text-gray-400 font-bold text-sm sm:text-base mb-1">{day.date}</span>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={j}
                  className="flex-1 flex flex-col justify-between p-2 border border-gray-200 min-h-[60px] sm:min-h-[120px]"
                >
                  <span className="text-gray-700 font-bold text-sm sm:text-base mb-1">{day.date}</span>
                  <div className="w-full flex items-end h-full mt-auto">
                    <div className="w-1 h-6 sm:h-10 bg-purple-700 rounded-l"></div>
                    <div className="flex-1 bg-purple-50 px-2 py-1 rounded-r flex flex-col justify-end">
                      <div className="text-purple-700 font-semibold text-[10px] sm:text-xs">{day.className}</div>
                      {day.time && (
                        <div className="flex items-center text-purple-700 text-[9px] sm:text-[11px] mt-0.5">
                          <FaRegClock className="mr-1 flex-shrink-0" /> {day.time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {computedSchedule.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            No schedule data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassScheduleCalendar;
