import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../utils/axiosConfig.js";
import { API_ORIGIN } from "../../utils/axiosConfig.js";
import toast from "react-hot-toast";

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

const POLL_MS = 60_000;

function paymentUrl(r) {
  const u = r?.paymentScreenshot?.url;
  if (!u) return null;
  return u.startsWith("http") ? u : `${API_ORIGIN}${u}`;
}

function displayName(r) {
  const fn = (r.firstName || "").trim();
  const ln = (r.lastName || "").trim();
  if (fn || ln) return `${fn} ${ln}`.trim();
  return r.fullName || "—";
}

function eventTitle(r) {
  const ev = r.eventId;
  if (!ev) return "—";
  return ev.title || ev.name || "—";
}

export default function RegistrationsManagement() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchAt, setLastFetchAt] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const [statFilter, setStatFilter] = useState(null);
  const [eventId, setEventId] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(() => new Set());
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [imgZoom, setImgZoom] = useState(1);

  const fetchItems = useCallback(async () => {
    try {
      const params = {};
      if (eventId && eventId !== "All") params.eventId = eventId;
      const { data } = await axios.get("/admin/registrations", { params });
      setItems(Array.isArray(data?.data) ? data.data : []);
      setLastFetchAt(Date.now());
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load registrations");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await axios.get("/admin/events");
      setEvents(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const t = setInterval(() => fetchItems(), POLL_MS);
    return () => clearInterval(t);
  }, [fetchItems]);

  useEffect(() => {
    if (!lastFetchAt) return;
    const tick = () =>
      setSecondsAgo(Math.floor((Date.now() - lastFetchAt) / 1000));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [lastFetchAt]);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    axios
      .get(`/admin/registrations/${detailId}`)
      .then((res) => setDetail(res?.data?.data || null))
      .catch(() => {
        setDetail(null);
        toast.error("Could not load details");
      });
  }, [detailId]);

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((r) => r.status === "pending").length;
    const approved = items.filter((r) => r.status === "approved").length;
    const rejected = items.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (statFilter === "pending") list = list.filter((r) => r.status === "pending");
    else if (statFilter === "approved")
      list = list.filter((r) => r.status === "approved");
    else if (statFilter === "rejected")
      list = list.filter((r) => r.status === "rejected");

    if (statusFilter !== "All") {
      list = list.filter((r) => r.status === statusFilter.toLowerCase());
    }
    if (provinceFilter !== "All") {
      list = list.filter((r) => (r.province || "") === provinceFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const name = displayName(r).toLowerCase();
        const em = (r.email || "").toLowerCase();
        return name.includes(q) || em.includes(q);
      });
    }
    return list;
  }, [items, statFilter, statusFilter, provinceFilter, search]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pendingIds = filtered
      .filter((r) => r.status === "pending")
      .map((r) => r._id);
    const allSelected = pendingIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pendingIds.forEach((id) => next.delete(id));
      else pendingIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const updateStatus = async (id, status, reason = "") => {
    try {
      await axios.put(`/admin/registrations/${id}/status`, {
        status,
        ...(status === "rejected" ? { rejectionReason: reason } : {}),
      });
      toast.success(status === "approved" ? "Approved" : "Rejected");
      fetchItems();
      if (detailId === id) {
        const { data } = await axios.get(`/admin/registrations/${id}`);
        setDetail(data?.data || null);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const handleBulkApprove = async () => {
    const ids = [...selected].filter((id) => {
      const r = items.find((x) => x._id === id);
      return r && r.status === "pending";
    });
    if (ids.length === 0) {
      toast.error("Select pending registrations");
      return;
    }
    if (
      !window.confirm(`Approve ${ids.length} registration(s)?`)
    )
      return;
    for (const id of ids) {
      try {
        await axios.put(`/admin/registrations/${id}/status`, {
          status: "approved",
        });
      } catch {
        toast.error(`Failed for ${id}`);
      }
    }
    toast.success("Bulk approve completed");
    setSelected(new Set());
    fetchItems();
  };

  const exportCsv = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "Event",
        "Category",
        "Province",
        "Status",
        "Submitted",
        "CNIC",
      ].join(","),
    ];
    filtered.forEach((r) => {
      const name = displayName(r).replace(/"/g, '""');
      const ev = eventTitle(r).replace(/"/g, '""');
      rows.push(
        [
          `"${name}"`,
          `"${(r.email || "").replace(/"/g, '""')}"`,
          `"${(r.phone || "").replace(/"/g, '""')}"`,
          `"${ev}"`,
          `"${(r.category || "").replace(/"/g, '""')}"`,
          `"${(r.province || "").replace(/"/g, '""')}"`,
          r.status,
          r.createdAt
            ? new Date(r.createdAt).toISOString()
            : "",
          `"${(r.cnic || "").replace(/"/g, '""')}"`,
        ].join(",")
      );
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("CSV downloaded");
  };

  const statusBadge = (s) => {
    if (s === "approved")
      return "bg-green-100 text-green-800 border-green-200";
    if (s === "rejected")
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-amber-100 text-amber-900 border-amber-200";
  };

  const pendingSelectable = filtered.filter((r) => r.status === "pending");
  const allPendingSelected =
    pendingSelectable.length > 0 &&
    pendingSelectable.every((r) => selected.has(r._id));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Event Registrations</h2>
          <p className="text-sm text-gray-600">
            Review payment proofs and approve or reject.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastFetchAt ? `${secondsAgo}s ago` : "—"} · Auto-refresh
            every 60s
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchItems();
            }}
            className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-sm"
          >
            Refresh now
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { key: null, label: "Total", value: stats.total },
          { key: "pending", label: "Pending", value: stats.pending },
          { key: "approved", label: "Approved", value: stats.approved },
          { key: "rejected", label: "Rejected", value: stats.rejected },
        ].map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() =>
              setStatFilter((prev) => (prev === c.key ? null : c.key))
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statFilter === c.key
                ? "border-[#008000] bg-green-50 ring-2 ring-[#008000]/20"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase">
              {c.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-2xl border border-gray-200 bg-white">
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm min-w-[180px]"
        >
          <option value="All">All Events</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title || ev.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
        >
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All Provinces" : p}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-gray-300 rounded-xl px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          type="button"
          onClick={handleBulkApprove}
          disabled={![...selected].some((id) =>
            items.find((r) => r._id === id && r.status === "pending")
          )}
          className="px-4 py-2 rounded-xl bg-[#008000] text-white font-semibold text-sm disabled:opacity-40"
        >
          Bulk Approve Selected
        </button>
        <span className="text-xs text-gray-500">
          Only pending rows can be selected
        </span>
      </div>

      {loading && items.length === 0 ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-2xl">
          No registrations match filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-2 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                    title="Select all pending"
                  />
                </th>
                <th className="px-2 py-3 text-left w-10">#</th>
                <th className="px-3 py-3 text-left">Name</th>
                <th className="px-3 py-3 text-left hidden lg:table-cell">Event</th>
                <th className="px-3 py-3 text-left">Category</th>
                <th className="px-3 py-3 text-left hidden md:table-cell">Province</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">Submitted</th>
                <th className="px-3 py-3 text-center">Payment</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const url = paymentUrl(r);
                return (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-2 py-2">
                      {r.status === "pending" ? (
                        <input
                          type="checkbox"
                          checked={selected.has(r._id)}
                          onChange={() => toggleSelect(r._id)}
                          className="rounded border-gray-300"
                        />
                      ) : (
                        <span className="inline-block w-4" />
                      )}
                    </td>
                    <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{displayName(r)}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell max-w-[160px] truncate">
                      {eventTitle(r)}
                    </td>
                    <td className="px-3 py-2">{r.category || "—"}</td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {r.province || "—"}
                    </td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap text-xs">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {url ? (
                        <button
                          type="button"
                          onClick={() => setLightboxUrl(url)}
                          className="text-[#008000] font-semibold text-xs hover:underline"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusBadge(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap space-x-1">
                      {r.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateStatus(r._id, "approved")}
                            className="text-green-700 font-bold px-1"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectTarget(r._id);
                              setRejectReason("");
                            }}
                            className="text-red-600 font-bold px-1"
                            title="Reject"
                          >
                            ✗
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setDetailId(r._id);
                          setImgZoom(1);
                        }}
                        className="text-gray-700 px-1"
                        title="View details"
                      >
                        👁
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {lightboxUrl ? (
        <div
          className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
          role="presentation"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setLightboxUrl(null)}
          >
            ×
          </button>
          <img
            src={lightboxUrl}
            alt="Payment proof"
            loading="lazy"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}

      {detailId && detail ? (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setDetailId(null)}
          />
          <div className="fixed inset-y-0 right-0 z-[65] w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">Registration Details</h3>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="text-2xl text-gray-500 leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Name</span>
                <div className="font-semibold">{displayName(detail)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Email</span>
                  <div>{detail.email}</div>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <div>{detail.phone}</div>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Event</span>
                <div>{eventTitle(detail)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">DOB</span>
                  <div>
                    {detail.dob
                      ? new Date(detail.dob).toLocaleDateString("en-GB")
                      : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Gender</span>
                  <div>{detail.gender || "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Weight / Category</span>
                  <div>{detail.category || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Belt</span>
                  <div>{detail.beltGrade || "—"}</div>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Club</span>
                <div>{detail.club || "—"}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">City</span>
                  <div>{detail.city || "—"}</div>
                </div>
                <div>
                  <span className="text-gray-500">Province</span>
                  <div>{detail.province || "—"}</div>
                </div>
              </div>
              <div>
                <span className="text-gray-500">CNIC / B-Form</span>
                <div>{detail.cnic || "—"}</div>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusBadge(
                      detail.status
                    )}`}
                  >
                    {detail.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Submitted:{" "}
                  {detail.createdAt
                    ? new Date(detail.createdAt).toLocaleString("en-GB")
                    : "—"}
                  {detail.reviewedAt ? (
                    <>
                      <br />
                      Reviewed:{" "}
                      {new Date(detail.reviewedAt).toLocaleString("en-GB")}
                    </>
                  ) : null}
                </div>
              </div>
              {detail.status === "rejected" && detail.rejectionReason ? (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                  <div className="text-xs font-semibold text-red-800">
                    Rejection reason
                  </div>
                  <div className="text-sm text-red-900 mt-1">
                    {detail.rejectionReason}
                  </div>
                </div>
              ) : null}
              {paymentUrl(detail) ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-semibold">
                      Payment screenshot
                    </span>
                    <input
                      type="range"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={imgZoom}
                      onChange={(e) => setImgZoom(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <div className="overflow-auto max-h-64 rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <img
                      src={paymentUrl(detail)}
                      alt="Payment"
                      loading="lazy"
                      style={{
                        transform: `scale(${imgZoom})`,
                        transformOrigin: "top left",
                        maxWidth: `${100 / imgZoom}%`,
                      }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
              {detail.status === "pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      updateStatus(detail._id, "approved");
                      setDetailId(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#008000] text-white font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectTarget(detail._id);
                      setRejectReason("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-red-300 text-red-700 font-semibold"
                  >
                    Reject
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {rejectTarget ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50">
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-lg mb-2">Reject registration</h4>
            <p className="text-sm text-gray-600 mb-3">
              Reason is required and will be stored with the record.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              placeholder="Reason for rejection..."
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="flex-1 py-2 rounded-xl border border-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    toast.error("Enter a rejection reason");
                    return;
                  }
                  const rid = rejectTarget;
                  await updateStatus(rid, "rejected", rejectReason.trim());
                  setRejectTarget(null);
                  setRejectReason("");
                  if (detailId === rid) {
                    try {
                      const { data } = await axios.get(
                        `/admin/registrations/${rid}`
                      );
                      setDetail(data?.data || null);
                    } catch {
                      setDetailId(null);
                    }
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
