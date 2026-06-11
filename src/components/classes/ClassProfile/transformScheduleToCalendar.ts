export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface DaySchedule {
  day: string;
  date: number | string;
  type: "class" | "empty";
  className?: string;
  time?: string;
}

const weekdayNameToJsDay: Record<string, number> = {
  Sunday: 0, Sun: 0,
  Monday: 1, Mon: 1,
  Tuesday: 2, Tue: 2,
  Wednesday: 3, Wed: 3,
  Thursday: 4, Thu: 4,
  Friday: 5, Fri: 5,
  Saturday: 6, Sat: 6,
};

export function transformScheduleToCalendar(
  class_schedule: any[],
  year?: number,
  month?: number,
): DaySchedule[][] {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth(); // 0-indexed

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = new Date(y, m, 1);

  // Map JS weekday (0=Sun) to schedule entry
  const scheduleByJsDay = new Map<number, any>();
  for (const s of class_schedule) {
    const weekdayRaw = s.weekday || s.day;
    const jsDay = weekdayNameToJsDay[weekdayRaw];
    if (jsDay !== undefined) {
      scheduleByJsDay.set(jsDay, s);
    }
  }

  const weeks: DaySchedule[][] = [];
  let currentWeek: DaySchedule[] = [];

  // Pad the first week: JS getDay() 0=Sun; we display Mon–Sun so offset = (dow+6)%7
  const firstDow = firstDayOfMonth.getDay();
  const startPad = (firstDow + 6) % 7; // number of empty cells before day 1
  for (let i = 0; i < startPad; i++) {
    currentWeek.push({ day: days[i], date: '', type: 'empty' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const jsDay = date.getDay();
    const colIdx = (jsDay + 6) % 7; // Mon=0 … Sun=6
    const dayName = days[colIdx];

    const scheduled = scheduleByJsDay.get(jsDay);
    if (scheduled) {
      const startTime = scheduled.startTime || scheduled.start_time || '';
      const endTime = scheduled.endTime || scheduled.end_time || '';
      const timeStr = startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime || '';
      currentWeek.push({
        day: dayName,
        date: d,
        type: 'class',
        className: scheduled.className || scheduled.class_name || scheduled.dojoName || 'Class',
        time: timeStr,
      });
    } else {
      currentWeek.push({ day: dayName, date: d, type: 'empty' });
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad last partial week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ day: days[currentWeek.length], date: '', type: 'empty' });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}
