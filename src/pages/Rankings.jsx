import React, { useEffect, useMemo, useState } from "react";
import axios from "../utils/axiosConfig";

const PAGE_SIZE = 20;

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

const TABS = [
  { id: "senior", label: "Senior Rankings" },
  { id: "junior", label: "Junior Rankings" },
  { id: "cadet", label: "Cadet Rankings" },
];

function matchesDivisionTab(r, tabId) {
  const div = (r.division || r.ageGroup || "").toString().toLowerCase();
  if (tabId === "senior") {
    if (!r.division && !r.ageGroup) return true;
    return div.includes("senior") || div === "";
  }
  if (tabId === "junior") return div.includes("junior");
  if (tabId === "cadet") return div.includes("cadet");
  return true;
}

function getAthleteName(r) {
  return r.athleteName || r.name || "—";
}

function getPhoto(r) {
  return r.photoUrl || r.image || "";
}

function getProvince(r) {
  return r.province || r.country || "—";
}

function getWeightClass(r) {
  return r.weightClass != null && r.weightClass !== "" ? r.weightClass : "—";
}

function getGender(r) {
  return (r.gender || "").toString();
}

function getYear(r) {
  if (r.year != null && r.year !== "") return Number(r.year);
  if (r.createdAt) return new Date(r.createdAt).getFullYear();
  return new Date().getFullYear();
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Rankings() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("senior");
  const [year, setYear] = useState("All");
  const [gender, setGender] = useState("All");
  const [discipline, setDiscipline] = useState("All");
  const [weightClass, setWeightClass] = useState("All");
  const [province, setProvince] = useState("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    axios
      .get("/rankings")
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setRaw(data);
      })
      .catch((e) => {
        if (alive) setRaw([]);
        if (alive) {
          setError(
            e?.response?.data?.message ||
              e?.message ||
              "Failed to load rankings. Please try again."
          );
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [retryNonce]);

  const years = useMemo(() => {
    const set = new Set();
    raw.forEach((r) => set.add(getYear(r)));
    const arr = Array.from(set).sort((a, b) => b - a);
    if (arr.length === 0) arr.push(new Date().getFullYear());
    return arr;
  }, [raw]);

  const weightClasses = useMemo(() => {
    const set = new Set();
    raw.forEach((r) => {
      if (r.weightClass != null && String(r.weightClass).trim() !== "") {
        set.add(String(r.weightClass).trim());
      }
    });
    return Array.from(set).sort();
  }, [raw]);

  const filtered = useMemo(() => {
    return raw.filter((r) => {
      if (!matchesDivisionTab(r, activeTab)) return false;
      if (year !== "All" && String(getYear(r)) !== year) return false;
      if (gender !== "All") {
        const g = getGender(r);
        if (g && g.toLowerCase() !== gender.toLowerCase()) return false;
      }
      if (discipline !== "All" && r.category !== discipline) return false;
      if (weightClass !== "All" && String(r.weightClass || "") !== weightClass)
        return false;
      if (province !== "All") {
        const p = (r.province || "").toString().trim();
        if (!p) return false;
        if (p !== province) return false;
      }
      const q = search.trim().toLowerCase();
      if (q) {
        const name = getAthleteName(r).toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [
    raw,
    activeTab,
    year,
    gender,
    discipline,
    weightClass,
    province,
    search,
  ]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let va;
      let vb;
      switch (sortKey) {
        case "rank":
          va = Number(a.rank) || 9999;
          vb = Number(b.rank) || 9999;
          break;
        case "name":
          va = getAthleteName(a).toLowerCase();
          vb = getAthleteName(b).toLowerCase();
          break;
        case "province":
          va = getProvince(a).toLowerCase();
          vb = getProvince(b).toLowerCase();
          break;
        case "points":
          va = Number(a.points) || 0;
          vb = Number(b.points) || 0;
          break;
        case "weightClass":
          va = getWeightClass(a).toLowerCase();
          vb = getWeightClass(b).toLowerCase();
          break;
        case "category":
          va = (a.category || "").toLowerCase();
          vb = (b.category || "").toLowerCase();
          break;
        default:
          va = Number(a.rank) || 0;
          vb = Number(b.rank) || 0;
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, pageSafe]);

  useEffect(() => {
    setPage(1);
  }, [
    activeTab,
    year,
    gender,
    discipline,
    weightClass,
    province,
    search,
  ]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "province" || key === "weightClass" || key === "category" ? "asc" : "asc");
    }
  };

  const SortBtn = ({ colKey, children }) => (
    <button
      type="button"
      onClick={() => toggleSort(colKey)}
      className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-[#008000]"
    >
      {children}
      {sortKey === colKey ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  const rowStyle = (rankNum) => {
    const n = Number(rankNum);
    if (n === 1) return "bg-amber-50 border-l-4 border-l-amber-400";
    if (n === 2) return "bg-gray-50 border-l-4 border-l-gray-400";
    if (n === 3) return "bg-orange-50 border-l-4 border-l-orange-400";
    return "bg-white";
  };

  const medalIcon = (rankNum) => {
    const n = Number(rankNum);
    if (n === 1) return <span className="text-amber-500 text-lg" title="1st">🥇</span>;
    if (n === 2) return <span className="text-gray-500 text-lg" title="2nd">🥈</span>;
    if (n === 3) return <span className="text-orange-600 text-lg" title="3rd">🥉</span>;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 px-4">
      {/* Hero */}
      <div className="relative -mx-4 sm:mx-0 mb-8 rounded-none sm:rounded-2xl overflow-hidden bg-gradient-to-r from-[#021f02] via-[#053905] to-[#008000] text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative px-6 sm:px-12 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            PKF Official Rankings
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl">
            National karate rankings — filter by division, season, and discipline.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === t.id
                ? "border-[#008000] text-[#008000]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl border border-gray-200 bg-white">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white min-w-[100px]"
        >
          <option value="All">All Years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
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

        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white"
        >
          <option value="All">All Disciplines</option>
          <option value="Kumite">Kumite</option>
          <option value="Kata">Kata</option>
        </select>

        <select
          value={weightClass}
          onChange={(e) => setWeightClass(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-sm bg-white max-w-[160px]"
        >
          <option value="All">All Weights</option>
          {weightClasses.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

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

        <input
          type="search"
          placeholder="Search athlete..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] border border-gray-200 rounded-full px-4 py-2 text-sm bg-white"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 animate-pulse space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <div className="text-red-700 font-semibold">Could not load rankings</div>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => setRetryNonce((n) => n + 1)}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#008000] text-white px-5 py-2 text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <p className="text-gray-600 font-medium">No results</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting filters or search.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left w-24">
                    <SortBtn colKey="rank">Rank</SortBtn>
                  </th>
                  <th className="px-3 py-3 text-left w-16">Photo</th>
                  <th className="px-3 py-3 text-left">
                    <SortBtn colKey="name">Athlete</SortBtn>
                  </th>
                  <th className="px-3 py-3 text-left hidden sm:table-cell">
                    <SortBtn colKey="province">Province</SortBtn>
                  </th>
                  <th className="px-3 py-3 text-right">
                    <SortBtn colKey="points">Points</SortBtn>
                  </th>
                  <th className="px-3 py-3 text-left hidden md:table-cell">
                    <SortBtn colKey="weightClass">Weight</SortBtn>
                  </th>
                  <th className="px-3 py-3 text-left hidden lg:table-cell">
                    <SortBtn colKey="category">Category</SortBtn>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => {
                  const name = getAthleteName(r);
                  const photo = getPhoto(r);
                  return (
                    <tr
                      key={r._id}
                      className={`border-b border-gray-100 ${rowStyle(r.rank)}`}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {medalIcon(r.rank)}
                          <span className="font-bold text-gray-900">{r.rank}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {photo ? (
                          <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#008000]/15 text-[#008000] flex items-center justify-center text-xs font-bold border border-[#008000]/30">
                            {initials(name)}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 font-semibold text-gray-900">
                        {name}
                      </td>
                      <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">
                        {getProvince(r)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-[#008000]">
                        {r.points}
                      </td>
                      <td className="px-3 py-3 text-gray-600 hidden md:table-cell">
                        {getWeightClass(r)}
                      </td>
                      <td className="px-3 py-3 text-gray-600 hidden lg:table-cell">
                        {r.category || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-sm text-gray-600">
            <span>
              Page {pageSafe} of {totalPages} · {sorted.length} athlete
              {sorted.length === 1 ? "" : "s"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pageSafe >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
