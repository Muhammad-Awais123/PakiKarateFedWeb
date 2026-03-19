import { useState } from "react";

const TYPES = ["Games", "Championship"];

const TYPE_ICONS = {
  Games: "🎮",
  Championship: "🏆",
};

export default function TypeTabs({ activeType, onChange, eventCounts }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex gap-1 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 p-1">
        {TYPES.map((type) => {
          const active = activeType === type;
          const count = eventCounts?.[type] ?? 0;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`flex-1 rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                active
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-[#006400] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40"
                  : "text-gray-600 dark:text-zinc-400 hover:text-[#008000] dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-zinc-800 border border-transparent"
              }`}
            >
              <span className="mr-1">{TYPE_ICONS[type]}</span>
              {type}
              {count > 0 && (
                <span className="ml-1 text-[10px] opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between rounded-lg bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-zinc-200"
        >
          <span>{TYPE_ICONS[activeType]} Type: {activeType}</span>
          <svg
            className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-1 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 overflow-hidden">
            {TYPES.map((type) => {
              const active = activeType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onChange(type);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-[#008000] dark:text-emerald-300 font-semibold"
                      : "text-gray-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {TYPE_ICONS[type]} {type}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
