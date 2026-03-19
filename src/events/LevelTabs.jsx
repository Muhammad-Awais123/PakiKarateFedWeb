import { useState } from "react";

const LEVELS = ["National", "International"];

export default function LevelTabs({ activeLevel, onChange, eventCounts }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop horizontal tabs */}
      <div className="hidden sm:flex gap-1 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 p-1">
        {LEVELS.map((level) => {
          const active = activeLevel === level;
          const count = eventCounts?.[level] ?? 0;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`relative flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#008000] text-white shadow-lg shadow-emerald-600/25"
                  : "text-gray-600 dark:text-zinc-300 hover:text-[#008000] dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
              }`}
            >
              {level}
              {count > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile accordion */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 px-4 py-3 text-sm font-semibold text-gray-800 dark:text-zinc-100"
        >
          <span>Level: {activeLevel}</span>
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
          <div className="mt-1 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 overflow-hidden">
            {LEVELS.map((level) => {
              const active = activeLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    onChange(level);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-[#008000] dark:text-emerald-300"
                      : "text-gray-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
