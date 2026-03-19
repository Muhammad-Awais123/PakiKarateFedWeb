import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CountdownTimer from "../events/CountdownTimer";
import EventCard from "../events/EventCard";
import { fetchEventById, fetchEvents as fetchEventsApi } from "../services/eventsApi";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== "undefined" && window.location?.origin?.includes("localhost")
    ? "http://localhost:5000"
    : "");

function getImageUrl(path) {
  if (!path) return "";
  if (String(path).startsWith("http")) return path;
  if (API_ORIGIN && String(path).startsWith("/")) return `${API_ORIGIN}${path}`;
  return path;
}

function formatDate(date) {
  if (!date) return "";
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const eventData = await fetchEventById(id);
        if (!active) return;
        setEvent(eventData);

        const list = await fetchEventsApi({ sort: "date_asc" });
        if (!active) return;
        const related = list
          .filter((item) => item._id !== id)
          .filter((item) => item.level === eventData?.level)
          .slice(0, 3);
        setRelatedEvents(related);
      } catch (e) {
        if (!active) return;
        setEvent(null);
        setRelatedEvents([]);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load event details. Please try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const imageSrc = useMemo(() => getImageUrl(event?.image), [event?.image]);
  const isUpcoming = event?.status === "upcoming";
  const isCompleted = event?.status === "completed";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-64 sm:h-80 w-full rounded-2xl bg-slate-800 mb-6" />
        <div className="h-8 w-1/3 bg-slate-800 rounded mb-3" />
        <div className="h-5 w-1/2 bg-slate-800 rounded mb-6" />
        <div className="h-24 w-full bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <p className="text-red-600 dark:text-red-400 font-semibold">Could not load event</p>
        <p className="text-sm text-slate-300 mt-2">{error || "Event not found."}</p>
        <Link
          to="/events"
          className="inline-flex mt-4 rounded-xl bg-[#008000] px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <nav className="text-sm text-gray-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-[#008000]">
          Home
        </Link>
        <span className="mx-1">›</span>
        <Link to="/events" className="hover:text-[#008000]">
          Events
        </Link>
        <span className="mx-1">›</span>
        <span className="text-gray-800 dark:text-zinc-200">{event.event_name}</span>
      </nav>

      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 shadow-lg overflow-hidden">
        <div className="aspect-video w-full bg-slate-900">
          {imageSrc ? (
            <img src={imageSrc} alt={event.event_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              Karate Event
            </div>
          )}
        </div>
        <div className="p-6 sm:p-7">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-100">{event.event_name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 dark:bg-zinc-800 px-3 py-1 text-emerald-800 dark:text-zinc-200">{event.level}</span>
            <span className="rounded-full bg-emerald-100 dark:bg-zinc-800 px-3 py-1 text-emerald-800 dark:text-zinc-200">{event.type}</span>
            <span className="rounded-full bg-emerald-100 dark:bg-zinc-800 px-3 py-1 text-emerald-800 dark:text-zinc-200">
              {event.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 ${
                isUpcoming ? "bg-emerald-100 dark:bg-emerald-900/40 text-[#006400] dark:text-emerald-300" : "bg-emerald-700/20 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {isUpcoming ? "upcoming" : "completed"}
            </span>
          </div>

          <div className="mt-4 text-gray-700 dark:text-zinc-300 space-y-1">
            <p>📅 {formatDate(event.date)}</p>
            <p>📍 {event.location}</p>
          </div>
        </div>
      </div>

      {isUpcoming && (
        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 mb-4">Event Starts In</p>
          <CountdownTimer
            targetDate={event.date}
            size="lg"
            expiredLabel={isCompleted ? "Completed" : "Event Started"}
            className="justify-center"
          />
        </div>
      )}

      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-3">About This Event</h2>
        <p className="text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {event.description || "Description will be published soon."}
        </p>
      </div>

      {relatedEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Related Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((item) => (
              <EventCard key={item._id} event={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
