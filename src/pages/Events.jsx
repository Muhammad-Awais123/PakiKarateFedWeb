import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LevelTabs from "../events/LevelTabs";
import CategoryTabs from "../events/CategoryTabs";
import TypeTabs from "../events/TypeTabs";
import EventGrid from "../events/EventGrid";
import { fetchEvents as fetchEventsApi } from "../services/eventsApi";

export default function Events() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeLevel, setActiveLevel] = useState("National");
  const [activeCategory, setActiveCategory] = useState("Men");
  const [activeType, setActiveType] = useState("Games");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEventsApi({ sort: "date_asc" });
      setAllEvents(data);
    } catch (e) {
      setAllEvents([]);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const levelCounts = useMemo(() => {
    const counts = { National: 0, International: 0 };
    for (const ev of allEvents) {
      if (counts[ev.level] !== undefined) counts[ev.level]++;
    }
    return counts;
  }, [allEvents]);

  const levelEvents = useMemo(
    () => allEvents.filter((ev) => ev.level === activeLevel),
    [allEvents, activeLevel]
  );

  const categoryCounts = useMemo(() => {
    const counts = { Men: 0, Women: 0, Junior: 0, Senior: 0 };
    for (const ev of levelEvents) {
      if (counts[ev.category] !== undefined) counts[ev.category]++;
    }
    return counts;
  }, [levelEvents]);

  const categoryEvents = useMemo(
    () => levelEvents.filter((ev) => ev.category === activeCategory),
    [levelEvents, activeCategory]
  );

  const typeCounts = useMemo(() => {
    const counts = { Games: 0, Championship: 0 };
    for (const ev of categoryEvents) {
      if (counts[ev.type] !== undefined) counts[ev.type]++;
    }
    return counts;
  }, [categoryEvents]);

  const finalEvents = useMemo(
    () => categoryEvents.filter((ev) => ev.type === activeType),
    [categoryEvents, activeType]
  );

  const upcoming = finalEvents.filter((ev) => ev.status === "upcoming");
  const completed = finalEvents.filter((ev) => ev.status === "completed");

  const breadcrumbLabel = `${activeLevel} › ${activeCategory} › ${activeType}`;

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-[#008000] transition-colors">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-gray-800 dark:text-zinc-200 font-medium">Events</span>
        </nav>

        {/* Hero */}
        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-white via-emerald-50/60 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6 sm:p-8 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-100">
            Karate Events
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-2 max-w-2xl text-sm sm:text-base">
            Drill down by level, category, and type to find your event. Live
            countdowns for upcoming competitions.
          </p>
        </div>

        {/* Level tabs — tier 1 */}
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-2 font-semibold">
            Level
          </p>
          <LevelTabs
            activeLevel={activeLevel}
            onChange={setActiveLevel}
            eventCounts={levelCounts}
          />
        </div>

        {/* Category tabs — tier 2 */}
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-2 font-semibold">
            Category
          </p>
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            eventCounts={categoryCounts}
          />
        </div>

        {/* Type tabs — tier 3 */}
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-2 font-semibold">
            Type
          </p>
          <TypeTabs
            activeType={activeType}
            onChange={setActiveType}
            eventCounts={typeCounts}
          />
        </div>

        {/* Active selection breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
          <span className="font-medium text-gray-700 dark:text-zinc-300">Showing:</span>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-emerald-800 dark:text-emerald-200">
            {breadcrumbLabel}
          </span>
          <span className="text-gray-500 dark:text-zinc-500">
            — {finalEvents.length} event{finalEvents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-950 p-6 text-center">
            <div className="text-red-600 dark:text-red-400 font-semibold">
              Could not load events
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2">{error}</p>
            <button
              type="button"
              onClick={loadEvents}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#008000] text-white px-5 py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton loading */}
        {!error && loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 overflow-hidden animate-pulse"
              >
                <div className="aspect-video w-full bg-gray-200 dark:bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-9 bg-gray-200 dark:bg-zinc-800 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {!error && !loading && (
          <>
            {finalEvents.length === 0 ? (
              <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-zinc-950 p-12 text-center">
                <div className="text-4xl mb-3">🥋</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  No events found
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
                  No {activeType.toLowerCase()} events for{" "}
                  {activeCategory.toLowerCase()} in the{" "}
                  {activeLevel.toLowerCase()} category yet.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {upcoming.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#008000] animate-pulse" />
                      Upcoming
                      <span className="text-sm font-normal text-gray-500 dark:text-zinc-400">
                        ({upcoming.length})
                      </span>
                    </h2>
                    <EventGrid events={upcoming} />
                  </div>
                )}

                {completed.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Completed
                      <span className="text-sm font-normal text-gray-500 dark:text-zinc-400">
                        ({completed.length})
                      </span>
                    </h2>
                    <EventGrid events={completed} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
