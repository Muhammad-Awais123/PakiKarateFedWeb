import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import {
  EVENT_LEVEL_OPTIONS,
  EVENT_TYPE_OPTIONS,
  EVENT_CATEGORY_OPTIONS,
  EVENT_STATUS_OPTIONS,
  EVENT_MAJOR_CATEGORY_OPTIONS,
  EVENT_SERIES_NAME_OPTIONS,
  EVENT_OWNERSHIP_OPTIONS,
} from "../../constants/eventEnums.js";

function coerceSeriesName(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "";
  return EVENT_SERIES_NAME_OPTIONS.includes(v) ? v : "";
}

/** Human-readable labels for `majorCategory` values (stored as snake_case). */
const MAJOR_CATEGORY_LABELS = {
  national_championship: "National championship",
  provincial_circuit: "Provincial circuit",
  open_tournament: "Open tournament",
  youth_circuit: "Youth circuit",
  international: "International",
  multisport: "Multisport games",
  para_karate: "Para karate",
  training_camp: "Training camp",
  other: "Other",
};

const EVENT_OWNERSHIP_LABELS = {
  pkf_event: "PKF-hosted event",
  external_event: "External / third-party event",
};

const FIELD_INPUT =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#008000] focus:ring-1 focus:ring-[#008000]/30 outline-none";
const FIELD_LABEL = "block text-sm font-semibold text-gray-800 mb-1";
const FIELD_HINT = "text-xs text-gray-500 mb-1.5 leading-relaxed";

const EMPTY_EVENT = {
  event_name: "",
  name: "",
  categoryId: "",
  level: "National",
  type: "Games",
  category: "Senior",
  majorCategory: "other",
  seriesName: "",
  status: "upcoming",
  location: "",
  city: "",
  venue: "",
  province: "",
  country: "Pakistan",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  description: "",
  registrationLink: "",
  registrationFee: "",
  eventOwnership: "pkf_event",
  externalUrl: "",
  isPublished: true,
  isFeatured: false,
  registrationOpen: false,
  showCountdown: true,
  statusOverride: false,
  hashtag: "",
  metaDescription: "",
};

const EventsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT);
  const [bannerImage, setBannerImage] = useState(null);
  const [bulletinPdf, setBulletinPdf] = useState(null);
  const [programmePdf, setProgrammePdf] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  function isoDateInput(d) {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString().slice(0, 10);
  }

  function normalizeCategoryId(categoryId) {
    if (!categoryId) return "";
    if (typeof categoryId === "string") return categoryId;
    if (typeof categoryId === "object") return categoryId._id || "";
    return "";
  }

  const fetchEvents = async () => {
    const { data } = await axios.get("/admin/events");
    setEvents(Array.isArray(data?.data) ? data.data : []);
  };

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => { fetchCategories(); }, []);

  const focusId = searchParams.get("focus");
  useEffect(() => {
    if (!focusId || events.length === 0) return;
    const ev = events.find((x) => String(x?._id) === String(focusId));
    const t = setTimeout(() => {
      document
        .getElementById(`event-row-${focusId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    if (ev) {
      setEditingId(ev._id);
      setSaveError("");
      setBannerImage(null);
      setBulletinPdf(null);
      setProgrammePdf(null);
      setNewEvent({
        event_name: ev.event_name || ev.title || ev.name || "",
        name: ev.name || ev.event_name || ev.title || "",
        categoryId: normalizeCategoryId(ev.categoryId),
        level: ev.level || "National",
        type: ev.type || "Games",
        category: ev.category || "Senior",
        majorCategory: ev.majorCategory || "other",
        seriesName: coerceSeriesName(ev.seriesName),
        status: ev.status || "upcoming",
        location: ev.location || "",
        city: ev.city || "",
        venue: ev.venue || "",
        province: ev.province || "",
        country: ev.country || "Pakistan",
        startDate: isoDateInput(ev.startDate || ev.date),
        endDate: isoDateInput(ev.endDate || ev.startDate || ev.date),
        registrationDeadline: isoDateInput(ev.registrationDeadline),
        description: ev.description || "",
        registrationLink: ev.registrationLink || "",
        registrationFee: ev.registrationFee || "",
        eventOwnership: ev.eventOwnership || "pkf_event",
        externalUrl: ev.externalUrl || "",
        isPublished: Boolean(ev.isPublished),
        isFeatured: Boolean(ev.isFeatured),
        registrationOpen: Boolean(ev.registrationOpen),
        showCountdown: ev.showCountdown !== false,
        statusOverride: Boolean(ev.statusOverride),
        hashtag: ev.hashtag || "",
        metaDescription: ev.metaDescription || "",
      });
    }

    return () => clearTimeout(t);
  }, [focusId, events]);

  const clearEdit = () => {
    setEditingId(null);
    setSaveError("");
    setBannerImage(null);
    setBulletinPdf(null);
    setProgrammePdf(null);
    setNewEvent(EMPTY_EVENT);

    const next = new URLSearchParams(searchParams);
    next.delete("focus");
    setSearchParams(next, { replace: true });
  };

  const beginEdit = (ev) => {
    if (!ev?._id) return;
    setEditingId(ev._id);
    setSaveError("");
    setBannerImage(null);
    setBulletinPdf(null);
    setProgrammePdf(null);
    setNewEvent({
      event_name: ev.event_name || ev.title || ev.name || "",
      name: ev.name || ev.event_name || ev.title || "",
      categoryId: normalizeCategoryId(ev.categoryId),
      level: ev.level || "National",
      type: ev.type || "Games",
      category: ev.category || "Senior",
      majorCategory: ev.majorCategory || "other",
      seriesName: coerceSeriesName(ev.seriesName),
      status: ev.status || "upcoming",
      location: ev.location || "",
      city: ev.city || "",
      venue: ev.venue || "",
      province: ev.province || "",
      country: ev.country || "Pakistan",
      startDate: isoDateInput(ev.startDate || ev.date),
      endDate: isoDateInput(ev.endDate || ev.startDate || ev.date),
      registrationDeadline: isoDateInput(ev.registrationDeadline),
      description: ev.description || "",
      registrationLink: ev.registrationLink || "",
      registrationFee: ev.registrationFee || "",
      eventOwnership: ev.eventOwnership || "pkf_event",
      externalUrl: ev.externalUrl || "",
      isPublished: Boolean(ev.isPublished),
      isFeatured: Boolean(ev.isFeatured),
      registrationOpen: Boolean(ev.registrationOpen),
      showCountdown: ev.showCountdown !== false,
      statusOverride: Boolean(ev.statusOverride),
      hashtag: ev.hashtag || "",
      metaDescription: ev.metaDescription || "",
    });
  };

  const visibleEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((ev) =>
        statusFilter === "all" ? true : String(ev.status || "").toLowerCase() === statusFilter
      )
      .filter((ev) => {
        if (!q) return true;
        const text = `${ev.event_name || ""} ${ev.name || ""} ${ev.title || ""} ${ev.location || ""}`.toLowerCase();
        return text.includes(q);
      });
  }, [events, query, statusFilter]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        ...newEvent,
        event_name: newEvent.event_name || newEvent.name,
        name: newEvent.name || newEvent.event_name,
      };

      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (typeof v === "boolean") fd.append(k, String(v));
        else fd.append(k, v ?? "");
      });

      if (bannerImage) fd.append("bannerImage", bannerImage);
      if (bulletinPdf) fd.append("bulletinPdf", bulletinPdf);
      if (programmePdf) fd.append("programmePdf", programmePdf);

      if (editingId) {
        await axios.put(`/admin/events/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/admin/events", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      clearEdit();
      await fetchEvents();
    } catch (e) {
      setSaveError(
        e?.response?.data?.message || e?.message || "Failed to save event"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/admin/events/${id}`);
    if (editingId && String(editingId) === String(id)) clearEdit();
    fetchEvents();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and update public events with complete metadata and publish controls.
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total events: <span className="font-semibold text-gray-900">{events.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-lg font-bold mb-4">{editingId ? "Edit Event" : "Create Event"}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Core details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-name">Event title</label>
                <p className={FIELD_HINT}>Public name shown on the website and in listings.</p>
                <input
                  id="ev-name"
                  value={newEvent.event_name}
                  onChange={(e) => setNewEvent((p) => ({ ...p, event_name: e.target.value, name: e.target.value }))}
                  placeholder="e.g. National Karate Championship 2026 — Lahore"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-level">Competition level</label>
                <p className={FIELD_HINT}>National (within Pakistan) or International.</p>
                <select
                  id="ev-level"
                  value={newEvent.level}
                  onChange={(e) => setNewEvent((p) => ({ ...p, level: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_LEVEL_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-type">Event format</label>
                <p className={FIELD_HINT}>Games (multi-sport style) or Championship (karate-focused).</p>
                <select
                  id="ev-type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-category">Participant / segment</label>
                <p className={FIELD_HINT}>Who this event is aimed at (Men, Women, Junior, Senior, etc.).</p>
                <select
                  id="ev-category"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent((p) => ({ ...p, category: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-status">Status</label>
                <p className={FIELD_HINT}>Workflow label. If &quot;Status override&quot; is off below, the site may still derive display status from dates.</p>
                <select
                  id="ev-status"
                  value={newEvent.status}
                  onChange={(e) => setNewEvent((p) => ({ ...p, status: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-major">Programme type</label>
                <p className={FIELD_HINT}>High-level classification for filters and reporting.</p>
                <select
                  id="ev-major"
                  value={newEvent.majorCategory}
                  onChange={(e) => setNewEvent((p) => ({ ...p, majorCategory: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_MAJOR_CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{MAJOR_CATEGORY_LABELS[option] || option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Dates &amp; venue</div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900 mb-2">What each date means</p>
              <ul className="space-y-2 text-xs sm:text-sm list-none">
                <li>
                  <span className="font-medium text-slate-800">Event start date</span>
                  {" — "}First day the event runs. Required. Used for schedules, listings, and countdowns.
                </li>
                <li>
                  <span className="font-medium text-slate-800">Event end date</span>
                  {" — "}Last day of the event. Required. For a single-day event, use the same date as start.
                </li>
                <li>
                  <span className="font-medium text-slate-800">Registration deadline</span>
                  {" — "}Last day to accept registrations on the site (optional). Leave empty if there is no fixed closing date.
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-start">Event start date</label>
                <p className={FIELD_HINT}>First competition or event day.</p>
                <input
                  id="ev-start"
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent((p) => ({ ...p, startDate: e.target.value }))}
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-end">Event end date</label>
                <p className={FIELD_HINT}>Final day; same as start for one-day events.</p>
                <input
                  id="ev-end"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent((p) => ({ ...p, endDate: e.target.value }))}
                  className={FIELD_INPUT}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-reg-dead">Registration deadline (optional)</label>
                <p className={FIELD_HINT}>Last date athletes can register through your website. Optional.</p>
                <input
                  id="ev-reg-dead"
                  type="date"
                  value={newEvent.registrationDeadline}
                  onChange={(e) => setNewEvent((p) => ({ ...p, registrationDeadline: e.target.value }))}
                  className={FIELD_INPUT}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-location">Location (short line)</label>
                <p className={FIELD_HINT}>One line for cards and headers, e.g. city and venue.</p>
                <input
                  id="ev-location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Punjab Sports Complex, Lahore"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-venue">Venue name</label>
                <p className={FIELD_HINT}>Building or hall name.</p>
                <input
                  id="ev-venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent((p) => ({ ...p, venue: e.target.value }))}
                  placeholder="e.g. Main indoor arena"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-city">City</label>
                <p className={FIELD_HINT}>Host city.</p>
                <input
                  id="ev-city"
                  value={newEvent.city}
                  onChange={(e) => setNewEvent((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Lahore"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-province">Province / region</label>
                <p className={FIELD_HINT}>Administrative region.</p>
                <input
                  id="ev-province"
                  value={newEvent.province}
                  onChange={(e) => setNewEvent((p) => ({ ...p, province: e.target.value }))}
                  placeholder="e.g. Punjab"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-country">Country</label>
                <p className={FIELD_HINT}>Defaults to Pakistan; change if abroad.</p>
                <input
                  id="ev-country"
                  value={newEvent.country}
                  onChange={(e) => setNewEvent((p) => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. Pakistan"
                  className={FIELD_INPUT}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Publishing &amp; registration</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-series">Series / circuit name</label>
                <p className={FIELD_HINT}>Optional. Official series name when the event belongs to a league or circuit.</p>
                <select
                  id="ev-series"
                  value={newEvent.seriesName}
                  onChange={(e) => setNewEvent((p) => ({ ...p, seriesName: e.target.value }))}
                  className={FIELD_INPUT}
                  aria-label="Series name"
                >
                  <option value="">None — not part of a named series</option>
                  {EVENT_SERIES_NAME_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-ownership">Event ownership</label>
                <p className={FIELD_HINT}>PKF-hosted vs external event (for linking out).</p>
                <select
                  id="ev-ownership"
                  value={newEvent.eventOwnership}
                  onChange={(e) => setNewEvent((p) => ({ ...p, eventOwnership: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  {EVENT_OWNERSHIP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{EVENT_OWNERSHIP_LABELS[opt] || opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-reg-link">External registration URL</label>
                <p className={FIELD_HINT}>If athletes register on another site, paste the full link (https://…).</p>
                <input
                  id="ev-reg-link"
                  value={newEvent.registrationLink}
                  onChange={(e) => setNewEvent((p) => ({ ...p, registrationLink: e.target.value }))}
                  placeholder="https://example.com/register"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-fee">Registration fee</label>
                <p className={FIELD_HINT}>Shown on the public registration form. Free text.</p>
                <input
                  id="ev-fee"
                  value={newEvent.registrationFee}
                  onChange={(e) => setNewEvent((p) => ({ ...p, registrationFee: e.target.value }))}
                  placeholder="e.g. PKR 3,500 per athlete"
                  className={FIELD_INPUT}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-ext-url">External information URL</label>
                <p className={FIELD_HINT}>For third-party events: link to official bulletin or results page.</p>
                <input
                  id="ev-ext-url"
                  value={newEvent.externalUrl}
                  onChange={(e) => setNewEvent((p) => ({ ...p, externalUrl: e.target.value }))}
                  placeholder="https://…"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-hashtag">Social hashtag</label>
                <p className={FIELD_HINT}>Without # — we can add it in templates if needed.</p>
                <input
                  id="ev-hashtag"
                  value={newEvent.hashtag}
                  onChange={(e) => setNewEvent((p) => ({ ...p, hashtag: e.target.value }))}
                  placeholder="e.g. PKFKarate2026"
                  className={FIELD_INPUT}
                />
              </div>
              <div>
                <label className={FIELD_LABEL} htmlFor="ev-legacy-cat">Website category (legacy)</label>
                <p className={FIELD_HINT}>Optional. Links to an older category taxonomy if you use it.</p>
                <select
                  id="ev-legacy-cat"
                  value={newEvent.categoryId}
                  onChange={(e) => setNewEvent((p) => ({ ...p, categoryId: e.target.value }))}
                  className={FIELD_INPUT}
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-desc">Full description</label>
                <p className={FIELD_HINT}>Schedule notes, eligibility, contact — shown on the public event page.</p>
                <textarea
                  id="ev-desc"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Outline the format, important rules, and any information athletes should know before registering."
                  className={`${FIELD_INPUT} min-h-[96px]`}
                  rows={4}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={FIELD_LABEL} htmlFor="ev-meta">Meta description (SEO)</label>
                <p className={FIELD_HINT}>Short summary for search engines (about 1–2 sentences).</p>
                <textarea
                  id="ev-meta"
                  value={newEvent.metaDescription}
                  onChange={(e) => setNewEvent((p) => ({ ...p, metaDescription: e.target.value }))}
                  placeholder="e.g. Pakistan Karate Federation national championship in Lahore — registration, schedule, and results."
                  className={`${FIELD_INPUT} min-h-[72px]`}
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className={`${FIELD_LABEL} mb-1`}>Visibility &amp; behaviour</p>
              <p className={`${FIELD_HINT} mb-3`}>Toggle how this event appears on the public site and whether visitors can register.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  ["isPublished", "Published on website", "Visible in public event lists when on."],
                  ["isFeatured", "Featured", "Highlight on homepage or featured areas where supported."],
                  ["registrationOpen", "Open for registration", "Show the on-site registration form on the event page."],
                  ["showCountdown", "Show countdown", "Display countdown to the start date where the theme supports it."],
                  ["statusOverride", "Lock manual status", "Use the Status field above as-is instead of inferring from dates."],
                ].map(([key, label, help]) => (
                  <label key={key} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={Boolean(newEvent[key])}
                      onChange={(e) => setNewEvent((p) => ({ ...p, [key]: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#008000] focus:ring-[#008000]"
                    />
                    <span className="text-sm">
                      <span className="font-medium text-gray-800">{label}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">{help}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Media</div>
            <p className={`${FIELD_HINT} mb-3`}>Uploads are optional when editing; leave blank to keep existing files.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={FIELD_LABEL}>Banner image</label>
                <p className={FIELD_HINT}>Hero image for the event page and cards. JPG or PNG recommended.</p>
                <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files?.[0] ?? null)} className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-[#008000] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
              </div>
              <div>
                <label className={FIELD_LABEL}>Bulletin PDF</label>
                <p className={FIELD_HINT}>Technical bulletin or invitation document.</p>
                <input type="file" accept="application/pdf" onChange={(e) => setBulletinPdf(e.target.files?.[0] ?? null)} className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
              </div>
              <div>
                <label className={FIELD_LABEL}>Programme PDF</label>
                <p className={FIELD_HINT}>Order of play or day-by-day programme.</p>
                <input type="file" accept="application/pdf" onChange={(e) => setProgrammePdf(e.target.files?.[0] ?? null)} className="text-sm text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
              </div>
            </div>
          </div>
        </div>

        {saveError ? (
          <div className="mt-3 text-sm text-red-700 font-semibold">
            {saveError}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#008000] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : editingId ? "Update Event" : "Add Event"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={clearEdit}
              disabled={saving}
              className="px-5 py-2 rounded-xl border border-gray-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by event name or location…"
            className={`${FIELD_INPUT} min-w-[220px]`}
            aria-label="Search events"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="all">All Statuses</option>
            {EVENT_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {visibleEvents.map((ev) => (
          <div
            key={ev._id}
            id={`event-row-${ev._id}`}
            className={`bg-white rounded-2xl border p-4 flex items-center justify-between ${
              focusId === ev._id
                ? "border-[#008000] ring-2 ring-[#008000]/30"
                : "border-gray-200"
            }`}
          >
            <div>
              <div className="font-semibold">{ev.event_name || ev.name}</div>
              <div className="text-sm text-gray-600">
                {ev.level} • {ev.type} • {ev.category} • {String(ev.status || "").toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {ev.location || "No location"} • {isoDateInput(ev.startDate)} → {isoDateInput(ev.endDate)}
              </div>
            </div>
            <div className="flex gap-2">
              {focusId === ev._id ? (
                <button
                  type="button"
                  onClick={clearEdit}
                  disabled={saving}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel edit
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  beginEdit(ev);
                  const next = new URLSearchParams(searchParams);
                  next.set("focus", ev._id);
                  setSearchParams(next, { replace: true });
                }}
                disabled={saving}
                className="px-3 py-2 rounded-xl border border-[#008000] text-[#008000] text-sm font-semibold hover:bg-[#008000]/5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ev._id)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;