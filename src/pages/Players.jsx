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

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const [province, setProvince] = useState("All");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    axios
      .get("/players")
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setPlayers(data);
      })
      .catch(() => {
        if (alive) {
          setPlayers([]);
          setError("Failed to load players. Please try again.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retryNonce]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return players.filter((p) => {
      if (province !== "All" && (p.province || "") !== province) return false;
      if (category !== "All") {
        const c = p.category || "";
        if (category === "Kumite" && c !== "Kumite" && c !== "Both") return false;
        if (category === "Kata" && c !== "Kata" && c !== "Both") return false;
      }
      if (gender !== "All" && (p.gender || "") !== gender) return false;
      if (q && !(p.name || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [players, province, category, gender, search]);

  return (
    <div className="max-w-7xl mx-auto pb-16 px-4">
      <div className="relative -mx-4 sm:mx-0 mb-8 rounded-none sm:rounded-2xl overflow-hidden bg-gradient-to-r from-[#021f02] via-[#053905] to-[#008000] text-white">
        <div className="relative px-6 sm:px-12 py-12 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold">Our Athletes</h1>
          <p className="mt-2 text-sm text-white/80 max-w-xl">
            National team and registered competitors representing Pakistan.
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white"
        >
          <option value="All">All Categories</option>
          <option value="Kumite">Kumite</option>
          <option value="Kata">Kata</option>
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white"
        >
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-full px-4 py-2 text-sm bg-white"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
          <div className="text-red-700 font-semibold">Could not load players</div>
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
        <p className="text-center text-gray-500 py-12">No athletes match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PersonCard key={p._id} person={p} type="player" />
          ))}
        </div>
      )}
    </div>
  );
}
