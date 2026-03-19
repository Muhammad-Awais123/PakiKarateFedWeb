import React, { useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosConfig";
import PersonCard from "../components/PersonCard";

const PROVINCES = [
  "All",
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit-Baltistan",
  "AJK",
  "Islamabad",
];

export default function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const [province, setProvince] = useState("All");
  const [specialization, setSpecialization] = useState("All");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    axios
      .get("/coaches")
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setCoaches(data);
      })
      .catch(() => {
        if (alive) {
          setCoaches([]);
          setError("Failed to load coaches. Please try again.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retryNonce]);

  const specs = useMemo(() => {
    const s = new Set();
    coaches.forEach((c) => {
      if (c.specialization && String(c.specialization).trim()) {
        s.add(String(c.specialization).trim());
      }
    });
    return Array.from(s).sort();
  }, [coaches]);

  const filtered = useMemo(() => {
    return coaches.filter((c) => {
      if (province !== "All" && (c.province || "") !== province) return false;
      if (specialization !== "All" && (c.specialization || "") !== specialization)
        return false;
      return true;
    });
  }, [coaches, province, specialization]);

  return (
    <div className="max-w-7xl mx-auto pb-16 px-4">
      <div className="relative -mx-4 sm:mx-0 mb-8 rounded-none sm:rounded-2xl overflow-hidden bg-gradient-to-r from-[#021f02] via-[#053905] to-[#008000] text-white">
        <div className="relative px-6 sm:px-12 py-12 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold">Our Coaches</h1>
          <p className="mt-2 text-sm text-white/80 max-w-xl">
            Certified instructors and technical staff developing the next generation.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl border border-gray-200 bg-white">
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white"
        >
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All Provinces" : p}
            </option>
          ))}
        </select>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white min-w-[180px]"
        >
          <option value="All">All Specializations</option>
          {specs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
          <div className="text-red-700 font-semibold">Could not load coaches</div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No coaches match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <PersonCard key={c._id} person={c} type="coach" />
          ))}
        </div>
      )}
    </div>
  );
}
