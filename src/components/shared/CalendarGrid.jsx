import React, { useMemo } from "react";

export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay();

export const formatMonthYear = (year, month) =>
  new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

export const dateKey = (date) => date.toISOString().slice(0, 10);

/** Map YYYY-MM-DD -> events[] spanning that calendar day */
export function buildEventsByDate(events) {
  const map = {};
  (events || []).forEach((ev) => {
    const start = ev.startDate || ev.date;
    const end = ev.endDate;
    if (!start && !end) return;
    const rangeStart = start ? new Date(start) : new Date(end);
    const rangeEnd = end ? new Date(end) : rangeStart;
    const cursor = new Date(rangeStart);
    cursor.setHours(0, 0, 0, 0);
    const last = new Date(rangeEnd);
    last.setHours(0, 0, 0, 0);
    while (cursor <= last) {
      const key = cursor.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
      cursor.setDate(cursor.getDate() + 1);
    }
  });
  return map;
}

export function buildCalendarCells(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];
  const prevMonthDate = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDate - i;
    cells.push({
      date: new Date(year, month - 1, dayNum),
      inCurrentMonth: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inCurrentMonth: false });
  }
  return cells;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * @param {object} props
 * @param {Record<string, object[]>} props.eventsByDate
 * @param {number} props.currentYear
 * @param {number} props.currentMonth
 * @param {Date | null} props.selectedDate
 * @param {(d: Date | null) => void} props.onSelectDate
 * @param {() => void} props.onPrevMonth
 * @param {() => void} props.onNextMonth
 * @param {() => void} props.onToday
 * @param {(event: object) => string} props.getEventDotClass - returns Tailwind bg-* class e.g. bg-green-500
 * @param {Date} [props.todayAnchor]
 * @param {React.ReactNode} [props.headerRight] - extra controls next to Today
 * @param {React.ReactNode} [props.legend] - below grid
 */
export default function CalendarGrid({
  eventsByDate,
  currentYear,
  currentMonth,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  getEventDotClass,
  todayAnchor = new Date(),
  headerRight = null,
  legend = null,
}) {
  const cells = useMemo(
    () => buildCalendarCells(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const ta = todayAnchor;
  const isTodayDate = (date) =>
    date.getFullYear() === ta.getFullYear() &&
    date.getMonth() === ta.getMonth() &&
    date.getDate() === ta.getDate();

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="px-3 text-sm font-semibold min-w-[140px] text-center">
            {formatMonthYear(currentYear, currentMonth)}
          </div>
          <button
            type="button"
            onClick={onNextMonth}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Next month"
          >
            ›
          </button>
          <button
            type="button"
            onClick={onToday}
            className="ml-1 hidden sm:inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          {headerRight}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 text-xs font-semibold text-gray-500">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="px-2 py-2 text-center uppercase tracking-wide"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-sm">
          {cells.map(({ date, inCurrentMonth }) => {
            const key = dateKey(date);
            const dayEvents = eventsByDate[key] || [];
            const isToday = isTodayDate(date);
            const isSelected =
              selectedDate &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();

            const visibleDots = dayEvents.slice(0, 3);
            const extraCount = dayEvents.length - visibleDots.length;

            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  // Select the date even if there are no events, so the details panel
                  // can show "No events on this date" for a consistent UX.
                  onSelectDate(date)
                }
                className={`h-20 border-t border-gray-100 px-1 py-1 flex flex-col items-center justify-between ${
                  inCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                } ${
                  isSelected
                    ? "ring-2 ring-[#008000] ring-offset-1 ring-offset-white"
                    : ""
                }`}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
                    isToday ? "bg-[#008000] text-white" : "text-gray-800"
                  }`}
                >
                  {date.getDate()}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-0.5 mt-1 max-w-full">
                  {visibleDots.map((ev, idx) => (
                    <span
                      key={ev._id + idx}
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${getEventDotClass(ev)}`}
                    />
                  ))}
                  {extraCount > 0 && (
                    <span className="ml-0.5 text-[10px] text-gray-500">
                      +{extraCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        {legend}
        <button
          type="button"
          onClick={onToday}
          className="sm:hidden inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Today
        </button>
      </div>
    </>
  );
}
