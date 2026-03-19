import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig.js";

const WorldRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRankings = async () => {
      setError("");
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/rankings");
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const sorted = [...list].sort(
          (a, b) => Number(a?.rank) - Number(b?.rank)
        );
        setRankings(sorted.slice(0, 5));
      } catch (error) {
        setRankings([]);
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load rankings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return (
    <section id="rankings" className="py-12 lg:py-14 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1.5 bg-[#008000]/10 rounded-full text-[#008000] text-sm font-semibold mb-3">
              RANKINGS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              World Rankings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Top athletes in global karate.
            </p>
          </div>
          <Link
            to="/rankings"
            className="text-sm font-medium text-[#008000] hover:underline"
          >
            Full Rankings →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 dark:border-red-800 p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-semibold">Could not load rankings</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          </div>
        ) : rankings && rankings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankings.map((r) => (
              <div
                key={r._id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {r.rank}. {r.name}
                  </h3>
                  {r.points != null && (
                    <span className="text-xs font-medium text-[#008000]">{r.points} pts</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {r.country} · {r.category || "—"}
                </p>
                {r.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {r.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No rankings available
          </p>
        )}
      </div>
    </section>
  );
};

export default WorldRankings;