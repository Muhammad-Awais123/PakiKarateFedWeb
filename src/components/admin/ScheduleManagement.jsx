import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import CalendarGrid, {
  buildEventsByDate,
  dateKey,
} from "../shared/CalendarGrid.jsx";

function formatDateRange(start, end) {
  if (!start && !end) return "—";
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (!s && e)
    return e.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  if (s && !e)
    return s.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    const my = s.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    return `${s.getDate()} – ${e.getDate()} ${my}`;
  }
  return `${s.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} – ${e.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function adminEventDotClass(ev) {
  const today = startOfDay(new Date());
  const last = startOfDay(ev.endDate || ev.startDate || ev.date);
  if (last < today) return "bg-gray-400";
  if (ev.registrationOpen) return "bg-orange-500";
  if (ev.eventOwnership === "external_event") return "bg-blue-500";
  return "bg-green-500";
}

function statusPillClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "upcoming") return "bg-[#008000]/10 text-[#008000] border border-[#008000]/20";
  if (s === "ongoing") return "bg-amber-100 text-amber-900 border border-amber-200";
  if (s === "completed") return "bg-gray-100 text-gray-700 border border-gray-200";
  if (s === "cancelled") return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const [sortKey, setSortKey] = useState("startDate");
  const [sortDir, setSortDir] = useState("asc");

  const fetchEvents = () => {
    setLoading(true);
    axios
      .get("/admin/events")
      .then((res) => {
        setEvents(Array.isArray(res?.data?.data) ? res.data.data : []);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventsByDate = useMemo(() => buildEventsByDate(events), [events]);

  const stats = useMemo(() => {
    const t0 = startOfDay(new Date());
    const total = events.length;
    let upcoming = 0;
    let regOpen = 0;
    let past = 0;
    events.forEach((ev) => {
      const last = startOfDay(ev.endDate || ev.startDate || ev.date);
      const first = startOfDay(ev.startDate || ev.date || ev.endDate);
      if (last < t0) past += 1;
      else {
        upcoming += 1;
        if (ev.registrationOpen) regOpen += 1;
      }
    });
    return { total, upcoming, regOpen, past };
  }, [events]);

  const upcoming30 = useMemo(() => {
    const t0 = startOfDay(new Date());
    const t30 = new Date(t0);
    t30.setDate(t30.getDate() + 30);
    return events
      .filter((ev) => {
        const start = startOfDay(ev.startDate || ev.date || ev.endDate);
        return start >= t0 && start <= t30;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate || a.date).getTime() -
          new Date(b.startDate || b.date).getTime()
      );
  }, [events]);

  const sortedList = useMemo(() => {
    const arr = [...events];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let va;
      let vb;
      if (sortKey === "title") {
        va = (a.title || a.name || "").toLowerCase();
        vb = (b.title || b.name || "").toLowerCase();
      } else if (sortKey === "status") {
        va = (a.status || "").toLowerCase();
        vb = (b.status || "").toLowerCase();
      } else {
        va = new Date(a.startDate || a.date || 0).getTime();
        vb = new Date(b.startDate || b.date || 0).getTime();
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return arr;
  }, [events, sortKey, sortDir]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir(k === "startDate" ? "asc" : "asc");
    }
  };

  const handlePrevMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(null);
  };

  const openPublic = (id) => {
    window.open(`${window.location.origin}/events/${id}`, "_blank", "noopener,noreferrer");
  };

  const legend = (
    <>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span>PKF</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <span>External</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        <span>Reg. open</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-gray-400" />
        <span>Past</span>
      </div>
    </>
  );

  const headerRight = (
    <div className="flex items-center gap-1 ml-2 border border-gray-200 rounded-full p-0.5 bg-gray-50">
      <button
        type="button"
        onClick={() => setView("calendar")}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
          view === "calendar" ? "bg-white shadow text-[#008000]" : "text-gray-600"
        }`}
        title="Calendar"
      >
        ▦
      </button>
      <button
        type="button"
        onClick={() => setView("list")}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
          view === "list" ? "bg-white shadow text-[#008000]" : "text-gray-600"
        }`}
        title="List"
      >
        ☰
      </button>
    </div>
  );

  const dayEvents = selectedDate
    ? eventsByDate[dateKey(selectedDate)] || []
    : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Schedule</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Events", value: stats.total, className: "bg-gray-100" },
          { label: "Upcoming", value: stats.upcoming, className: "bg-green-50 border border-green-200" },
          { label: "Registration Open", value: stats.regOpen, className: "bg-orange-50 border border-orange-200" },
          { label: "Past Events", value: stats.past, className: "bg-gray-100" },
        ].map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl p-4 ${c.className}`}
          >
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {c.label}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">
          Upcoming in next 30 days
        </h3>
        {loading ? (
          <div className="animate-pulse h-20 bg-gray-100 rounded-xl" />
        ) : upcoming30.length === 0 ? (
          <p className="text-sm text-gray-500">No events in this window.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {upcoming30.map((ev) => (
              <li
                key={ev._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => setModalEvent(ev)}
                  className="font-medium text-left text-[#008000] hover:underline"
                >
                    {ev.event_name || ev.title || ev.name}
                </button>
                <span className="text-gray-500">
                  {formatDateRange(
                    ev.startDate || ev.date,
                    ev.endDate
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {view === "calendar" ? (
        <>
          <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
            <p className="text-sm text-gray-600">
              All events from the database. Dots: green PKF, blue external, orange
              registration open, grey past.
            </p>
          </div>
          <CalendarGrid
            eventsByDate={eventsByDate}
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            getEventDotClass={adminEventDotClass}
            todayAnchor={today}
            legend={legend}
            headerRight={headerRight}
          />

          {selectedDate && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-gray-500"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {dayEvents.map((ev) => (
                  <button
                    key={ev._id}
                    type="button"
                    onClick={() => setModalEvent(ev)}
                    className="w-full text-left rounded-xl border border-gray-100 p-3 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${adminEventDotClass(ev)}`}
                    />
                    <div>
                      <div className="font-semibold text-sm">
                        {ev.event_name || ev.title || ev.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {ev.level} • {ev.type} • {ev.category}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="text-xs text-gray-500 truncate">{ev.location}</div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusPillClass(ev.status)}`}>
                          {String(ev.status || "").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-end">{headerRight}</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-2 text-left">
                    <button
                      type="button"
                      onClick={() => toggleSort("title")}
                      className="font-semibold text-[#008000]"
                    >
                      Title {sortKey === "title" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left">
                    <button
                      type="button"
                      onClick={() => toggleSort("startDate")}
                      className="font-semibold text-[#008000]"
                    >
                      Dates {sortKey === "startDate" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left hidden sm:table-cell">Location</th>
                  <th className="px-3 py-2 text-left">
                    <button
                      type="button"
                      onClick={() => toggleSort("status")}
                      className="font-semibold text-[#008000]"
                    >
                      Status {sortKey === "status" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((ev) => (
                  <tr key={ev._id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium">
                      {ev.event_name || ev.title || ev.name}
                    </td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                      {formatDateRange(
                        ev.startDate || ev.date,
                        ev.endDate
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-600 hidden sm:table-cell max-w-[180px] truncate">
                      {ev.location || "—"}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {ev.status || "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setModalEvent(ev)}
                        className="text-[#008000] font-semibold text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalEvent ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalEvent.event_name || modalEvent.title || modalEvent.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border border-[#008000]/20 bg-[#008000]/5 text-[#008000]">
                    {modalEvent.level}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700">
                    {modalEvent.type}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700">
                    {modalEvent.category}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusPillClass(modalEvent.status)}`}>
                    {String(modalEvent.status || "").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              {formatDateRange(modalEvent.startDate || modalEvent.date, modalEvent.endDate)}
            </p>
            {modalEvent.location ? (
              <p className="text-sm text-gray-600 mt-1">{modalEvent.location}</p>
            ) : null}

            {modalEvent.registrationDeadline ? (
              <p className="text-xs text-gray-500 mt-2">
                Registration deadline:{" "}
                {new Date(modalEvent.registrationDeadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            ) : null}

            {modalEvent.description ? (
              <p className="text-sm text-gray-700 mt-3 line-clamp-4">
                {modalEvent.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setModalEvent(null);
                  navigate(`/admin/dashboard/events?focus=${modalEvent._id}`);
                }}
                className="flex-1 py-3 rounded-xl bg-[#008000] text-white font-semibold"
              >
                Edit Event
              </button>
              <button
                type="button"
                onClick={() => openPublic(modalEvent._id)}
                className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
              >
                View Public Page
              </button>
            </div>
            <button
              type="button"
              onClick={() => setModalEvent(null)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
