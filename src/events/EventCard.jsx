import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import normalizeEvent from "./normalizeEvent";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== "undefined" &&
  window.location?.origin?.includes("localhost")
    ? "http://localhost:5000"
    : "");

function getImageUrl(path) {
  if (!path) return "";
  if (String(path).startsWith("http")) return path;
  if (API_ORIGIN && String(path).startsWith("/")) return `${API_ORIGIN}${path}`;
  return path;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

export default function EventCard({ event, compact }) {
  const normalized = normalizeEvent(event);
  const { _id, event_name, date, location, image, status } = normalized;

  const displayTitle = event_name || "Untitled Event";
  const dateLabel = formatDate(date);
  const isUpcoming = status === "upcoming";
  const isCompleted = status === "completed";

  const imageSrc = getImageUrl(image);
  const hasImage = !!imageSrc;
  const locationStr = location || "";

  const eventTimeMs = new Date(date).getTime();
  const msToEvent = Number.isFinite(eventTimeMs)
    ? eventTimeMs - Date.now()
    : Number.NaN;
  const showCountdown =
    isUpcoming && Number.isFinite(msToEvent) && msToEvent <= THIRTY_DAYS_MS;

  if (compact) {
    return (
      <Link
        to={`/events/${_id}`}
        className="block bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 rounded-xl shadow overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
      >
        {hasImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
            <img
              src={imageSrc}
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 line-clamp-2">
            {displayTitle}
          </h3>
          {dateLabel && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{dateLabel}</p>
          )}
          {showCountdown && (
            <CountdownTimer
              targetDate={date}
              size="sm"
              className="mt-2"
              expiredLabel="Event Started"
            />
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl shadow-lg hover:shadow-emerald-700/15 hover:border-emerald-300 dark:hover:border-emerald-700 overflow-hidden flex flex-col transition-all">
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {hasImage ? (
          <img
            src={imageSrc}
            alt={displayTitle}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            PKF Event
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            isUpcoming
              ? "bg-[#008000]/85 text-white"
              : "bg-emerald-700/80 text-emerald-100"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Completed"}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 line-clamp-2">
          {displayTitle}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-zinc-400">
          {dateLabel && <p>📅 {dateLabel}</p>}
          {locationStr && <p>📍 {locationStr}</p>}
        </div>

        {showCountdown && (
          <CountdownTimer
            targetDate={date}
            size="sm"
            className="mt-3"
            expiredLabel={isCompleted ? "Completed" : "Event Started"}
          />
        )}

        <div className="mt-auto pt-4">
          <Link
            to={`/events/${_id}`}
            className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isUpcoming
                ? "bg-[#008000] text-white hover:bg-green-700"
                : "bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-zinc-700"
            }`}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
