import { useState } from "react";

const CATEGORIES = ["Men", "Women", "Junior", "Senior"];

const CATEGORY_ICONS = {
  Men: "👨",
  Women: "👩",
  Junior: "🧒",
  Senior: "🏅",
};

export default function CategoryTabs({ activeCategory, onChange, eventCounts }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex gap-1 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 p-1">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          const count = eventCounts?.[cat] ?? 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-[#006400] dark:text-emerald-200 shadow-md"
                  : "text-gray-600 dark:text-zinc-400 hover:text-[#008000] dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-zinc-800/70"
              }`}
            >
              <span className="mr-1">{CATEGORY_ICONS[cat]}</span>
              {cat}
              {count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] font-bold ${
                    active ? "text-[#006400] dark:text-emerald-200" : "text-gray-500 dark:text-zinc-500"
                  }`}
                >
                  ({count})
                </span>
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
          className="w-full flex items-center justify-between rounded-xl bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/40 px-4 py-3 text-sm font-medium text-gray-800 dark:text-zinc-200"
        >
          <span>{CATEGORY_ICONS[activeCategory]} Category: {activeCategory}</span>
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
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-[#008000] dark:text-emerald-300 font-semibold"
                      : "text-gray-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800/70"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
