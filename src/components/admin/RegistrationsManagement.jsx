import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig.js";

export default function RegistrationsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/admin/registrations");
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load registrations.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/admin/registrations/${id}/status`, { status });
      fetchItems();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Failed to update status.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Event Registrations</h2>
          <p className="text-sm text-gray-600">Review and approve/reject submitted registrations.</p>
        </div>
        <button
          onClick={fetchItems}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No registrations found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {r.fullName} <span className="text-gray-500">({r.email})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Phone: {r.phone} • Category: {r.category} • Club: {r.club}
                  </div>
                  <div className="text-sm text-gray-600">
                    Event: {r.eventId?.name || "—"}
                  </div>
                  <div className="text-sm">
                    Status: <span className="font-semibold">{r.status}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {r.paymentScreenshot?.url ? (
                    <a
                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-center"
                      href={r.paymentScreenshot.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Screenshot
                    </a>
                  ) : null}
                  <button
                    onClick={() => updateStatus(r._id, "approved")}
                    className="px-4 py-2 rounded-xl bg-[#008000] text-white font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r._id, "rejected")}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

