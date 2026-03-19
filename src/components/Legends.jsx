import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMedalLine,
  RiTrophyLine,
  RiAwardLine,
  RiUserStarLine,
  RiFlag2Line,
  RiCalendarLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import axiosInstance from "../utils/axiosConfig";

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== "undefined" &&
  window.location?.origin?.includes("localhost")
    ? "http://localhost:5000"
    : "");

function photoUrl(photo) {
  if (!photo) return "";
  if (String(photo).startsWith("http")) return photo;
  if (API_ORIGIN && String(photo).startsWith("/")) return `${API_ORIGIN}${photo}`;
  return photo;
}

function deriveCategory(legend) {
  const text = `${legend?.bio || ""} ${legend?.notableTitles || ""}`.toLowerCase();
  if (
    text.includes("coach") ||
    text.includes("trainer") ||
    text.includes("instructor")
  ) {
    return "coach";
  }
  return "athlete";
}

function normalizeLegend(doc) {
  const achievements = Array.isArray(doc?.achievements) ? doc.achievements : [];

  const lcAchievements = achievements.map((a) => String(a).toLowerCase());
  const countKeyword = (kw) =>
    lcAchievements.reduce((acc, cur) => (cur.includes(kw) ? acc + 1 : acc), 0);

  // Backend legend model doesn't have explicit medal counters, so we infer them
  // from the text content of `achievements` for better UI consistency.
  const gold = countKeyword("gold");
  const silver = countKeyword("silver");
  const bronze = countKeyword("bronze");
  const international = lcAchievements.reduce((acc, cur) => {
    // Treat "international" and "event" as a proxy for global appearances.
    const hit = cur.includes("international") || cur.includes("event") || cur.includes("championship");
    return hit ? acc + 1 : acc;
  }, 0);

  // Existing UI expects: { id, name, image, title, honor, era, stats, achievements, participations, social, category }
  // Backend Legend schema is smaller, so we safely derive what we can.
  return {
    id: doc?._id ?? doc?.id,
    name: doc?.name ?? "—",
    image: photoUrl(doc?.photo) || "",
    era: doc?.yearsActive || "",
    title: doc?.notableTitles || doc?.bio || "",
    honor: doc?.notableTitles || "",
    category: deriveCategory(doc),
    achievements,
    participations: Array.isArray(doc?.participations)
      ? doc.participations
      : doc?.bio
        ? [doc.bio]
        : [],
    social: doc?.social || "",
    stats: {
      gold,
      silver,
      bronze,
      // Use achievements count as a fallback so the UI doesn't break.
      international: international || achievements.length,
    },
  };
}

// Motion list
const MotionList = ({ items, direction = "left" }) => (
  <div className="space-y-1">
    {items.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: direction === "left" ? -15 : 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        className="p-1 bg-gray-800/30 dark:bg-gray-700/40 rounded text-sm text-gray-300"
      >
        {item}
      </motion.div>
    ))}
  </div>
);

