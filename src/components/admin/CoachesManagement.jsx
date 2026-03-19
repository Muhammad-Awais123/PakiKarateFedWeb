import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const emptyForm = () => ({
  name: "",
  province: "Punjab",
  specialization: "",
  qualifications: "",
  yearsOfExperience: "",
  achievements: [""],
  bio: "",
  isActive: true,
});

function thumbSrc(photo) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${API_ORIGIN}${photo}`;
}

export default function CoachesManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const { data } = await axios.get("/admin/coaches");
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load coaches");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  useEffect(() => setPage(1), [search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setPhotoFile(null);
    setPanelOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name || "",
      province: c.province || "Punjab",
      specialization: c.specialization || "",
      qualifications: c.qualifications || "",
      yearsOfExperience:
        c.yearsOfExperience != null ? String(c.yearsOfExperience) : "",
      achievements:
        Array.isArray(c.achievements) && c.achievements.length
          ? [...c.achievements]
          : [""],
      bio: c.bio || "",
      isActive: c.isActive !== false,
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
    setPhotoFile(null);
  };

  const setAchievement = (i, v) => {
    setForm((f) => {
      const a = [...f.achievements];
      a[i] = v;
      return { ...f, achievements: a };
    });
  };
  const addAchievement = () =>
    setForm((f) => ({ ...f, achievements: [...f.achievements, ""] }));
  const removeAchievement = (i) =>
    setForm((f) => ({
      ...f,
      achievements: f.achievements.filter((_, j) => j !== i).length
        ? f.achievements.filter((_, j) => j !== i)
        : [""],
    }));

  const buildFormData = () => {
    const fd = new FormData();
    const ach = form.achievements.map((s) => s.trim()).filter(Boolean);
    fd.append("name", form.name.trim());
    fd.append("province", form.province);
    fd.append("specialization", form.specialization.trim());
    fd.append("qualifications", form.qualifications.trim());
    if (form.yearsOfExperience !== "")
      fd.append("yearsOfExperience", form.yearsOfExperience);
    fd.append("achievements", JSON.stringify(ach));
    fd.append("bio", form.bio);
    fd.append("isActive", String(form.isActive));
    if (photoFile) fd.append("photo", photoFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const fd = buildFormData();
      if (editingId) {
        await axios.put(`/admin/coaches/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Coach updated");
      } else {
        await axios.post("/admin/coaches", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Coach created");
      }
      closePanel();
      fetchList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (c) => {
    if (!window.confirm(`Delete coach "${c.name}"?`)) return;
    axios
      .delete(`/admin/coaches/${c._id}`)
      .then(() => {
        toast.success("Coach deleted");
        fetchList();
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Delete failed"));
  };

  return (
    <div className="p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Coaches</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm min-w-[200px]"
          />
          <button
            type="button"
            onClick={openCreate}
            className="px-5 py-2 rounded-xl bg-[#008000] text-white font-semibold"
          >
            Add New Coach
          </button>
        </div>
      </div>

      {loading ? (
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
                  <th className="px-3 py-3 text-left">Photo</th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left hidden md:table-cell">Province</th>
                  <th className="px-3 py-3 text-left">Specialization</th>
                  <th className="px-3 py-3 text-center">Active</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((c) => (
                  <tr key={c._id} className="border-b border-gray-100">
                    <td className="px-3 py-2">
                      {thumbSrc(c.photo) ? (
                        <img
                          src={thumbSrc(c.photo)}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 text-gray-600 hidden md:table-cell">
                      {c.province || "—"}
                    </td>
                    <td className="px-3 py-2 max-w-[140px] truncate">
                      {c.specialization || "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {c.isActive !== false ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="text-[#008000] font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No coaches found.</p>
          ) : (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                Page {pageSafe} of {totalPages} · {filtered.length} total
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

      {panelOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closePanel}
            aria-hidden
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">
                {editingId ? "Edit Coach" : "Add Coach"}
              </h3>
              <button
                type="button"
                onClick={closePanel}
                className="text-2xl leading-none text-gray-500"
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
                  Full Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="text-sm w-full"
                />
                {(photoPreview ||
                  (editingId &&
                    thumbSrc(items.find((x) => x._id === editingId)?.photo))) ? (
                  <img
                    src={
                      photoPreview ||
                      thumbSrc(items.find((x) => x._id === editingId)?.photo)
                    }
                    alt=""
                    loading="lazy"
                    className="mt-2 h-32 w-full object-cover rounded-xl border"
                  />
                ) : null}
              </div>
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
                  Specialization
                </label>
                <input
                  value={form.specialization}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialization: e.target.value }))
                  }
                  placeholder="Kumite, Fitness"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Qualifications
                </label>
                <input
                  value={form.qualifications}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, qualifications: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.yearsOfExperience}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      yearsOfExperience: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Achievements
                  </label>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="text-xs font-semibold text-[#008000]"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {form.achievements.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={a}
                        onChange={(e) => setAchievement(i, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeAchievement(i)}
                        className="px-2 text-red-600 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="rounded border-gray-300 text-[#008000]"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
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
    </div>
  );
}
