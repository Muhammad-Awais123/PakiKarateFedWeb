import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import PersonCard from "../components/PersonCard";

export default function Legends() {
  const [legends, setLegends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    axios
      .get("/legends")
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setLegends(data);
      })
      .catch(() => {
        if (alive) {
          setLegends([]);
          setError("Failed to load legends. Please try again.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retryNonce]);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Hall of Fame hero */}
      <div className="relative -mx-4 sm:mx-0 mb-10 rounded-none sm:rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004d00] via-[#006400] to-[#008000]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        <div className="relative px-6 sm:px-14 py-16 sm:py-20 text-center border border-emerald-200/30 sm:rounded-2xl">
          <p className="text-emerald-100 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase mb-3">
            Hall of Fame
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            PKF Legends
          </h1>
          <p className="mt-4 text-sm sm:text-base text-emerald-50/90 max-w-2xl mx-auto leading-relaxed">
            Pioneers and champions who shaped Pakistani karate. Their legacy inspires every
            athlete on the tatami.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <span className="h-px w-12 bg-emerald-100/70" />
            <span className="text-emerald-100 text-lg">★</span>
            <span className="h-px w-12 bg-emerald-100/70" />
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center max-w-7xl mx-auto">
          <div className="text-red-700 font-semibold">Could not load legends</div>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => setRetryNonce((n) => n + 1)}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#008000] text-white px-5 py-2 text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-100 dark:border-emerald-900/40 overflow-hidden animate-pulse bg-zinc-950/5"
            >
              <div className="aspect-[3/4] max-h-[420px] bg-gray-300" />
            </div>
          ))}
        </div>
      ) : legends.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Legends will appear here as they are added to the federation archive.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {legends.map((leg) => (
            <div key={leg._id} className="md:scale-[1.02] md:hover:scale-[1.03] transition-transform duration-300">
              <PersonCard person={leg} type="legend" variant="legend" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