// Legend Card — Golden Hall of Fame style
const LegendCard = ({ legend, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400/60 dark:hover:border-emerald-700/60 hover:shadow-emerald-500/10 hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative flex flex-col h-full bg-gradient-to-b from-white via-emerald-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        {/* Subtle green shimmer overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,128,0,0.09),transparent_50%)] pointer-events-none" />

        {/* Image area */}
        <div className="relative w-full aspect-[3/4] min-h-[200px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent z-10" />
          {legend.image ? (
            <img
              src={legend.image}
              alt={legend.name}
              loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/20">
              <RiUserStarLine className="text-5xl text-emerald-700/40 dark:text-emerald-400/40" />
            </div>
          )}
          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40">
              {legend.category}
            </span>
            {legend.era && (
              <span className="flex items-center gap-1 text-gray-600 dark:text-emerald-200/80 text-xs">
                <RiCalendarLine className="text-emerald-600/70 dark:text-emerald-400/70" /> {legend.era}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{legend.name}</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300/90 line-clamp-1">{legend.title}</p>
          {legend.honor && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-1 flex items-center gap-1">
              <RiAwardLine /> {legend.honor}
            </p>
          )}

          {/* Stats — medal style */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {["gold", "silver", "bronze", "international"].map((stat) => (
              <div
                key={stat}
                className="text-center p-2 rounded-lg bg-emerald-50/80 dark:bg-black/30 border border-emerald-100 dark:border-emerald-900/40"
              >
                {stat === "gold" && <RiTrophyLine className="mx-auto mb-0.5 text-emerald-500" size={18} />}
                {stat === "silver" && <RiMedalLine className="mx-auto mb-0.5 text-gray-300" size={18} />}
                {stat === "bronze" && <RiMedalLine className="mx-auto mb-0.5 text-emerald-700" size={18} />}
                {stat === "international" && <RiFlag2Line className="mx-auto mb-0.5 text-emerald-500/80" size={18} />}
                <span className="font-bold text-emerald-900 dark:text-emerald-100 block text-sm">{legend.stats[stat]}</span>
                <span className="text-[10px] text-emerald-700/70 dark:text-emerald-200/60 block uppercase">
                  {stat === "international" ? "Events" : stat}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-4 pt-3 border-t border-emerald-300/30 dark:border-emerald-500/20 flex items-center justify-end gap-1 text-emerald-700 dark:text-emerald-400 text-sm font-medium"
          >
            View Profile <RiArrowRightSLine className="text-emerald-600 dark:text-emerald-400" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Profile Popup Modal
const ProfilePopup = ({ legend, onClose }) => {
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-2xl shadow-2xl border border-emerald-400/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full h-48 sm:h-56 relative overflow-hidden">
            <img
              src={legend.image}
              alt={legend.name}
              loading="lazy"
              className="w-full h-full object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end p-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{legend.name}</h2>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#008000] text-white text-xs">{legend.title}</span>
                  {legend.honor && <span className="px-2 py-0.5 rounded-full bg-emerald-100/20 border border-emerald-300 text-emerald-300 text-xs">{legend.honor}</span>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6 grid md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-1" style={{ color: '#008000' }}><RiTrophyLine /> Achievements</h3>
              <MotionList items={legend.achievements} direction="left" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1 flex items-center gap-1" style={{ color: '#008000' }}><RiFlag2Line /> Participations</h3>
              <MotionList items={legend.participations} direction="right" />
              {legend.social && <div className="mt-2 p-2 bg-gray-800/30 rounded-md border border-gray-700 text-sm"><p className="font-semibold" style={{ color: '#008000' }}>Follow: {legend.social}</p></div>}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

// Main Legends Component
const Legends = () => {
  const [activeLegend, setActiveLegend] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const [rawLegends, setRawLegends] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    axiosInstance
      .get("/legends")
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];
        setRawLegends(list);
      })
      .catch((e) => {
        if (!alive) return;
        setRawLegends([]);
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load legends."
        );
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [retryNonce]);

  const normalizedLegends = useMemo(
    () => (rawLegends || []).map((d) => normalizeLegend(d)),
    [rawLegends]
  );

  const filteredLegends = useMemo(() => {
    const q = search.trim().toLowerCase();
    return normalizedLegends.filter((l) => {
      if (filter !== "all" && l.category !== filter) return false;
      if (q && !String(l.name || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [normalizedLegends, filter, search]);

  useEffect(() => {
    // If the active legend is filtered out, close it.
    if (
      activeLegend == null ||
      filteredLegends.some((l) => String(l.id) === String(activeLegend))
    ) {
      return;
    }
    setActiveLegend(null);
  }, [filteredLegends, activeLegend]);

  return (
    <section id="legends" className="w-full py-12 lg:py-16 bg-white dark:bg-black transition-colors duration-700">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 mb-10">
        <div className="inline-block p-3 bg-[#008000]/20 rounded-full mb-4"><RiUserStarLine className="text-4xl" style={{ color: '#008000' }} /></div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #008000, #00b000)' }}>Legends</span></h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Honoring the heroes who brought glory to Pakistan through Karate.</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <input type="text" placeholder="Search Legends..." value={search} onChange={(e)=>setSearch(e.target.value)} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#008000]/50 text-sm"/>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {["all","athlete","coach"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-sm transition-all duration-300"
              style={{
                backgroundColor: filter===f ? '#008000' : undefined,
                color: filter===f ? '#ffffff' : undefined
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="space-y-4 col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
                    <div className="h-40 bg-gray-100 rounded-lg" />
                    <div className="mt-3 h-4 bg-gray-100 rounded w-2/3" />
                    <div className="mt-2 h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-900 p-6 text-center">
              <div className="text-red-700 dark:text-red-400 font-semibold">Could not load legends</div>
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
            <>
              <AnimatePresence>
                {filteredLegends.map((legend) => (
                  <LegendCard
                    key={legend.id}
                    legend={legend}
                    onClick={() => setActiveLegend(legend.id)}
                  />
                ))}
              </AnimatePresence>
              <AnimatePresence>
                {activeLegend && (() => {
                  const sel = filteredLegends.find((l) => String(l.id) === String(activeLegend));
                  return sel ? <ProfilePopup key={activeLegend} legend={sel} onClose={() => setActiveLegend(null)} /> : null;
                })()}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Legends;