import React, { useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";
import CalendarGrid, {
  buildEventsByDate,
  dateKey,
} from "../components/shared/CalendarGrid";

const formatDateRange = (start, end) => {
  if (!start && !end) return "";
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
    const monthYear = s.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
    return `${s.getDate()} - ${e.getDate()} ${monthYear}`;
  }
  const sStr = s.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const eStr = e.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${sStr} - ${eStr}`;
};

const publicDotClass = (ev) =>
  ev.category === "external_event" ? "bg-blue-500" : "bg-green-500";

export default function Schedule() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    let alive = true;
    const fetchEvents = async () => {
      alive = true;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/events");
        if (!alive) return;
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setEvents(data);
      } catch (e) {
        if (!alive) return;
        setEvents([]);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load schedule."
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      alive = false;
    };
  }, [retryNonce]);

  const eventsByDate = useMemo(() => buildEventsByDate(events), [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0);
    const sorted = [...events].sort((a, b) => {
      const aStart = new Date(
        a.startDate || a.date || a.endDate || now
      ).getTime();
      const bStart = new Date(
        b.startDate || b.date || b.endDate || now
      ).getTime();
      return aStart - bStart;
    });
    return sorted
      .filter((ev) => {
        const start = new Date(
          ev.startDate || ev.date || ev.endDate || now
        ).setHours(0, 0, 0, 0);
        return start >= now;
      })
      .slice(0, 5);
  }, [events]);

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

  const eventsForSelectedDate = selectedDate
    ? eventsByDate[dateKey(selectedDate)] || []
    : [];

  const legend = (
    <>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span>PKF Event</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        <span>External Event</span>
      </div>
    </>
  );

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Event Schedule</h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse PKF events by date.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
              <div className="text-red-700 font-semibold">Could not load schedule</div>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
              <button
                type="button"
                onClick={() => setRetryNonce((n) => n + 1)}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#008000] text-white px-5 py-2 text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          ) : (
            <CalendarGrid
              eventsByDate={eventsByDate}
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              getEventDotClass={publicDotClass}
              todayAnchor={today}
              legend={legend}
            />
          )}

          {selectedDate && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-800">
                  Events on{" "}
                  {selectedDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-sm text-gray-500">No events on this date.</p>
              ) : (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((ev) => (
                    <div
                      key={ev._id}
                      className="flex gap-3 rounded-xl border border-gray-100 p-3"
                    >
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.title || ev.name}
                          loading="lazy"
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-24 rounded-lg bg-gray-200" />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {ev.title || ev.name}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              ev.category === "external_event"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {ev.category === "external_event"
                              ? "External"
                              : "PKF"}
                          </span>
                        </div>
                        {ev.location ? (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {ev.location}
                          </p>
                        ) : null}
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDateRange(
                            ev.startDate || ev.date,
                            ev.endDate
                          )}
                        </p>
                        <div className="mt-2">
                          {ev.category === "external_event" &&
                          ev.externalUrl ? (
                            <a
                              href={ev.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-xs font-semibold text-[#008000]"
                            >
                              Visit Website →
                            </a>
                          ) : (
                            <Link
                              to={`/events/${ev._id}`}
                              className="inline-flex items-center text-xs font-semibold text-[#008000]"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="font-semibold text-gray-800 mb-2">Upcoming Events</div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-14 rounded-xl bg-gray-100" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming events scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div
                    key={ev._id}
                    className="rounded-xl border border-gray-100 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold line-clamp-2">
                        {ev.title || ev.name}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          ev.category === "external_event"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ev.category === "external_event"
                          ? "External"
                          : "PKF"}
                      </span>
                    </div>
                    {ev.location ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {ev.location}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-gray-500">
                      {formatDateRange(
                        ev.startDate || ev.date,
                        ev.endDate
                      )}
                    </p>
                    <div className="mt-1">
                      {ev.category === "external_event" && ev.externalUrl ? (
                        <a
                          href={ev.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-[#008000]"
                        >
                          Visit Website →
                        </a>
                      ) : (
                        <Link
                          to={`/events/${ev._id}`}
                          className="inline-flex items-center text-xs font-semibold text-[#008000]"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
