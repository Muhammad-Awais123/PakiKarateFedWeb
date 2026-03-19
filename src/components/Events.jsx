import React, { useEffect, useMemo, useState } from "react";
import EventGrid from "../events/EventGrid";
import { Link } from "react-router-dom";
import { fetchEvents as fetchEventsApi } from "../services/eventsApi";

const HOME_FEATURED_COUNT = 3;

function getEventSortTime(ev) {
  const raw =
    ev?.startDate ||
    ev?.date ||
    ev?.eventDate ||
    ev?.endDate ||
    ev?.createdAt;
  const t = raw ? new Date(raw).getTime() : NaN;
  return Number.isFinite(t) ? t : 0;
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchEventsApi();
      setEvents(list);
    } catch (e) {
      setEvents([]);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      await fetchEvents();
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featuredEvents = useMemo(() => {
    const sorted = [...(events || [])].sort(
      (a, b) => getEventSortTime(b) - getEventSortTime(a)
    );
    return sorted.slice(0, HOME_FEATURED_COUNT);
  }, [events]);

  return (
    <section
      id="events"
      className="py-12 lg:py-14 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-black"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1.5 bg-[#008000]/10 rounded-full text-[#008000] text-sm font-semibold mb-3">
              EVENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50">
              Latest Events
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PKF and external championships.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/schedule"
              className="text-sm font-medium text-[#008000] hover:underline"
            >
              View Calendar
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: HOME_FEATURED_COUNT }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-52 w-full bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-9 bg-gray-200 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
            <div className="text-red-700 font-semibold">Could not load events</div>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
            <button
              type="button"
              onClick={fetchEvents}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#008000] text-white px-5 py-2 text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <EventGrid events={featuredEvents} />
            <div className="mt-6 text-center">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-[#008000] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-95 transition"
              >
                View all events <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

