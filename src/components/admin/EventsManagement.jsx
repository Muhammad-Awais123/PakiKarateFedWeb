import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";

const LEVEL_OPTIONS = ["National", "International"];
const TYPE_OPTIONS = ["Games", "Championship"];
const CATEGORY_OPTIONS = ["Men", "Women", "Junior", "Senior", "our_event", "external_event"];
const STATUS_OPTIONS = ["upcoming", "ongoing", "completed", "cancelled"];
const MAJOR_CATEGORY_OPTIONS = [
  "national_championship",
  "provincial_circuit",
  "open_tournament",
  "youth_circuit",
  "international",
  "multisport",
  "para_karate",
  "training_camp",
  "other",
];

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
        seriesName: ev.seriesName || "",
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
      seriesName: ev.seriesName || "",
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
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Core Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={newEvent.event_name}
                onChange={(e) => setNewEvent((p) => ({ ...p, event_name: e.target.value, name: e.target.value }))}
                placeholder="Event Name"
                className="border rounded-xl px-3 py-2"
              />
              <select
                value={newEvent.level}
                onChange={(e) => setNewEvent((p) => ({ ...p, level: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                {LEVEL_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                {TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent((p) => ({ ...p, category: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                {CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select
                value={newEvent.status}
                onChange={(e) => setNewEvent((p) => ({ ...p, status: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select
                value={newEvent.majorCategory}
                onChange={(e) => setNewEvent((p) => ({ ...p, majorCategory: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                {MAJOR_CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Dates and Location</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="date" value={newEvent.startDate} onChange={(e) => setNewEvent((p) => ({ ...p, startDate: e.target.value }))} className="border rounded-xl px-3 py-2" />
              <input type="date" value={newEvent.endDate} onChange={(e) => setNewEvent((p) => ({ ...p, endDate: e.target.value }))} className="border rounded-xl px-3 py-2" />
              <input type="date" value={newEvent.registrationDeadline} onChange={(e) => setNewEvent((p) => ({ ...p, registrationDeadline: e.target.value }))} className="border rounded-xl px-3 py-2" />
              <input value={newEvent.location} onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.venue} onChange={(e) => setNewEvent((p) => ({ ...p, venue: e.target.value }))} placeholder="Venue" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.city} onChange={(e) => setNewEvent((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.province} onChange={(e) => setNewEvent((p) => ({ ...p, province: e.target.value }))} placeholder="Province" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.country} onChange={(e) => setNewEvent((p) => ({ ...p, country: e.target.value }))} placeholder="Country" className="border rounded-xl px-3 py-2" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Publishing and Registration</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={newEvent.seriesName} onChange={(e) => setNewEvent((p) => ({ ...p, seriesName: e.target.value }))} placeholder="Series Name (optional)" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.registrationLink} onChange={(e) => setNewEvent((p) => ({ ...p, registrationLink: e.target.value }))} placeholder="Registration Link (optional)" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.externalUrl} onChange={(e) => setNewEvent((p) => ({ ...p, externalUrl: e.target.value }))} placeholder="External URL (optional)" className="border rounded-xl px-3 py-2" />
              <input value={newEvent.hashtag} onChange={(e) => setNewEvent((p) => ({ ...p, hashtag: e.target.value }))} placeholder="Hashtag (optional)" className="border rounded-xl px-3 py-2" />
              <textarea value={newEvent.description} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="border rounded-xl px-3 py-2 sm:col-span-2" rows={3} />
              <textarea value={newEvent.metaDescription} onChange={(e) => setNewEvent((p) => ({ ...p, metaDescription: e.target.value }))} placeholder="Meta Description (optional)" className="border rounded-xl px-3 py-2 sm:col-span-2" rows={2} />
              <select value={newEvent.eventOwnership} onChange={(e) => setNewEvent((p) => ({ ...p, eventOwnership: e.target.value }))} className="border rounded-xl px-3 py-2">
                <option value="pkf_event">pkf_event</option>
                <option value="external_event">external_event</option>
              </select>
              <select
                value={newEvent.categoryId}
                onChange={(e) => setNewEvent((p) => ({ ...p, categoryId: e.target.value }))}
                className="border rounded-xl px-3 py-2"
              >
                <option value="">Legacy Category (optional)</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {[
                ["isPublished", "Published"],
                ["isFeatured", "Featured"],
                ["registrationOpen", "Registration Open"],
                ["showCountdown", "Show Countdown"],
                ["statusOverride", "Status Override"],
              ].map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(newEvent[key])}
                    onChange={(e) => setNewEvent((p) => ({ ...p, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Media Uploads</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Banner Image</label>
                <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files?.[0] ?? null)} />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Bulletin PDF</label>
                <input type="file" accept="application/pdf" onChange={(e) => setBulletinPdf(e.target.files?.[0] ?? null)} />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Programme PDF</label>
                <input type="file" accept="application/pdf" onChange={(e) => setProgrammePdf(e.target.files?.[0] ?? null)} />
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
            placeholder="Search events..."
            className="border rounded-xl px-3 py-2 min-w-[220px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
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