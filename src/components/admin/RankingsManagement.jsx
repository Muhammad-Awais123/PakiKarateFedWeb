import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "../../utils/axiosConfig.js";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;
const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit-Baltistan",
  "AJK",
  "Islamabad",
];

const AGE_GROUPS = ["Senior", "Junior", "Cadet"];
const DISCIPLINES = ["Kumite", "Kata"];
const GENDERS = ["Male", "Female"];

const COUNTRY_DEFAULT = "Pakistan";

function thumbSrc(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("data:")) return photo;
  return `${API_ORIGIN}${photo}`;
}

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeHeader(h) {
  return (h || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\-_()/.]+/g, "");
}

function parseCsv(text) {
  // Minimal CSV parser with support for:
  // - quoted fields
  // - escaped quotes ("" inside quotes)
  // - comma separators
  // - newline separators
  const normalized = (text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];

    if (inQuotes) {
      if (c === '"') {
        const next = normalized[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }

    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (c === "\n") {
      row.push(field);
      field = "";
      // Skip trailing empty lines
      if (row.some((x) => String(x).trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += c;
  }

  // Last field
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((x) => String(x).trim() !== "")) rows.push(row);
  }

  return rows;
}

function coerceNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function getRankingAthleteName(r) {
  return r?.athleteName || r?.name || "";
}
function getRankingAthletePhoto(r) {
  return r?.athletePhoto || r?.photoUrl || r?.image || "";
}
function getRankingProvince(r) {
  return r?.province || "";
}
function getRankingGender(r) {
  return r?.gender || "";
}
function getRankingAgeGroup(r) {
  return r?.ageGroup || r?.division || "";
}
function getRankingDiscipline(r) {
  return r?.discipline || r?.category || "";
}
function getRankingWeightClass(r) {
  return r?.weightClass || "";
}
function getRankingYear(r) {
  if (r?.year != null && r?.year !== "") return Number(r.year);
  if (r?.createdAt) return new Date(r.createdAt).getFullYear();
  return null;
}
function getRankingSeason(r) {
  return r?.season || "";
}
function getRankingClubName(r) {
  return r?.clubName || "";
}
function getRankingCountry(r) {
  return r?.country || COUNTRY_DEFAULT;
}

function buildRankingPayloadFromForm(form) {
  const rankNum = coerceNumber(form.rank);
  const pointsNum = coerceNumber(form.points);
  const yearNum = coerceNumber(form.year);

  const photoValue = form.athletePhoto || "";

  const payload = {
    // Spec fields
    athleteName: form.athleteName?.trim() || "",
    athletePhoto: photoValue,
    country: COUNTRY_DEFAULT,
    province: form.province || "",
    gender: form.gender || "",
    ageGroup: form.ageGroup || "",
    division: form.ageGroup || "",
    discipline: form.discipline || "",
    category: form.discipline || "",
    weightClass: form.weightClass || "",
    rank: rankNum,
    points: pointsNum,
    year: yearNum,
    season: form.season || "",
    clubName: form.clubName || "",

    // Backward-compat for older backend schema
    name: form.athleteName?.trim() || "",
    image: photoValue,
    description: form.description || "",
  };

  return { payload, rankNum, pointsNum, yearNum };
}

function buildRankingPayloadFromCsvRow(row, headerIndexToNorm) {
  // row: string[] values aligned with headers
  // headerIndexToNorm: { [i]: normalizedHeader }
  const getByNorm = (...normKeys) => {
    for (const [idxNorm, norm] of Object.entries(headerIndexToNorm)) {
      if (normKeys.includes(norm)) return row[Number(idxNorm)] ?? "";
    }
    return "";
  };

  const rawAthleteName = getByNorm("athletename", "name");
  const rawAthletePhoto = getByNorm("athletephoto", "athletephotourl", "photo", "image", "athletephotourl");
  const rawProvince = getByNorm("province");
  const rawGender = getByNorm("gender");
  const rawAgeGroup = getByNorm("agegroup", "agegroupdivision", "division", "age_group");
  const rawDiscipline = getByNorm("discipline", "category");
  const rawWeightClass = getByNorm("weightclass", "weight_class", "weight");
  const rawRank = getByNorm("rank");
  const rawPoints = getByNorm("points");
  const rawYear = getByNorm("year");
  const rawSeason = getByNorm("season");
  const rawClubName = getByNorm("clubname", "club");

  const photoValue = (rawAthletePhoto || "").trim();

  const rankNum = coerceNumber(rawRank);
  const pointsNum = coerceNumber(rawPoints);
  const yearNum = coerceNumber(rawYear);

  const ageGroup = (rawAgeGroup || "").trim();
  const discipline = (rawDiscipline || "").trim();

  // Backward-compat + spec fields. Missing values will be rejected by backend validators.
  return {
    payload: {
      athleteName: (rawAthleteName || "").trim(),
      athletePhoto: photoValue,
      country: COUNTRY_DEFAULT,
      province: (rawProvince || "").trim(),
      gender: (rawGender || "").trim(),
      ageGroup,
      division: ageGroup,
      discipline,
      category: discipline,
      weightClass: (rawWeightClass || "").trim(),
      rank: rankNum,
      points: pointsNum,
      year: yearNum,
      season: (rawSeason || "").trim(),
      clubName: (rawClubName || "").trim(),

      // Older backend schema
      name: (rawAthleteName || "").trim(),
      image: photoValue,
    },
    parsed: { rankNum, pointsNum, yearNum },
  };
}

const emptyForm = () => ({
  athleteName: "",
  athletePhoto: "",
  province: "Punjab",
  gender: "Male",
  ageGroup: "Senior",
  discipline: "Kumite",
  weightClass: "",
  rank: "",
  points: "",
  year: new Date().getFullYear(),
  season: "",
  clubName: "",
  description: "",
});

export default function RankingsManagement() {
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);

  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [manualPhoto, setManualPhoto] = useState(false);

  const [form, setForm] = useState(emptyForm);

  // Sorting
  const [sortKey, setSortKey] = useState("rank"); // rank | points | name
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  // Filters
  const [filterYear, setFilterYear] = useState("All");
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterAgeGroup, setFilterAgeGroup] = useState("All");
  const [filterDiscipline, setFilterDiscipline] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);

  // CSV Import
  const fileInputRef = useRef(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvPreviewRows, setCsvPreviewRows] = useState([]); // parsed payload objects
  const [csvPreviewError, setCsvPreviewError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importResult, setImportResult] = useState({ imported: 0, failed: [] });

  const fetchRankings = useCallback(async () => {
    setLoadingRankings(true);
    try {
      const res = await axios.get("/rankings");
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setRankings(list);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load rankings");
      setRankings([]);
    } finally {
      setLoadingRankings(false);
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    setLoadingPlayers(true);
    try {
      const res = await axios.get("/players");
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setPlayers(list);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load players");
      setPlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
    fetchPlayers();
  }, [fetchRankings, fetchPlayers]);

  useEffect(() => {
    // If user has not manually set a photo, auto-populate from linked player.
    if (manualPhoto) return;
    const match = players.find(
      (p) => (p?.name || "").trim() === (form.athleteName || "").trim()
    );
    if (!match) return;
    setForm((f) => ({
      ...f,
      athletePhoto: thumbSrc(match.photo) || "",
      // Auto-fill province/gender/weight only when form is still default-ish.
      province: f.province ? f.province : "Punjab",
      gender: f.gender ? f.gender : "Male",
      discipline: f.discipline ? f.discipline : match.category,
    }));
  }, [form.athleteName, players, manualPhoto]);

  // Options for filters
  const yearOptions = useMemo(() => {
    const set = new Set();
    rankings.forEach((r) => {
      const y = getRankingYear(r);
      if (y != null) set.add(String(y));
    });
    const arr = Array.from(set).sort((a, b) => Number(b) - Number(a));
    return arr.length ? arr : [];
  }, [rankings]);

  const seasonOptions = useMemo(() => {
    const set = new Set();
    rankings.forEach((r) => {
      const s = getRankingSeason(r);
      if (s && s.toString().trim() !== "") set.add(s);
    });
    return Array.from(set).sort();
  }, [rankings]);

  const filtered = useMemo(() => {
    return rankings.filter((r) => {
      const y = getRankingYear(r);
      const s = getRankingSeason(r);
      const g = getRankingGender(r);
      const ag = getRankingAgeGroup(r);
      const d = getRankingDiscipline(r);

      if (filterYear !== "All") {
        if (y == null) return false;
        if (String(y) !== String(filterYear)) return false;
      }
      if (filterSeason !== "All") {
        if ((s || "").toString().trim() !== String(filterSeason).trim()) return false;
      }
      if (filterGender !== "All") {
        if ((g || "").toString().toLowerCase() !== String(filterGender).toLowerCase())
          return false;
      }
      if (filterAgeGroup !== "All") {
        if ((ag || "").toString().toLowerCase() !== String(filterAgeGroup).toLowerCase())
          return false;
      }
      if (filterDiscipline !== "All") {
        if ((d || "").toString().toLowerCase() !== String(filterDiscipline).toLowerCase())
          return false;
      }
      return true;
    });
  }, [rankings, filterYear, filterSeason, filterGender, filterAgeGroup, filterDiscipline]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      let va;
      let vb;

      switch (sortKey) {
        case "rank":
          va = Number(a.rank);
          vb = Number(b.rank);
          if (!Number.isFinite(va)) va = 9999;
          if (!Number.isFinite(vb)) vb = 9999;
          break;
        case "points":
          va = Number(a.points);
          vb = Number(b.points);
          if (!Number.isFinite(va)) va = 0;
          if (!Number.isFinite(vb)) vb = 0;
          break;
        case "name":
          va = getRankingAthleteName(a).toLowerCase();
          vb = getRankingAthleteName(b).toLowerCase();
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
  }, [filterYear, filterSeason, filterGender, filterAgeGroup, filterDiscipline]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "name" ? "asc" : "asc");
  };

  const SortHeader = ({ activeKey, colKey, label }) => (
    <button
      type="button"
      onClick={() => toggleSort(colKey)}
      className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-[#008000]"
    >
      {label}
      {sortKey === activeKey ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  const openCreate = () => {
    setEditingId(null);
    setManualPhoto(false);
    setForm(emptyForm());
    setPanelOpen(true);
  };

  const openEdit = (r) => {
    setEditingId(r._id);
    const existingPhoto = thumbSrc(getRankingAthletePhoto(r)) || getRankingAthletePhoto(r) || "";
    // Preserve the existing ranking photo by default (only auto-fill when it's empty).
    setManualPhoto(Boolean(existingPhoto));
    const athleteName = getRankingAthleteName(r);
    setForm({
      athleteName: athleteName || "",
      athletePhoto: existingPhoto,
      province: getRankingProvince(r) || "Punjab",
      gender: getRankingGender(r) || "Male",
      ageGroup: getRankingAgeGroup(r) || "Senior",
      discipline: getRankingDiscipline(r) || "Kumite",
      weightClass: getRankingWeightClass(r) || "",
      rank: r.rank != null ? String(r.rank) : "",
      points: r.points != null ? String(r.points) : "",
      year: getRankingYear(r) != null ? String(getRankingYear(r)) : String(new Date().getFullYear()),
      season: getRankingSeason(r) || "",
      clubName: getRankingClubName(r) || "",
      description: r.description || "",
    });
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setManualPhoto(false);
    setForm(emptyForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.athleteName.trim()) {
      toast.error("Athlete Name is required");
      return;
    }
    if (!form.province) {
      toast.error("Province is required");
      return;
    }
    if (!form.gender) {
      toast.error("Gender is required");
      return;
    }
    if (!form.ageGroup) {
      toast.error("Age Group is required");
      return;
    }
    if (!form.discipline) {
      toast.error("Discipline is required");
      return;
    }

    if (form.discipline === "Kumite" && !String(form.weightClass).trim()) {
      toast.error("Weight Class is required for Kumite");
      return;
    }

    const { payload, rankNum, pointsNum, yearNum } = buildRankingPayloadFromForm(form);
    if (!Number.isFinite(rankNum)) {
      toast.error("Rank is required and must be a number");
      return;
    }
    if (!Number.isFinite(pointsNum)) {
      toast.error("Points is required and must be a number");
      return;
    }
    if (!Number.isFinite(yearNum)) {
      toast.error("Year is required and must be a number");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/admin/rankings/${editingId}`, payload);
        toast.success("Ranking updated");
      } else {
        await axios.post("/admin/rankings", payload);
        toast.success("Ranking created");
      }

      closePanel();
      setSortKey("rank");
      setSortDir("asc");
      fetchRankings();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.data?.message ||
          err?.message ||
          "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    const name = getRankingAthleteName(r);
    if (!window.confirm(`Delete ranking for "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/admin/rankings/${r._id}`);
      toast.success("Ranking deleted");
      fetchRankings();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed");
    }
  };

  const handlePhotoUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setManualPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((f) => ({ ...f, athletePhoto: dataUrl }));
    };
    reader.onerror = () => toast.error("Could not read image file");
    reader.readAsDataURL(file);
  };

  // CSV import handlers
  const openCsvImport = () => {
    setCsvModalOpen(true);
    setCsvFileName("");
    setCsvPreviewRows([]);
    setCsvPreviewError("");
    setImporting(false);
    setImportProgress({ current: 0, total: 0 });
    setImportResult({ imported: 0, failed: [] });

    // Trigger file selection after modal opens so user sees context.
    setTimeout(() => fileInputRef.current?.click(), 50);
  };

  const onCsvFileSelected = async (file) => {
    if (!file) return;
    setCsvFileName(file.name);
    setCsvPreviewError("");
    setCsvPreviewRows([]);
    setImporting(false);
    setImportProgress({ current: 0, total: 0 });
    setImportResult({ imported: 0, failed: [] });

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        setCsvPreviewError("CSV is empty.");
        return;
      }

      const headers = rows[0];
      if (!headers || headers.length === 0) {
        setCsvPreviewError("CSV header row is missing.");
        return;
      }

      const headerIndexToNorm = {};
      headers.forEach((h, i) => {
        headerIndexToNorm[i] = normalizeHeader(h);
      });

      // Validate at least a few expected keys are present
      const normalizedHeadersSet = new Set(Object.values(headerIndexToNorm));
      const expected = [
        "athletename",
        "rank",
        "points",
        "discipline",
        "category",
        "year",
      ];
      const hasSomeExpected = expected.some((k) => normalizedHeadersSet.has(k));
      if (!hasSomeExpected) {
        setCsvPreviewError(
          "CSV headers don't look right. Expected headers like AthleteName, Rank, Points, Discipline, Year."
        );
        // still allow preview parsing, but likely won't import.
      }

      const preview = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r || r.every((x) => String(x).trim() === "")) continue;
        const { payload } = buildRankingPayloadFromCsvRow(r, headerIndexToNorm);
        preview.push(payload);
      }

      setCsvPreviewRows(preview);
      if (preview.length === 0) setCsvPreviewError("No data rows found.");
    } catch (e) {
      setCsvPreviewError(e?.message || "Failed to parse CSV.");
    }
  };

  const confirmImportCsv = async () => {
    if (!csvPreviewRows.length) {
      toast.error("Nothing to import");
      return;
    }

    setImporting(true);
    setImportProgress({ current: 0, total: csvPreviewRows.length });
    setImportResult({ imported: 0, failed: [] });

    let imported = 0;
    const failed = [];

    for (let i = 0; i < csvPreviewRows.length; i++) {
      const rowPayload = csvPreviewRows[i];
      setImportProgress({ current: i + 1, total: csvPreviewRows.length });

      // Basic client-side validation based on spec (and backward-compat for older schema)
      const reasons = [];
      if (!String(rowPayload.athleteName || "").trim()) reasons.push("Missing athleteName/name");
      if (!Number.isFinite(Number(rowPayload.rank))) reasons.push("Missing rank");
      if (!Number.isFinite(Number(rowPayload.points))) reasons.push("Missing points");
      if (!String(rowPayload.discipline || rowPayload.category || "").trim())
        reasons.push("Missing discipline/category");
      if (!Number.isFinite(Number(rowPayload.year))) reasons.push("Missing year");
      if (!String(rowPayload.province || "").trim()) reasons.push("Missing province");
      if (!String(rowPayload.gender || "").trim()) reasons.push("Missing gender");
      if (!String(rowPayload.ageGroup || rowPayload.division || "").trim()) reasons.push("Missing ageGroup/division");
      if (
        String(rowPayload.discipline || rowPayload.category || "") === "Kumite" &&
        !String(rowPayload.weightClass || "").trim()
      )
        reasons.push("Missing weightClass for Kumite");

      if (reasons.length) {
        failed.push({ index: i, reason: reasons.join("; ") });
        continue;
      }

      try {
        await axios.post("/admin/rankings", rowPayload);
        imported++;
      } catch (e) {
        failed.push({
          index: i,
          reason:
            e?.response?.data?.message ||
            e?.response?.data?.data?.message ||
            e?.message ||
            "Request failed",
        });
      }
    }

    setImportResult({ imported, failed });
    setImporting(false);
    toast.success(`Import done: ${imported} imported, ${failed.length} failed`);
    fetchRankings();
  };

  const clearRankingsByYearSeason = async () => {
    if (filterYear === "All" || filterSeason === "All") {
      toast.error("Select a specific Year and Season first");
      return;
    }

    const target = rankings.filter((r) => {
      const y = getRankingYear(r);
      const s = getRankingSeason(r);
      return y != null && String(y) === String(filterYear) && (s || "").trim() === filterSeason;
    });

    const ids = target.map((r) => r._id).filter(Boolean);
    if (!ids.length) {
      toast.error("No rankings found for the selected Year & Season");
      return;
    }

    if (
      !window.confirm(
        `This will DELETE ALL rankings for ${filterYear} / ${filterSeason} (${ids.length} entries).`
      )
    )
      return;

    const typed = window.prompt("Type DELETE to confirm:", "");
    if (typed !== "DELETE") return;

    let success = 0;
    const failed = [];
    for (let i = 0; i < ids.length; i++) {
      try {
        await axios.delete(`/admin/rankings/${ids[i]}`);
        success++;
      } catch (e) {
        failed.push({
          id: ids[i],
          reason: e?.response?.data?.message || e?.message || "Delete failed",
        });
      }
    }

    toast.success(
      `Clear completed: ${success} deleted${failed.length ? `, ${failed.length} failed` : ""}`
    );
    fetchRankings();
  };

  const targetForClearCount = useMemo(() => {
    if (filterYear === "All" || filterSeason === "All") return 0;
    return rankings.filter((r) => {
      const y = getRankingYear(r);
      const s = getRankingSeason(r);
      return y != null && String(y) === String(filterYear) && (s || "").trim() === filterSeason;
    }).length;
  }, [rankings, filterYear, filterSeason]);

  return (
    <div className="p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Rankings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all PKF rankings by year/season, division, and discipline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openCreate}
            className="px-5 py-2 rounded-xl bg-[#008000] text-white font-semibold"
          >
            Add Ranking Entry
          </button>
          <button
            type="button"
            onClick={openCsvImport}
            className="px-5 py-2 rounded-xl border border-gray-300 font-semibold text-sm bg-white hover:bg-gray-50"
          >
            Import CSV
          </button>
          <a
            href="/rankings"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl border border-gray-300 font-semibold text-sm bg-white hover:bg-gray-50 text-[#008000]"
          >
            Preview Public View
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="All">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Season
            </label>
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="All">All Seasons</option>
              {seasonOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="All">All Genders</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Age Group
            </label>
            <select
              value={filterAgeGroup}
              onChange={(e) => setFilterAgeGroup(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="All">All Age Groups</option>
              {AGE_GROUPS.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Discipline
            </label>
            <select
              value={filterDiscipline}
              onChange={(e) => setFilterDiscipline(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="All">All Disciplines</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="text-xs text-gray-500">
            Showing <span className="font-semibold">{sorted.length}</span> result(s)
          </div>
          <button
            type="button"
            onClick={clearRankingsByYearSeason}
            disabled={filterYear === "All" || filterSeason === "All" || targetForClearCount === 0}
            className="px-4 py-2 rounded-xl border border-red-300 font-semibold text-sm text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear Rankings
          </button>
        </div>
      </div>

      {loadingRankings ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-3 text-left">
                    <SortHeader activeKey="name" colKey="name" label="Athlete" />
                  </th>
                  <th className="px-3 py-3 text-left">Photo</th>
                  <th className="px-3 py-3 text-left">Country</th>
                  <th className="px-3 py-3 text-left">Province</th>
                  <th className="px-3 py-3 text-left">Gender</th>
                  <th className="px-3 py-3 text-left">Age Group</th>
                  <th className="px-3 py-3 text-left">Discipline</th>
                  <th className="px-3 py-3 text-left hidden md:table-cell">
                    Weight Class
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortHeader activeKey="rank" colKey="rank" label="Rank" />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <SortHeader activeKey="points" colKey="points" label="Points" />
                  </th>
                  <th className="px-3 py-3 text-left">Year</th>
                  <th className="px-3 py-3 text-left">Season</th>
                  <th className="px-3 py-3 text-left hidden lg:table-cell">
                    Club Name
                  </th>
                  <th className="px-3 py-3 text-left hidden xl:table-cell">
                    _id
                  </th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => {
                  const name = getRankingAthleteName(r) || "—";
                  const photo = getRankingAthletePhoto(r);
                  const photoUrl = thumbSrc(photo);
                  return (
                    <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{name}</td>
                      <td className="px-3 py-2">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt=""
                            loading="lazy"
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#008000]/10 text-[#008000] flex items-center justify-center text-xs font-bold border border-[#008000]/20">
                            {initials(name)}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{getRankingCountry(r)}</td>
                      <td className="px-3 py-2 text-gray-700">{getRankingProvince(r) || "—"}</td>
                      <td className="px-3 py-2 text-gray-700">{getRankingGender(r) || "—"}</td>
                      <td className="px-3 py-2 text-gray-700">{getRankingAgeGroup(r) || "—"}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {getRankingDiscipline(r) || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700 hidden md:table-cell">
                        {getRankingWeightClass(r) || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900 font-semibold">
                        {r.rank != null ? r.rank : "—"}
                      </td>
                      <td className="px-3 py-2 text-[#008000] font-semibold">
                        {r.points != null ? r.points : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {getRankingYear(r) != null ? getRankingYear(r) : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{getRankingSeason(r) || "—"}</td>
                      <td className="px-3 py-2 text-gray-700 hidden lg:table-cell">
                        {getRankingClubName(r) || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700 hidden xl:table-cell">
                        {r._id}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="text-[#008000] font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sorted.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No rankings found.</p>
          ) : (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Page {pageSafe} of {totalPages} · {sorted.length} total
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pageSafe <= 1}
                  onClick={() => setPage((x) => Math.max(1, x - 1))}
                  className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pageSafe >= totalPages}
                  onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
                  className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Slide-over */}
      {panelOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            aria-hidden
            onClick={closePanel}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">
                {editingId ? "Edit Ranking" : "Add Ranking Entry"}
              </h3>
              <button
                type="button"
                onClick={closePanel}
                className="text-2xl leading-none text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Athlete Name *
                </label>
                <input
                  value={form.athleteName}
                  onChange={(e) => {
                    setManualPhoto(false);
                    setForm((f) => ({ ...f, athleteName: e.target.value }));
                  }}
                  list="athletes-list"
                  placeholder={loadingPlayers ? "Loading players..." : "Start typing..."}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  required
                />
                <datalist id="athletes-list">
                  {players.map((p) => (
                    <option key={p._id} value={p.name || ""} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Athlete Photo (file or auto-populate)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
                  className="text-sm w-full"
                />
                {form.athletePhoto ? (
                  <img
                    src={thumbSrc(form.athletePhoto)}
                    alt=""
                    loading="lazy"
                    className="mt-2 h-32 w-full object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="mt-2 h-32 w-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No photo selected
                  </div>
                )}
                {manualPhoto ? (
                  <div className="mt-2 text-xs text-gray-500">
                    Using uploaded photo. Change Athlete Name to auto-populate again.
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Province *
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, province: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    {PROVINCES.map((pr) => (
                      <option key={pr} value={pr}>
                        {pr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Age Group *
                  </label>
                  <select
                    value={form.ageGroup}
                    onChange={(e) => setForm((f) => ({ ...f, ageGroup: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    {AGE_GROUPS.map((ag) => (
                      <option key={ag} value={ag}>
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Discipline *
                  </label>
                  <select
                    value={form.discipline}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, discipline: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Weight Class {form.discipline === "Kumite" ? "*" : ""}
                </label>
                <input
                  value={form.weightClass}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, weightClass: e.target.value }))
                  }
                  placeholder={form.discipline === "Kumite" ? "-67kg" : "- (optional)"}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  required={form.discipline === "Kumite"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rank *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.rank}
                    onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Points *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.points}
                    onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    min={2000}
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Season
                  </label>
                  <input
                    value={form.season}
                    onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
                    placeholder="e.g. 2026 Season 1"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Club Name
                </label>
                <input
                  value={form.clubName}
                  onChange={(e) => setForm((f) => ({ ...f, clubName: e.target.value }))}
                  placeholder="Optional"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4 pb-8">
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#008000] text-white font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}

      {/* CSV Import Modal */}
      {csvModalOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[80]"
            onClick={() => {
              if (!importing) setCsvModalOpen(false);
            }}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 z-[90] w-full max-w-4xl bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold">Import Rankings CSV</div>
                <div className="text-sm text-gray-600 mt-1">
                  Headers should match ranking fields (e.g. AthleteName, AthletePhoto, Province, Gender, AgeGroup, Discipline, WeightClass, Rank, Points, Year, Season, ClubName).
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!importing) setCsvModalOpen(false);
                }}
                className="text-2xl leading-none text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => onCsvFileSelected(e.target.files?.[0] ?? null)}
            />

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {csvPreviewError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                  {csvPreviewError}
                </div>
              ) : null}

              {!importing ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-700">
                      {csvFileName ? (
                        <>
                          File: <span className="font-semibold">{csvFileName}</span>
                        </>
                      ) : (
                        "Choose a CSV file to preview."
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-sm bg-white hover:bg-gray-50"
                    >
                      Select Another File
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left">Athlete</th>
                          <th className="px-3 py-2 text-left">Province</th>
                          <th className="px-3 py-2 text-left">Gender</th>
                          <th className="px-3 py-2 text-left">Age</th>
                          <th className="px-3 py-2 text-left">Discipline</th>
                          <th className="px-3 py-2 text-left hidden md:table-cell">
                            Weight
                          </th>
                          <th className="px-3 py-2 text-left">Rank</th>
                          <th className="px-3 py-2 text-left">Points</th>
                          <th className="px-3 py-2 text-left">Year</th>
                          <th className="px-3 py-2 text-left hidden lg:table-cell">
                            Season
                          </th>
                          <th className="px-3 py-2 text-left hidden xl:table-cell">
                            Club
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreviewRows.slice(0, 25).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="px-3 py-2 font-medium">
                              {row.athleteName || row.name || "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700">{row.province || "—"}</td>
                            <td className="px-3 py-2 text-gray-700">{row.gender || "—"}</td>
                            <td className="px-3 py-2 text-gray-700">{row.ageGroup || row.division || "—"}</td>
                            <td className="px-3 py-2 text-gray-700">{row.discipline || row.category || "—"}</td>
                            <td className="px-3 py-2 text-gray-700 hidden md:table-cell">
                              {row.weightClass || "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700">{row.rank ?? "—"}</td>
                            <td className="px-3 py-2 text-[#008000] font-semibold">
                              {row.points ?? "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700">{row.year ?? "—"}</td>
                            <td className="px-3 py-2 text-gray-700 hidden lg:table-cell">
                              {row.season || "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-700 hidden xl:table-cell">
                              {row.clubName || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {csvPreviewRows.length > 25 ? (
                    <div className="text-xs text-gray-500">
                      Showing first 25 rows of {csvPreviewRows.length} for preview.
                    </div>
                  ) : null}

                  <div className="flex gap-3 pt-2 pb-6">
                    <button
                      type="button"
                      onClick={() => setCsvModalOpen(false)}
                      disabled={importing}
                      className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmImportCsv}
                      disabled={importing || csvPreviewRows.length === 0}
                      className="flex-1 py-3 rounded-xl bg-[#008000] text-white font-semibold disabled:opacity-50"
                    >
                      {importing ? "Importing…" : `Confirm Import (${csvPreviewRows.length})`}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">Importing…</div>
                      <div className="text-sm text-gray-600">
                        {importProgress.current} / {importProgress.total}
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#008000]"
                        style={{
                          width:
                            importProgress.total > 0
                              ? `${Math.round(
                                  (importProgress.current / importProgress.total) * 100
                                )}%`
                              : "0%",
                          transition: "width 200ms ease",
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Each row is posted individually to `/api/admin/rankings`.
                    </div>
                  </div>

                  {importResult.failed.length ? (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-900">
                        Import results
                      </div>
                      <div className="text-sm text-gray-600">
                        Imported: {importResult.imported} · Failed:{" "}
                        {importResult.failed.length}
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-3 py-2 text-left">Row</th>
                              <th className="px-3 py-2 text-left">Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importResult.failed.slice(0, 25).map((f, idx) => (
                              <tr key={`${f.index}-${idx}`} className="border-b border-gray-100">
                                <td className="px-3 py-2 text-gray-700">{f.index + 2}</td>
                                <td className="px-3 py-2 text-red-700">{f.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {importResult.failed.length > 25 ? (
                        <div className="text-xs text-gray-500">
                          Showing first 25 failures of {importResult.failed.length}.
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex gap-3 pt-2 pb-6">
                    <button
                      type="button"
                      onClick={() => setCsvModalOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}